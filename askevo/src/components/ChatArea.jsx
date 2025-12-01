import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import MessageBubble from './MessageBubble';
import ollamaService from '../services/ollamaService';
import genomicsApiService from '../services/genomicsApiService';
import chatService from '../services/chatService';
import voiceService from '../services/voiceService';
import '../styles/ChatArea.css';

import { Conversation, ConversationContent, ConversationScrollButton } from './AiConversation';

const ChatArea = ({ selectedSessionId, onSessionCreated }) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const containerRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [ollamaConnected, setOllamaConnected] = useState(false);
    const [modelName, setModelName] = useState('');
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const [abortController, setAbortController] = useState(null);

    // Initialize chat session or load existing one
    useEffect(() => {
        const initializeChat = async () => {
            if (selectedSessionId) {
                setCurrentSessionId(selectedSessionId);
                await loadMessages(selectedSessionId);
            } else {
                // Just show welcome message, don't create a session yet
                setCurrentSessionId(null);
                setMessages([{
                    id: 1,
                    text: `Hello ${user?.username || 'there'}! I am Progenics AI. How can I assist you with genomics today?`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }

            // Check Ollama connection
            try {
                const connected = await ollamaService.checkConnection();
                setOllamaConnected(connected);
                if (connected) {
                    setModelName(ollamaService.getModelName());
                } else {
                    console.warn('Ollama server is not connected');
                }
            } catch (error) {
                console.error('Failed to check Ollama connection:', error);
            }
        };

        if (user) {
            initializeChat();
        }
    }, [user, i18n.language, selectedSessionId]);

    const loadMessages = async (sessionId) => {
        try {
            setIsLoading(true);
            const fetchedMessages = await chatService.getSessionMessages(sessionId);
            console.log('[ChatArea] Loaded messages:', fetchedMessages);

            // Transform messages to match UI format
            const formattedMessages = fetchedMessages.map(msg => ({
                id: msg.id,
                text: msg.message_text,
                sender: msg.sender_type,
                timestamp: new Date(msg.created_at),
                liked: msg.liked,
                disliked: msg.disliked
            }));

            if (formattedMessages.length === 0) {
                setMessages([{ id: 1, text: `Hello ${user?.username || 'there'}! I am Progenics AI. How can I assist you with genomics today?`, sender: 'bot', timestamp: new Date() }]);
            } else {
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const buildContext = async (userMessage) => {
        try {
            let context = '';

            // Search for relevant genomics data
            const variantMatch = userMessage.match(/variant|mutation|SNP/i);
            const diseaseMatch = userMessage.match(/disease|disorder|condition/i);
            const testMatch = userMessage.match(/test|screening|diagnosis/i);

            if (variantMatch) {
                const variants = await genomicsApiService.searchVariants(userMessage);
                if (variants && variants.length > 0) {
                    context += `Relevant Variants: ${JSON.stringify(variants.slice(0, 2))}\n`;
                }
            }

            if (diseaseMatch) {
                const diseases = await genomicsApiService.searchDiseases(userMessage);
                if (diseases && diseases.length > 0) {
                    context += `Relevant Diseases: ${JSON.stringify(diseases.slice(0, 2))}\n`;
                }
            }

            if (testMatch) {
                const tests = await genomicsApiService.searchTests(userMessage);
                if (tests && tests.length > 0) {
                    context += `Relevant Tests: ${JSON.stringify(tests.slice(0, 2))}\n`;
                }
            }

            return context;
        } catch (error) {
            console.error('Error building context:', error);
            return '';
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        const newUserMsg = {
            id: Date.now(),
            text: userMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Create session if it doesn't exist (first message)
            let sessionId = currentSessionId;
            if (!sessionId) {
                console.log('Creating new session for first message...');
                const sessionResponse = await chatService.createSession(
                    userMessage.substring(0, 50), // Use first 50 chars as title
                    i18n.language
                );
                sessionId = sessionResponse.session_id;
                setCurrentSessionId(sessionId);
                console.log('Session created:', sessionId);

                // Notify parent to refresh sessions list
                if (onSessionCreated) {
                    onSessionCreated(sessionId);
                }
            }

            // Save user message to backend
            await chatService.saveMessage(
                parseInt(sessionId, 10), // Ensure it's an integer
                userMessage,
                'user',
                'text'
            );

            // Check if Ollama is available
            if (!ollamaConnected) {
                const errorMsg = {
                    id: Date.now() + 1,
                    text: 'Ollama server is not connected. Please ensure Ollama is running on http://localhost:11434',
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMsg]);
                setIsLoading(false);
                return;
            }

            // Build context from genomics data
            const context = await buildContext(userMessage);

            // Create initial bot message placeholder
            const botMsgId = Date.now() + 1;
            const botMsg = {
                id: botMsgId,
                text: '',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);

            // Stream response from Ollama
            let fullResponse = '';
            const abortController = new AbortController();
            setAbortController(abortController);

            await ollamaService.generateStreamResponse(
                userMessage,
                context,
                i18n.language, // Pass current language
                (chunk) => {
                    fullResponse += chunk;
                    setMessages(prev => prev.map(msg =>
                        msg.id === botMsgId
                            ? { ...msg, text: fullResponse }
                            : msg
                    ));
                },
                abortController.signal
            );

            setAbortController(null);

            // Save bot message to backend
            await chatService.saveMessage(
                parseInt(sessionId, 10), // Use local variable to ensure correct ID
                fullResponse,
                'bot',
                'text'
            );

            // Auto-speak response if enabled
            const autoSpeak = localStorage.getItem('autoSpeak') === 'true';
            if (autoSpeak) {
                const langMap = {
                    'en': 'en-US',
                    'es': 'es-ES',
                    'fr': 'fr-FR',
                    'hi': 'hi-IN',
                    'te': 'te-IN',
                    'ta': 'ta-IN',
                    'kn': 'kn-IN',
                    'bn': 'bn-IN',
                    'mr': 'mr-IN',
                    'ar': 'ar-SA',
                    'or': 'or-IN'
                };
                voiceService.speak(fullResponse, langMap[i18n.language] || 'en-US');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Generation stopped by user');
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId
                        ? { ...msg, text: fullResponse + ' [Stopped]' }
                        : msg
                ));
            } else {
                console.error('Error:', error);
                const errorMsg = {
                    id: Date.now() + 1,
                    text: `Error: ${error.message}. Please try again.`,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        } finally {
            setIsLoading(false);
            setAbortController(null);
        }
    };

    const handleStopGeneration = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (isListening) {
            voiceService.stopListening(recognitionRef.current);
            setIsListening(false);
        } else {
            const langMap = {
                'en': 'en-US',
                'es': 'es-ES',
                'fr': 'fr-FR',
                'hi': 'hi-IN',
                'te': 'te-IN',
                'ta': 'ta-IN',
                'kn': 'kn-IN',
                'bn': 'bn-IN',
                'mr': 'mr-IN',
                'ar': 'ar-SA',
                'or': 'or-IN'
            };

            recognitionRef.current = voiceService.startListening(
                (transcript) => {
                    setInputValue(transcript);
                },
                (error) => {
                    console.error('Voice error:', error);
                    setIsListening(false);
                },
                langMap[i18n.language] || 'en-US',
                () => {
                    setIsListening(false);
                }
            );
            setIsListening(true);
        }
    };

    const handleSpeak = (text) => {
        if (isSpeaking) {
            voiceService.stopSpeaking();
            setIsSpeaking(false);
        } else {
            const langMap = {
                'en': 'en-US',
                'es': 'es-ES',
                'fr': 'fr-FR',
                'hi': 'hi-IN',
                'te': 'te-IN',
                'ta': 'ta-IN',
                'kn': 'kn-IN',
                'bn': 'bn-IN',
                'mr': 'mr-IN',
                'ar': 'ar-SA',
                'or': 'or-IN'
            };
            voiceService.speak(text, langMap[i18n.language] || 'en-US', () => {
                setIsSpeaking(false);
            });
            setIsSpeaking(true);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleDelete = (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    const handleLike = (id) => console.log('Liked', id);
    const handleDislike = (id) => console.log('Disliked', id);
    const handleFeedback = (id) => console.log('Feedback', id);

    const handleRetry = async (message) => {
        // Find the user message immediately preceding this bot message
        const messageIndex = messages.findIndex(m => m.id === message.id);
        if (messageIndex > 0) {
            const previousMessage = messages[messageIndex - 1];
            if (previousMessage.sender === 'user') {
                // Remove the bot message and the user message (optional, or just re-trigger)
                // Actually, standard retry usually keeps history or replaces the last bot response.
                // Let's just re-trigger generation with the same user prompt.

                // Set input value to previous message text to simulate re-sending
                // Or better, directly call generation logic. 
                // For simplicity, let's populate input and focus, or just re-run handleSend logic if we refactor it.

                // Refactoring handleSend to accept text would be best, but for now:
                setInputValue(previousMessage.text);
                // Ideally we would trigger send immediately, but setting state is async.
                // Let's just set it so user can edit and send again, or click send.
            }
        }
    };

    const handleShare = (message) => {
        // Simple share implementation
        if (navigator.share) {
            navigator.share({
                title: 'Progenics AI Response',
                text: message.text,
            }).catch(console.error);
        } else {
            handleCopy(message.text);
            alert('Message copied to clipboard for sharing');
        }
    };

    return (
        <div className="chat-area">
            <Conversation>
                {/* Connection Status - Top Right */}
                <div className={`connection-status-top ${ollamaConnected ? 'connected' : 'disconnected'}`}>
                    <div className="status-dot"></div>
                    <span>
                        {ollamaConnected
                            ? `${modelName}`
                            : 'Disconnected'}
                    </span>
                </div>

                <div
                    className="ai-conversation-content"
                    ref={containerRef}
                    style={{ paddingBottom: '180px' }}
                >
                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onCopy={handleCopy}
                            onDelete={handleDelete}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onFeedback={handleFeedback}
                            onSpeak={msg.sender === 'bot' ? handleSpeak : null}
                            onRetry={msg.sender === 'bot' ? handleRetry : null}
                            onShare={msg.sender === 'bot' ? handleShare : null}
                        />
                    ))}
                    {isLoading && (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <p>{t('loading.generating')}</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <ConversationScrollButton containerRef={containerRef} />
            </Conversation>

            {/* Disclaimer - Above Input */}
            <p className="disclaimer-text">
                {isListening ? (
                    <span className="listening-indicator">
                        <span className="pulse-dot"></span> Listening...
                    </span>
                ) : (
                    t('chat.disclaimer')
                )}
            </p>

            <div className="input-area-wrapper">
                <form onSubmit={handleSend} className="input-container glass-panel">
                    <button type="button" className="attach-btn btn-icon">
                        <Paperclip size={20} />
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        className="chat-input"
                        disabled={isLoading}
                    />

                    <button
                        type="button"
                        className={`mic-btn btn-icon ${isListening ? 'active' : ''}`}
                        onClick={handleVoiceInput}
                        title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                        {isListening ? <Square size={20} /> : <Mic size={20} />}
                    </button>

                    {isLoading ? (
                        <button
                            type="button"
                            className="stop-btn btn-icon active"
                            onClick={handleStopGeneration}
                            title="Stop generation"
                        >
                            <Square size={18} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="send-btn btn-primary"
                            disabled={!inputValue.trim()}
                        >
                            <Send size={18} />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChatArea;

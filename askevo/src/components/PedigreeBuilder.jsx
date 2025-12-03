import React, { useState, useEffect, useRef } from 'react';
import { pedigreeApiService } from '../services/pedigreeApiService';
import { Send, FileText, Plus } from 'lucide-react';
import '../styles/PedigreeBuilder.css';

const PedigreeBuilder = () => {
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [treeData, setTreeData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const startNewSession = async () => {
        try {
            setIsLoading(true);
            const session = await pedigreeApiService.startSession(); // No client ID needed
            setSessionId(session.sessionId);
            setMessages([{ role: 'bot', content: session.message }]);
            setIsStarted(true);
        } catch (error) {
            console.error('Failed to start session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await pedigreeApiService.sendMessage(sessionId, userMsg);
            setMessages(prev => [...prev, { role: 'bot', content: response.message }]);
            if (response.treeData) {
                setTreeData(response.treeData);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, { role: 'bot', content: 'Error processing message. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isStarted) {
        return (
            <div className="pedigree-container">
                <div className="welcome-panel">
                    <h2>🧬 AI Genetic Counselor</h2>
                    <p>I can help you build a professional pedigree chart through a natural conversation.</p>
                    <p>I will ask you about the patient (proband) and their family history.</p>

                    <button className="btn-primary start-btn" onClick={startNewSession}>
                        <Plus size={20} /> Start New Pedigree Interview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pedigree-workspace">
            {/* Left: Chat */}
            <div className="pedigree-chat-panel">
                <div className="chat-header">
                    <h3>Pedigree Interview</h3>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    ))}
                    {isLoading && <div className="message bot"><div className="typing-indicator">...</div></div>}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-area">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Type your answer..."
                        disabled={isLoading}
                        autoFocus
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>

            {/* Right: Visualization */}
            <div className="pedigree-viz-panel">
                <div className="viz-header">
                    <h3>Live Pedigree Chart</h3>
                    <button className="btn-small"><FileText size={14} /> Export PED</button>
                </div>
                <div className="viz-canvas">
                    {treeData.length === 0 ? (
                        <div className="empty-state">
                            <p>Chart will appear here as you chat.</p>
                            <p className="hint">Try saying: "My name is John, 35 years old, Male"</p>
                        </div>
                    ) : (
                        <div className="tree-preview">
                            {/* Simple visualization for now */}
                            {treeData.map((person, i) => (
                                <div key={i} className={`tree-node ${person.sex.toLowerCase()} ${person.affected ? 'affected' : ''}`}>
                                    <span className="node-icon"></span>
                                    <span className="node-label">{person.name} ({person.age})</span>
                                    {Array.isArray(person.conditions) && person.conditions.length > 0 && (
                                        <span className="node-condition">{person.conditions.join(', ')}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PedigreeBuilder;

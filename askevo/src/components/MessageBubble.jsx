import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, ThumbsUp, ThumbsDown, MessageSquarePlus, Trash2, Check, Volume2, Square, Sparkles, RefreshCcw, Share2 } from 'lucide-react';
import { Actions, Action } from './AiActions';

const MessageBubble = ({ message, onCopy, onDelete, onLike, onDislike, onFeedback, onSpeak, onRetry, onShare }) => {
    const isUser = message.sender === 'user';
    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleCopy = () => {
        onCopy(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = () => {
        if (onSpeak) {
            onSpeak(message.text);
            setIsSpeaking(!isSpeaking);
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        setDisliked(false);
        onLike(message.id);
    };

    const handleDislike = () => {
        setDisliked(!disliked);
        setLiked(false);
        onDislike(message.id);
    };

    return (
        <div className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}>
            <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                <div className="message-content">
                    {isUser ? (
                        message.text
                    ) : (
                        <div className="bot-message-layout">
                            <div className="bot-icon-container">
                                <div className="bot-icon">
                                    <Sparkles size={20} fill="white" color="white" />
                                </div>
                            </div>
                            <div className="bot-text-content">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <div className="code-block">
                                                    <div className="code-header">
                                                        <span>{match[1]}</span>
                                                    </div>
                                                    <pre className={className} {...props}>
                                                        <code>{children}</code>
                                                    </pre>
                                                </div>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>

                                <Actions>
                                    <Action
                                        icon={RefreshCcw}
                                        label="Retry"
                                        onClick={() => onRetry && onRetry(message)}
                                    />
                                    <Action
                                        icon={ThumbsUp}
                                        label="Like"
                                        onClick={handleLike}
                                        active={liked}
                                    />
                                    <Action
                                        icon={ThumbsDown}
                                        label="Dislike"
                                        onClick={handleDislike}
                                        active={disliked}
                                    />
                                    <Action
                                        icon={copied ? Check : Copy}
                                        label={copied ? "Copied" : "Copy"}
                                        onClick={handleCopy}
                                    />
                                    <Action
                                        icon={Share2}
                                        label="Share"
                                        onClick={() => onShare && onShare(message)}
                                    />
                                    <Action
                                        icon={isSpeaking ? Square : Volume2}
                                        label={isSpeaking ? "Stop" : "Speak"}
                                        onClick={handleSpeak}
                                        active={isSpeaking}
                                    />
                                </Actions>
                            </div>
                        </div>
                    )}
                </div>

                {isUser && (
                    <div className="message-actions user-actions">
                        <button className="action-btn delete-btn" onClick={() => onDelete(message.id)} title="Delete">
                            <Trash2 size={14} />
                        </button>
                        <button className="action-btn" onClick={handleCopy} title="Copy">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;

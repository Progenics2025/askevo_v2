import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import '../styles/AiConversation.css';

export const Conversation = ({ children, className = '', style }) => {
    return (
        <div className={`ai-conversation ${className}`} style={style}>
            {children}
        </div>
    );
};

export const ConversationContent = ({ children, className = '' }) => {
    return (
        <div className={`ai-conversation-content ${className}`}>
            {children}
        </div>
    );
};

export const ConversationScrollButton = ({ containerRef }) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Show button if we are scrolled up more than 100px from bottom
            const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
            setShowButton(isScrolledUp);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [containerRef]);

    const scrollToBottom = () => {
        containerRef?.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    };

    if (!showButton) return null;

    return (
        <button
            className="ai-scroll-button"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
        >
            <ChevronDown size={20} />
        </button>
    );
};

import React from 'react';
import '../styles/AiActions.css';

export const Actions = ({ children, className = '' }) => {
    return (
        <div className={`ai-actions-container ${className}`}>
            {children}
        </div>
    );
};

export const Action = ({ icon: Icon, label, onClick, active = false }) => {
    return (
        <button
            className={`ai-action-btn ${active ? 'active' : ''}`}
            onClick={onClick}
            aria-label={label}
        >
            <Icon size={16} strokeWidth={2} />
            <span className="ai-action-tooltip">{label}</span>
        </button>
    );
};

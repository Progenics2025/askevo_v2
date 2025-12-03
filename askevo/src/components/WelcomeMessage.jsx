import React from 'react';
import { FileText } from 'lucide-react';
import '../styles/WelcomeMessage.css';

const WelcomeMessage = () => {
  return (
    <div className="welcome-message-container">
      <div className="welcome-content">
        <div className="welcome-icon">
          <FileText size={48} />
        </div>
        
        <h1 className="welcome-title">Welcome to AskEvo Genomics Assistant</h1>
        
        <p className="welcome-subtitle">
          Start a new consultation or select an existing one from the sidebar to begin analyzing genetic variants and providing clinical guidance.
        </p>
        
        <div className="welcome-disclaimer">
          <span className="disclaimer-label">Clinical Disclaimer:</span>
          <p>This AI assistant provides information for clinical decision support only. All recommendations should be validated against current clinical guidelines.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import '../styles/Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [autoSpeak, setAutoSpeak] = useState(localStorage.getItem('autoSpeak') === 'true');
  const [ollamaUrl, setOllamaUrl] = useState(
    localStorage.getItem('ollamaUrl') || 'http://localhost:11434'
  );
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('genomicsApiUrl') || 'http://localhost:3001/api'
  );

  const handleAutoSpeakChange = (e) => {
    const value = e.target.checked;
    setAutoSpeak(value);
    localStorage.setItem('autoSpeak', value);
  };

  const handleOllamaUrlChange = (e) => {
    const value = e.target.value;
    setOllamaUrl(value);
    localStorage.setItem('ollamaUrl', value);
  };

  const handleApiUrlChange = (e) => {
    const value = e.target.value;
    setApiUrl(value);
    localStorage.setItem('genomicsApiUrl', value);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <div className="settings-title">
            <SettingsIcon size={24} />
            <h2>Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h3>Language</h3>
            <LanguageSelector />
          </section>

          <section className="settings-section">
            <h3>Voice Settings</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={handleAutoSpeakChange}
              />
              <span>Auto-speak bot responses</span>
            </label>
          </section>

          <section className="settings-section">
            <h3>API Configuration</h3>
            <div className="input-group">
              <label>Ollama Server URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={handleOllamaUrlChange}
                placeholder="http://localhost:11434"
                className="settings-input"
              />
              <small>Default: http://localhost:11434</small>
            </div>

            <div className="input-group">
              <label>Genomics API URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={handleApiUrlChange}
                placeholder="http://localhost:3001/api"
                className="settings-input"
              />
              <small>Default: http://localhost:3001/api</small>
            </div>
          </section>

          <section className="settings-section info">
            <h3>About</h3>
            <p>Progenics AI - Genomics Chat Application</p>
            <p>Version 1.0.0</p>
            <p>Powered by Ollama (Gemma Model)</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;

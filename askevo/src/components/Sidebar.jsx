import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, User, X, LogOut, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './Settings';

const Sidebar = ({ isOpen, toggleSidebar, currentSessionId, onSelectSession, sessions = [], onDeleteSession }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleNewChat = () => {
        window.location.reload();
    };

    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation();
        e.preventDefault();

        // Delete immediately without confirmation
        if (onDeleteSession) {
            try {
                await onDeleteSession(sessionId);
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    // Group sessions by date
    const groupedSessions = sessions.reduce((acc, session) => {
        const date = new Date(session.created_at);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let key = 'Older';
        if (date.toDateString() === today.toDateString()) {
            key = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            key = 'Yesterday';
        } else if (date > new Date(today.setDate(today.getDate() - 7))) {
            key = 'Previous 7 Days';
        }

        if (!acc[key]) acc[key] = [];
        acc[key].push(session);
        return acc;
    }, {});

    const sessionGroups = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">askEVO</h2>
                </div>

                <div className="sidebar-content">
                    <button className="new-chat-btn" onClick={handleNewChat}>
                        <Plus size={20} />
                        <span>{t('chat.newChat')}</span>
                    </button>

                    <button className="new-chat-btn pedigree-btn" onClick={() => navigate('/pedigree')} style={{ marginTop: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <span style={{ marginRight: '8px' }}>🧬</span>
                        <span>Pedigree Builder</span>
                    </button>

                    <div className="history-container">
                        {sessionGroups.map(group => (
                            groupedSessions[group] && groupedSessions[group].length > 0 && (
                                <div key={group} className="history-section">
                                    <h3 className="section-divider">{group}</h3>
                                    <ul className="history-list">
                                        {groupedSessions[group].map((session) => (
                                            <li
                                                key={session.id}
                                                className={`history-item ${currentSessionId === session.id ? 'active' : ''}`}
                                                onClick={() => onSelectSession && onSelectSession(session.id)}
                                            >
                                                <span className="chat-icon">
                                                    <MessageSquare size={16} />
                                                </span>
                                                <span className="history-title" title={session.session_title}>
                                                    {session.session_title || 'New Chat'}
                                                </span>
                                                <button
                                                    className="delete-session-btn"
                                                    onClick={(e) => handleDeleteSession(e, session.id)}
                                                    title="Delete Chat"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button
                        className="settings-item"
                        onClick={() => setSettingsOpen(true)}
                    >
                        <Settings size={20} />
                        <span>{t('chat.settings')}</span>
                    </button>
                    <div className="user-profile">
                        <div className="avatar">
                            {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="User" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">
                                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'Admin User')}
                            </span>
                            <span className="user-email">{user?.email || 'admin@progenics.com'}</span>
                        </div>
                    </div>
                    <button
                        className="logout-btn"
                        onClick={async () => {
                            await logout();
                            navigate('/login');
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
};

export default Sidebar;

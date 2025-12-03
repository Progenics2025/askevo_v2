import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/ChatPage.css';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        try {
            const data = await chatService.getSessions();
            console.log('[ChatPage] Fetched sessions:', data);
            console.log('[ChatPage] Number of sessions:', data?.length || 0);
            setSessions(data || []);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setSessions([]);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSelectSession = (sessionId) => {
        setCurrentSessionId(sessionId);
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    const handleSessionCreated = (sessionId) => {
        setCurrentSessionId(sessionId);
        fetchSessions();
    };

    const handleDeleteSession = async (sessionId) => {
        console.log('[ChatPage] handleDeleteSession called with sessionId:', sessionId);
        try {
            console.log('[ChatPage] Calling chatService.archiveSession...');
            const result = await chatService.archiveSession(sessionId);
            console.log('[ChatPage] Archive response:', result);

            // If the deleted session was the current one, clear it
            if (currentSessionId === sessionId) {
                console.log('[ChatPage] Deleted session was current, clearing it');
                setCurrentSessionId(null);
            }
            // Always refresh the list
            console.log('[ChatPage] Fetching updated sessions...');
            await fetchSessions();
            console.log('[ChatPage] Sessions refreshed successfully');
        } catch (error) {
            console.error('[ChatPage] Failed to delete session:', error);
            alert('Failed to delete chat session. Check console for details.');
        }
    };

    return (
        <div className="chat-page">
            {/* Floating Toggle Button - Always Visible */}
            <button 
                className="floating-toggle-btn" 
                onClick={toggleSidebar}
                title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                currentSessionId={currentSessionId}
                onSelectSession={handleSelectSession}
                sessions={sessions}
                onDeleteSession={handleDeleteSession}
            />
            <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="top-bar">
                    <button className="menu-btn" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h1 className="page-title">Progenics AI Genomics Assistant</h1>
                </div>
                <ChatArea
                    selectedSessionId={currentSessionId}
                    onSessionCreated={handleSessionCreated}
                />
            </main>
        </div>
    );
};

export default ChatPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PedigreeBuilder from '../components/PedigreeBuilder';
import Sidebar from '../components/Sidebar';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import '../styles/ChatPage.css';

const PedigreePage = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        try {
            const data = await chatService.getSessions();
            setSessions(data || []);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSelectSession = (sessionId) => {
        // Navigate back to chat page
        // Ideally we pass the sessionId via state or URL, but ChatPage needs to support it.
        // For now, we just go back to chat.
        navigate('/chat');
    };

    return (
        <div className="chat-page">
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onSelectSession={handleSelectSession}
                sessions={sessions}
            />
            <div className="main-content">
                <PedigreeBuilder />
            </div>
        </div>
    );
};

export default PedigreePage;

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

// Axios instance with interceptor for auth token
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const pedigreeApiService = {
    // Get all clients
    async getClients() {
        const response = await apiClient.get('/pedigree/clients');
        return response.data;
    },

    // Create a new client
    async createClient(clientData) {
        const response = await apiClient.post('/pedigree/clients', clientData);
        return response.data;
    },

    // Start a pedigree session
    async startSession(clientId) {
        const response = await apiClient.post('/pedigree/start', { clientId });
        return response.data;
    },

    // Send a message in the chat
    async sendMessage(sessionId, message) {
        const response = await apiClient.post('/pedigree/chat', { sessionId, message });
        return response.data;
    },

    // Get session data (tree)
    async getSession(sessionId) {
        const response = await apiClient.get(`/pedigree/session/${sessionId}`);
        return response.data;
    }
};

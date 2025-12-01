import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

const chatClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
chatClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
chatClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const chatService = {
  // Sessions
  async createSession(title, language = 'en') {
    try {
      const response = await chatClient.post('/chat/sessions', {
        session_title: title,
        language,
      });
      return response.data;
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  },

  async getSessions() {
    try {
      const response = await chatClient.get('/chat/sessions');
      return response.data.sessions;
    } catch (error) {
      console.error('Get sessions error:', error);
      throw error;
    }
  },

  async getSessionMessages(sessionId) {
    try {
      const response = await chatClient.get(`/chat/sessions/${sessionId}/messages`);
      return response.data.messages;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  async archiveSession(sessionId) {
    try {
      const response = await chatClient.put(`/chat/sessions/${sessionId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Archive session error:', error);
      throw error;
    }
  },

  // Messages
  async saveMessage(sessionId, messageText, senderType, messageType = 'text', voiceUrl = null, fileUrl = null, fileName = null, fileSize = null) {
    try {
      const response = await chatClient.post('/chat/messages', {
        session_id: sessionId,
        message_text: messageText,
        sender_type: senderType,
        message_type: messageType,
        voice_url: voiceUrl,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
      });
      return response.data;
    } catch (error) {
      console.error('Save message error:', error);
      throw error;
    }
  },

  async updateMessageFeedback(messageId, liked, disliked, feedbackText = null) {
    try {
      const response = await chatClient.put(`/chat/messages/${messageId}/feedback`, {
        liked,
        disliked,
        feedback_text: feedbackText,
      });
      return response.data;
    } catch (error) {
      console.error('Update feedback error:', error);
      throw error;
    }
  },

  // Files
  async uploadFile(file, sessionId = null, description = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (sessionId) formData.append('session_id', sessionId);
      if (description) formData.append('description', description);

      const response = await chatClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  },

  async getFiles() {
    try {
      const response = await chatClient.get('/files');
      return response.data.files;
    } catch (error) {
      console.error('Get files error:', error);
      throw error;
    }
  },

  async downloadFile(fileId) {
    try {
      const response = await chatClient.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Download file error:', error);
      throw error;
    }
  },

  async deleteFile(fileId) {
    try {
      const response = await chatClient.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  },
};

export default chatService;

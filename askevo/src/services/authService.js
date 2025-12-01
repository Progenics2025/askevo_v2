import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

const authClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(username, email, password, firstName, lastName) {
    try {
      const response = await authClient.post('/auth/register', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await authClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await authClient.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;

import axios from 'axios';

// Configure this with your actual genomics API endpoint
const GENOMICS_API_URL = import.meta.env.VITE_GENOMICS_API_URL || `http://${window.location.hostname}:3001/api`;

const genomicsClient = axios.create({
  baseURL: GENOMICS_API_URL,
  timeout: 10000,
});

export const genomicsApiService = {
  // Fetch variant information
  async getVariant(variantId) {
    try {
      const response = await genomicsClient.get(`/variants/${variantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching variant:', error);
      throw error;
    }
  },

  async searchVariants(query) {
    try {
      const response = await genomicsClient.get('/variants/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching variants:', error);
      throw error;
    }
  },

  // Fetch disease information
  async getDisease(diseaseId) {
    try {
      const response = await genomicsClient.get(`/diseases/${diseaseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disease:', error);
      throw error;
    }
  },

  async searchDiseases(query) {
    try {
      const response = await genomicsClient.get('/diseases/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching diseases:', error);
      throw error;
    }
  },

  // Fetch diagnostic test information
  async getTest(testId) {
    try {
      const response = await genomicsClient.get(`/tests/${testId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test:', error);
      throw error;
    }
  },

  async searchTests(query) {
    try {
      const response = await genomicsClient.get('/tests/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tests:', error);
      throw error;
    }
  },

  // Get related information
  async getVariantDiseaseAssociation(variantId) {
    try {
      const response = await genomicsClient.get(`/associations/variant/${variantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching associations:', error);
      throw error;
    }
  },

  async getDiseaseTests(diseaseId) {
    try {
      const response = await genomicsClient.get(`/diseases/${diseaseId}/tests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disease tests:', error);
      throw error;
    }
  },

  // Check API connection
  async checkConnection() {
    try {
      const response = await genomicsClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Genomics API Connection Error:', error);
      return false;
    }
  }
};

export default genomicsApiService;

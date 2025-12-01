import axios from 'axios';

const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_URL || `http://${window.location.hostname}:11434`;
const MODEL_NAME = 'gemma3n:latest';

const ollamaClient = axios.create({
  baseURL: OLLAMA_API_URL,
  timeout: 60000,
});

export const ollamaService = {
  async generateResponse(prompt, context = '', language = 'en') {
    try {
      const languageMap = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil',
        'kn': 'Kannada',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'ar': 'Arabic',
        'or': 'Odia'
      };

      const languageName = languageMap[language] || 'English';
      const languageInstruction = `Please respond in ${languageName}. `;

      const fullPrompt = context
        ? `${languageInstruction}Context: ${context}\n\nQuestion: ${prompt}`
        : `${languageInstruction}${prompt}`;

      const response = await ollamaClient.post('/api/generate', {
        model: MODEL_NAME,
        prompt: fullPrompt,
        stream: false,
        temperature: 0.7,
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to generate response from Ollama');
    }
  },

  async generateStreamResponse(prompt, context = '', language = 'en', onChunk) {
    try {
      const languageMap = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'hi': 'Hindi',
        'te': 'Telugu',
        'ta': 'Tamil',
        'kn': 'Kannada',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'ar': 'Arabic',
        'or': 'Odia'
      };

      const languageName = languageMap[language] || 'English';
      const languageInstruction = `Please respond in ${languageName}. `;

      const fullPrompt = context
        ? `${languageInstruction}Context: ${context}\n\nQuestion: ${prompt}`
        : `${languageInstruction}${prompt}`;

      const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: fullPrompt,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullResponse += json.response;
              onChunk(json.response);
            }
            if (json.done) {
              break;
            }
          } catch (e) {
            console.warn('Error parsing JSON chunk', e);
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Ollama Stream Error:', error);
      throw new Error('Failed to stream response from Ollama');
    }
  },

  async checkConnection() {
    try {
      const response = await ollamaClient.get('/api/tags');
      return response.status === 200;
    } catch (error) {
      console.error('Ollama Connection Error:', error);
      return false;
    }
  },

  getModelName() {
    return MODEL_NAME;
  }
};

export default ollamaService;

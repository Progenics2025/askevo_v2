# Progenics AI - Genomics Chat Application

Welcome to Progenics AI, a comprehensive genomics chat application with voice input/output, multi-language support, and integration with Ollama and genomics APIs.

## 📚 Documentation Index

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide (START HERE!)
- **[GENOMICS_SETUP.md](./GENOMICS_SETUP.md)** - Comprehensive setup and usage guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What has been built

### Development
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System and component architecture
- **[FEATURES.md](./FEATURES.md)** - Complete feature list and capabilities
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

### Backend Integration
- **[GENOMICS_API_TEMPLATE.md](./GENOMICS_API_TEMPLATE.md)** - API backend template with examples

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Ollama Server
```bash
ollama pull gemma
ollama serve
```

### 2. Install Dependencies
```bash
cd "CHAT BOT NEW"
npm install
```

### 3. Run Application
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ✨ Key Features

✅ **Chat Interface** - Text messaging with bot responses
✅ **Voice Input** - Speech-to-text for hands-free queries
✅ **Voice Output** - Text-to-speech for bot responses
✅ **Multi-Language** - English, Spanish, French support
✅ **Ollama Integration** - Local LLM (Gemma model)
✅ **Genomics API** - Fetch variants, diseases, tests
✅ **Settings Panel** - Configure endpoints and preferences
✅ **Responsive Design** - Works on desktop and mobile

---

## 📋 What You Need

### Required
- **Node.js** 16+ (https://nodejs.org/)
- **Ollama** with Gemma model (https://ollama.ai)

### Optional but Recommended
- **Genomics API Server** (use template in GENOMICS_API_TEMPLATE.md)

---

## 🏗️ Project Structure

```
CHAT BOT NEW/
├── src/
│   ├── components/          # React components
│   │   ├── ChatArea.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LanguageSelector.jsx
│   │   └── Settings.jsx
│   ├── services/            # API services
│   │   ├── ollamaService.js
│   │   ├── genomicsApiService.js
│   │   └── voiceService.js
│   ├── config/              # Configuration
│   │   └── i18n.js
│   ├── styles/              # CSS files
│   └── pages/               # Page components
├── package.json
├── .env.example
└── Documentation files (this folder)
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
REACT_APP_OLLAMA_URL=http://localhost:11434
REACT_APP_OLLAMA_MODEL=gemma
REACT_APP_GENOMICS_API_URL=http://localhost:3001/api
REACT_APP_DEFAULT_LANGUAGE=en
```

### Runtime Settings
Access via Settings panel:
- Language selection
- Auto-speak toggle
- API endpoint URLs
- Voice preferences

---

## 💬 How to Use

### Text Chat
1. Type your question in the input field
2. Press Enter or click Send
3. AI responds with genomics information

### Voice Input
1. Click the microphone button
2. Speak your question
3. Text is transcribed automatically

### Voice Output
1. Click the speaker icon on any bot response
2. Response is read aloud
3. Click again to stop

### Language Selection
1. Click Settings in sidebar
2. Select your language
3. Interface updates immediately

---

## 🔌 API Integration

### Ollama API
- **Endpoint**: `http://localhost:11434/api/generate`
- **Model**: `gemma`
- **Purpose**: Generate AI responses about genomics

### Genomics API
- **Variants**: `/api/variants/search`, `/api/variants/{id}`
- **Diseases**: `/api/diseases/search`, `/api/diseases/{id}`
- **Tests**: `/api/tests/search`, `/api/tests/{id}`
- **Associations**: `/api/associations/variant/{id}`
- **Recommendations**: `/api/diseases/{id}/tests`

See **GENOMICS_API_TEMPLATE.md** for detailed API specifications.

---

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Chat | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ✅ |
| Voice Output | ✅ | ✅ | ✅ | ✅ |

---

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "axios": "^1.6.0",
  "i18next": "^23.7.0",
  "react-i18next": "^13.5.0",
  "lucide-react": "^0.555.0"
}
```

---

## 🚨 Troubleshooting

### Ollama Connection Error
```bash
# Ensure Ollama is running
ollama serve

# Verify connection
curl http://localhost:11434/api/tags
```

### API Connection Error
- Ensure your API server is running
- Check URL in Settings
- Verify API endpoints match expected format

### Voice Not Working
- Check microphone permissions
- Try a different browser
- Ensure microphone is connected

See **TROUBLESHOOTING.md** for more solutions.

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| QUICK_START.md | 5-minute setup guide |
| GENOMICS_SETUP.md | Detailed setup and usage |
| IMPLEMENTATION_SUMMARY.md | What has been built |
| ARCHITECTURE.md | System architecture |
| FEATURES.md | Feature list and capabilities |
| TROUBLESHOOTING.md | Common issues and solutions |
| GENOMICS_API_TEMPLATE.md | Backend API template |

---

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

---

## 🔐 Security Notes

- No authentication implemented (add as needed)
- No data persistence (add database as needed)
- CORS enabled for API calls
- Input validation on API responses
- No sensitive data in localStorage

---

## 📊 Performance

- Initial load: ~2 seconds
- Message send: ~1 second
- Voice input: Real-time
- Voice output: Real-time
- API response: Depends on server

---

## 🎯 Use Cases

### For Healthcare Professionals
- Quick genomics information lookup
- Variant interpretation assistance
- Disease information retrieval
- Test recommendation guidance

### For Genetic Counselors
- Patient education support
- Inheritance pattern explanation
- Risk assessment assistance
- Test selection guidance

### For Diagnostic Companies
- Variant database integration
- Test information management
- Clinical significance lookup
- Report generation support

---

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📝 Next Steps

1. **Read QUICK_START.md** for immediate setup
2. **Set up Ollama server** with Gemma model
3. **Create Genomics API** using the template
4. **Configure environment variables**
5. **Run the application**
6. **Customize as needed**

---

## 🤝 Contributing

To extend the application:

1. Add new languages in `src/config/i18n.js`
2. Create new components in `src/components/`
3. Add new services in `src/services/`
4. Update styles in `src/styles/`
5. Test thoroughly before deploying

---

## 📞 Support

### Common Issues
- See **TROUBLESHOOTING.md**

### Setup Help
- See **GENOMICS_SETUP.md**

### API Integration
- See **GENOMICS_API_TEMPLATE.md**

### Architecture Questions
- See **ARCHITECTURE.md**

---

## 📄 License

MIT

---

## 🎓 Learning Resources

### Technologies Used
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **i18next**: https://www.i18next.com
- **Ollama**: https://ollama.ai
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

### Genomics Resources
- **ClinVar**: https://www.ncbi.nlm.nih.gov/clinvar/
- **OMIM**: https://www.omim.org/
- **Ensembl**: https://www.ensembl.org/
- **UniProt**: https://www.uniprot.org/

---

## 🎉 You're All Set!

Your genomics chat application is ready to use. Start with **QUICK_START.md** and enjoy building!

For questions or issues, refer to the appropriate documentation file above.

**Happy coding! 🧬**

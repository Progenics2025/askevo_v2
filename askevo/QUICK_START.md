# Quick Start Guide - Progenics AI

Get your genomics chat application running in 5 minutes.

## Step 1: Start Ollama Server

```bash
# Install Ollama from https://ollama.ai (if not already installed)

# Pull the Gemma model
ollama pull gemma

# Start the server (runs on http://localhost:11434)
ollama serve
```

Keep this terminal open. You should see:
```
Listening on 127.0.0.1:11434
```

## Step 2: Set Up Genomics API (Optional but Recommended)

Create a simple Node.js API server or use the template provided in `GENOMICS_API_TEMPLATE.md`.

Quick setup with Node.js:

```bash
# Create a new directory for the API
mkdir genomics-api
cd genomics-api

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors

# Create server.js with the template code from GENOMICS_API_TEMPLATE.md

# Start the server
node server.js
```

The API should run on `http://localhost:3001`

## Step 3: Install and Run the Chat Application

```bash
# Navigate to the chat application directory
cd "CHAT BOT NEW"

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 4: Configure Settings (Optional)

1. Open the application in your browser
2. Click the Settings button in the sidebar
3. Verify the API URLs:
   - Ollama URL: `http://localhost:11434`
   - Genomics API URL: `http://localhost:3001/api`
4. Enable "Auto-speak" if you want voice output
5. Select your preferred language

## Step 5: Start Chatting!

1. Type a genomics question, e.g.:
   - "What is BRCA1?"
   - "Tell me about breast cancer genetics"
   - "What tests are available for genetic screening?"

2. Or use voice input:
   - Click the microphone button
   - Speak your question
   - The text will be transcribed automatically

3. Listen to responses:
   - Click the speaker icon on any bot response
   - The response will be read aloud

## Troubleshooting

### "Failed to connect to Ollama server"
- Ensure Ollama is running: `ollama serve`
- Check that it's on `http://localhost:11434`
- Update the URL in Settings if needed

### "Failed to connect to API"
- Ensure your genomics API is running
- Check the URL in Settings
- If you don't have an API, the app will still work but won't fetch genomics data

### Voice input not working
- Check microphone permissions in your browser
- Try a different browser (Chrome/Edge recommended)
- Ensure your microphone is working

### Voice output not working
- Check speaker volume
- Ensure audio permissions are granted
- Try a different browser

## What's Included

✅ Chat interface with message history
✅ Voice input (speech-to-text)
✅ Voice output (text-to-speech)
✅ Multi-language support (English, Spanish, French)
✅ Ollama integration (Gemma model)
✅ Genomics API integration
✅ Settings panel
✅ Responsive design

## Next Steps

1. **Customize the UI**: Edit CSS files in `src/styles/`
2. **Add more languages**: Update `src/config/i18n.js`
3. **Integrate real genomics data**: Update `GENOMICS_API_TEMPLATE.md` with your data sources
4. **Deploy**: Run `npm run build` and deploy the `dist` folder

## File Structure

```
CHAT BOT NEW/
├── src/
│   ├── components/
│   │   ├── ChatArea.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LanguageSelector.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── ollamaService.js
│   │   ├── genomicsApiService.js
│   │   └── voiceService.js
│   ├── config/
│   │   └── i18n.js
│   ├── styles/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── GENOMICS_SETUP.md
├── GENOMICS_API_TEMPLATE.md
└── QUICK_START.md
```

## Support

For detailed setup instructions, see `GENOMICS_SETUP.md`
For API integration details, see `GENOMICS_API_TEMPLATE.md`

Happy chatting! 🧬

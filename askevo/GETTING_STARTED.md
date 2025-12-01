# Getting Started - Progenics AI

## 🎯 Your First 30 Minutes

### Minute 1-5: Read This
You're reading it! This guide will get you up and running.

### Minute 6-10: Install Ollama
```bash
# Visit https://ollama.ai and download Ollama
# Then run:
ollama pull gemma
```

### Minute 11-15: Install Dependencies
```bash
cd "CHAT BOT NEW"
npm install
```

### Minute 16-20: Start Servers
**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Application:**
```bash
cd "CHAT BOT NEW"
npm run dev
```

### Minute 21-30: Use the App
1. Open http://localhost:5173
2. Type a question about genomics
3. Click Send
4. See the AI respond!

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start Ollama
ollama serve

# Pull Gemma model
ollama pull gemma
```

---

## 📍 What You'll See

### On First Load
```
┌─────────────────────────────────────────┐
│  Progenics AI                      ☰    │
├─────────────────────────────────────────┤
│                                         │
│  Hello! I am Progenics AI.              │
│  How can I assist you today?            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Ask about genomics...      🎤 ➤ │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Progenics AI can make mistakes...      │
└─────────────────────────────────────────┘
```

### After Sending a Message
```
┌─────────────────────────────────────────┐
│  Progenics AI                      ☰    │
├─────────────────────────────────────────┤
│                                         │
│  You: What is BRCA1?                    │
│                                         │
│  Bot: BRCA1 is a tumor suppressor...    │
│       [Copy] [🔊] [👍] [👎] [💬]       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Ask about genomics...      🎤 ➤ │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🎤 Try These Features

### 1. Text Chat
```
Type: "What is a genetic variant?"
Press: Enter
Result: AI responds with explanation
```

### 2. Voice Input
```
Click: Microphone button 🎤
Speak: "Tell me about BRCA1"
Result: Text appears in input field
```

### 3. Voice Output
```
Click: Speaker icon 🔊 on bot message
Result: Message is read aloud
```

### 4. Language Switching
```
Click: Settings (bottom of sidebar)
Select: Español or Français
Result: UI updates to new language
```

---

## 🔧 Configuration

### Default Settings
- Ollama: http://localhost:11434
- API: http://localhost:3001/api
- Language: English

### Change Settings
1. Click Settings button (bottom of sidebar)
2. Update any values
3. Changes save automatically

---

## 🐛 Troubleshooting

### "Failed to connect to Ollama"
```bash
# Make sure Ollama is running
ollama serve

# In another terminal, verify:
curl http://localhost:11434/api/tags
```

### "npm install fails"
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps
```

### "Voice not working"
1. Check microphone permissions
2. Try a different browser
3. Ensure microphone is connected

---

## 📚 Next Steps

### After Getting Started
1. Read **QUICK_START.md** for more details
2. Read **GENOMICS_SETUP.md** for advanced setup
3. Set up your genomics API (optional)
4. Customize the UI (optional)
5. Deploy to production (optional)

### Documentation Files
- **README_GENOMICS.md** - Main documentation
- **QUICK_START.md** - 5-minute setup
- **GENOMICS_SETUP.md** - Detailed setup
- **TROUBLESHOOTING.md** - Problem solving
- **FEATURES.md** - Feature list

---

## ✅ Checklist

- [ ] Ollama installed
- [ ] Gemma model pulled
- [ ] Dependencies installed
- [ ] Ollama server running
- [ ] Application running
- [ ] Can send text messages
- [ ] Can use voice input
- [ ] Can hear voice output
- [ ] Can switch languages
- [ ] Can access settings

---

## 🎉 You're Ready!

Your genomics chat application is ready to use. Start chatting and exploring!

### Example Questions to Try
- "What is BRCA1?"
- "Tell me about cystic fibrosis"
- "What genetic tests are available?"
- "Explain genetic inheritance patterns"
- "What is a pathogenic variant?"

---

## 💡 Pro Tips

1. **Use voice input** for hands-free queries
2. **Enable auto-speak** in settings for audio responses
3. **Switch languages** to practice different languages
4. **Copy responses** to save important information
5. **Check settings** if something isn't working

---

## 🆘 Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Verify Ollama is running
3. Check browser console (F12) for errors
4. Try a different browser
5. Restart the application

---

## 🚀 What's Next?

### Short Term
- [ ] Explore all features
- [ ] Try different questions
- [ ] Test voice capabilities
- [ ] Switch languages

### Medium Term
- [ ] Set up genomics API
- [ ] Customize UI
- [ ] Add more languages
- [ ] Deploy locally

### Long Term
- [ ] Deploy to production
- [ ] Integrate real data
- [ ] Add more features
- [ ] Share with others

---

## 📞 Quick Reference

| What | Where | How |
|------|-------|-----|
| Chat | Main area | Type and press Enter |
| Voice Input | Microphone button | Click and speak |
| Voice Output | Speaker icon | Click on message |
| Settings | Bottom of sidebar | Click Settings |
| Language | Settings modal | Select language |
| Help | Documentation files | Read .md files |

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Ollama**: https://ollama.ai
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Genomics**: https://www.ncbi.nlm.nih.gov/

---

## 🎊 Enjoy!

You now have a powerful genomics chat application at your fingertips. Have fun exploring and learning!

**Happy chatting! 🧬**

---

**Questions?** Check the documentation files or TROUBLESHOOTING.md

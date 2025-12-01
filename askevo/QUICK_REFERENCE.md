# Quick Reference - Progenics AI (askevo)

## 📍 Project Location
```
~/genomics_project/askevo_v2/askevo
```

## 🚀 Start All Services (4 Terminals)

### Terminal 1: Database (Already Running)
```bash
# MySQL should be running as a service
mysql -u remote_user -p"Prolab#05" progenics_ai
```

### Terminal 2: Ollama
```bash
ollama serve
```

### Terminal 3: Backend
```bash
cd ~/genomics_project/askevo_v2/askevo/backend
npm run dev
```

### Terminal 4: Frontend
```bash
cd ~/genomics_project/askevo_v2/askevo
npm run dev
```

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:3001/api | 3001 |
| Ollama | http://localhost:11434 | 11434 |
| Database | localhost | 3306 |

## 🔐 Database Credentials

```
Host: localhost
User: remote_user
Password: Prolab#05
Database: progenics_ai
```

## 📁 Important Directories

```
askevo/                    # Main project
├── src/                   # Frontend code
├── backend/               # Backend code
├── backend/uploads/       # Uploaded files
└── backend/config/        # Database config
```

## 📝 Important Files

```
askevo/
├── .env                   # Frontend config (create from .env.example)
├── backend/.env           # Backend config (create from .env.example)
├── DATABASE_SETUP.sql     # Database schema
├── DATABASE_SETUP_FIX.sql # Fixed setup script
└── package.json           # Frontend dependencies
```

## 🔧 Common Commands

### Setup
```bash
# Frontend
cd askevo
npm install
cp .env.example .env

# Backend
cd askevo/backend
npm install
cp .env.example .env
```

### Development
```bash
# Frontend
cd askevo
npm run dev

# Backend
cd askevo/backend
npm run dev
```

### Build
```bash
# Frontend production build
cd askevo
npm run build
```

### Database
```bash
# Connect to database
mysql -u remote_user -p progenics_ai

# Run setup
mysql -u root -p < askevo/DATABASE_SETUP_FIX.sql

# Check tables
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Database Connection
```bash
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SELECT 1;"
```

### Frontend
```
Open: http://localhost:5173
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u remote_user -p
# Password: Prolab#05
```

### Module Not Found
```bash
cd askevo
rm -rf node_modules package-lock.json
npm install
```

### Ollama Not Running
```bash
ollama serve
```

## 📊 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Chat
- `POST /api/chat/sessions`
- `GET /api/chat/sessions`
- `GET /api/chat/sessions/:id/messages`
- `POST /api/chat/messages`

### Files
- `POST /api/upload`
- `GET /api/files`
- `DELETE /api/files/:id`

## 📚 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | Start here |
| GETTING_STARTED.md | 30-minute guide |
| QUICK_START.md | 5-minute setup |
| FULL_INTEGRATION_GUIDE.md | Complete setup |
| DATABASE_GUIDE.md | Database reference |
| BACKEND_SETUP.md | Backend config |
| TROUBLESHOOTING.md | Common issues |
| SETUP_WITH_NEW_FOLDER_NAME.md | Updated paths |

## ✅ Verification Checklist

- [ ] Database running: `mysql -u remote_user -p progenics_ai`
- [ ] Backend running: `curl http://localhost:3001/api/health`
- [ ] Frontend running: Open `http://localhost:5173`
- [ ] Ollama running: `curl http://localhost:11434/api/tags`
- [ ] Can register user
- [ ] Can login
- [ ] Can create chat session
- [ ] Can send messages

## 🎯 Typical Workflow

1. **Start Services**
   ```bash
   # Terminal 1: Ollama
   ollama serve
   
   # Terminal 2: Backend
   cd askevo/backend && npm run dev
   
   # Terminal 3: Frontend
   cd askevo && npm run dev
   ```

2. **Open Application**
   ```
   http://localhost:5173
   ```

3. **Register & Login**
   - Create new account
   - Login with credentials

4. **Use Features**
   - Create chat session
   - Send messages
   - Use voice input/output
   - Upload files

## 🔄 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_OLLAMA_URL=http://localhost:11434
REACT_APP_OLLAMA_MODEL=gemma
REACT_APP_GENOMICS_API_URL=http://localhost:3001/api
REACT_APP_DEFAULT_LANGUAGE=en
```

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=remote_user
DB_PASSWORD=Prolab#05
DB_NAME=progenics_ai
PORT=3001
JWT_SECRET=your_secret_key
```

## 📞 Quick Help

### Can't connect to database?
```bash
mysql -u remote_user -p
# Password: Prolab#05
```

### Backend won't start?
```bash
cd askevo/backend
npm install
npm run dev
```

### Frontend won't start?
```bash
cd askevo
npm install
npm run dev
```

### Ollama not responding?
```bash
ollama serve
```

## 🎉 You're Ready!

Everything is set up and ready to use. Start with the services and access the application at `http://localhost:5173`.

---

**Project:** Progenics AI
**Folder:** askevo
**Status:** ✅ Ready
**Last Updated:** November 28, 2025

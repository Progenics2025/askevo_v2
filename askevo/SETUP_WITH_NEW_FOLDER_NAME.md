# Setup Guide - Updated Folder Name (askevo)

The project folder has been renamed from "CHAT BOT NEW" to "askevo" for better compatibility.

## 📁 New Folder Structure

```
askevo/
├── src/
│   ├── components/
│   ├── services/
│   ├── config/
│   ├── styles/
│   └── pages/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── server.js
├── public/
├── package.json
├── vite.config.js
├── DATABASE_SETUP.sql
├── DATABASE_SETUP_FIX.sql
└── [documentation files]
```

## 🚀 Updated Quick Start Commands

### 1. Database Setup
```bash
cd ~/genomics_project/askevo_v2/askevo
mysql -u root -p < DATABASE_SETUP_FIX.sql
```

### 2. Backend Setup
```bash
cd ~/genomics_project/askevo_v2/askevo/backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd ~/genomics_project/askevo_v2/askevo
npm install
npm run dev
```

### 4. Ollama Setup
```bash
ollama serve
```

## 📝 Updated Environment Files

### Frontend .env
Location: `askevo/.env`

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_OLLAMA_URL=http://localhost:11434
REACT_APP_OLLAMA_MODEL=gemma
REACT_APP_GENOMICS_API_URL=http://localhost:3001/api
REACT_APP_DEFAULT_LANGUAGE=en
```

### Backend .env
Location: `askevo/backend/.env`

```env
DB_HOST=localhost
DB_USER=remote_user
DB_PASSWORD=Prolab#05
DB_NAME=progenics_ai
DB_PORT=3306
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
```

## 🔗 Updated Paths

### Database Connection
```bash
mysql -u remote_user -p progenics_ai
```

### Backend Server
```
http://localhost:3001/api
```

### Frontend Application
```
http://localhost:5173
```

### Ollama Server
```
http://localhost:11434
```

## 📋 Verification Commands

### Check Database
```bash
mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"
```

### Check Backend Health
```bash
curl http://localhost:3001/api/health
```

### Check Frontend
Open browser: `http://localhost:5173`

## 🔧 Common Commands with New Path

### Navigate to Project
```bash
cd ~/genomics_project/askevo_v2/askevo
```

### Install Frontend Dependencies
```bash
cd ~/genomics_project/askevo_v2/askevo
npm install
```

### Install Backend Dependencies
```bash
cd ~/genomics_project/askevo_v2/askevo/backend
npm install
```

### Start Frontend Development Server
```bash
cd ~/genomics_project/askevo_v2/askevo
npm run dev
```

### Start Backend Development Server
```bash
cd ~/genomics_project/askevo_v2/askevo/backend
npm run dev
```

### Build Frontend for Production
```bash
cd ~/genomics_project/askevo_v2/askevo
npm run build
```

## 📚 Documentation Files Location

All documentation files are in the `askevo/` directory:

- `START_HERE.md` - Start here
- `GETTING_STARTED.md` - 30-minute quick start
- `QUICK_START.md` - 5-minute setup
- `FULL_INTEGRATION_GUIDE.md` - Complete setup
- `DATABASE_GUIDE.md` - Database reference
- `BACKEND_SETUP.md` - Backend configuration
- `TROUBLESHOOTING.md` - Common issues
- `ARCHITECTURE.md` - System design
- `FEATURES.md` - Feature list

## ✅ Setup Checklist

- [ ] Database created and verified
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Ollama server running
- [ ] Backend server running
- [ ] Frontend server running
- [ ] All services accessible

## 🎯 Next Steps

1. **Verify Database**
   ```bash
   mysql -u remote_user -p"Prolab#05" progenics_ai -e "SHOW TABLES;"
   ```

2. **Start Backend**
   ```bash
   cd askevo/backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd askevo
   npm run dev
   ```

4. **Test System**
   - Open http://localhost:5173
   - Register user
   - Login
   - Create chat session

## 🆘 Troubleshooting

### Path Issues
If you get "command not found" errors, ensure you're in the correct directory:
```bash
pwd  # Check current directory
cd ~/genomics_project/askevo_v2/askevo  # Navigate to project
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :11434 # Ollama

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u remote_user -p
# Enter password: Prolab#05
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Quick Reference

| Component | Location | Command |
|-----------|----------|---------|
| Frontend | askevo/ | `npm run dev` |
| Backend | askevo/backend/ | `npm run dev` |
| Database | MySQL | `mysql -u remote_user -p progenics_ai` |
| Ollama | Local | `ollama serve` |

## 🎉 You're All Set!

Your Progenics AI system is ready with the new folder structure. All paths have been updated to work with the `askevo` folder name.

Start with the documentation files in the `askevo/` directory for detailed setup instructions.

Happy coding! 🧬

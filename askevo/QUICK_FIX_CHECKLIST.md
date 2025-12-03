# Quick Fix Checklist
Generated: 2025-12-02T18:29:33+05:30

## ✅ COMPLETED FIXES

### 1. Created Frontend .env File
- ✅ Created `/askevo/.env` with proper API URLs
- ✅ Set VITE_API_URL=http://localhost:3001/api
- ✅ Set VITE_OLLAMA_URL=http://localhost:11434

### 2. Updated Vite Configuration
- ✅ Changed `host: true` → `host: '0.0.0.0'`
- ✅ Added explicit port: 5173
- ✅ Added strictPort: true
- ✅ Expanded allowedHosts to include localhost variants
- ✅ Added API proxy for CORS-free development
- ✅ Added preview server configuration

### 3. Fixed Backend CORS
- ✅ Replaced `origin: true` with specific whitelist
- ✅ Added chat.progenicslabs.com to allowed origins
- ✅ Added proper methods and headers configuration
- ✅ Updated backend/.env CORS_ORIGIN

### 4. Created Helper Scripts
- ✅ Created start_all_services.sh (comprehensive startup)
- ✅ Created stop_services.sh (clean shutdown)
- ✅ Made scripts executable
- ✅ Created .env.production template

---

## 🚀 NEXT STEPS (YOU NEED TO DO)

### Step 1: Start Backend Server (CRITICAL - Not Running)
```bash
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/backend
npm run dev
```

### Step 2: Restart Frontend (Pick Up New Config)
```bash
# First, stop current Vite if running
# Then start with new config
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo
npm run dev
```

### OR Use the Quick Start Script:
```bash
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo
bash start_all_services.sh
```

---

## 🧪 VERIFICATION STEPS

After starting services, verify:

### 1. Check Ports
```bash
ss -tuln | grep -E ":(3001|5173|11434)"
```
Should show ALL THREE ports listening on 0.0.0.0

### 2. Test Backend API
```bash
curl http://localhost:3001/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### 3. Test Ollama
```bash
curl http://localhost:11434/api/tags
```
Should return list of models

### 4. Test Frontend
Open browser: http://localhost:5173
- Should load login page
- No CORS errors in console
- Can login and chat

### 5. Test Network Access (from another device)
```
http://YOUR_SERVER_IP:5173
```

---

## 🌐 FOR CUSTOM DOMAIN (chat.progenicslabs.com)

### Current Status
- ❌ Backend not exposed on custom domain
- ❌ Ollama not exposed on custom domain
- ❌ Need reverse proxy/tunnel configuration

### Option A: Using Cloudflare Tunnel
1. Install cloudflared
2. Configure tunnel with ingress rules (see .env.production)
3. Route /api/* to localhost:3001
4. Route /ollama/* to localhost:11434
5. Route /* to static files or localhost:8080 (nginx)

### Option B: Build and Deploy Static Files
```bash
# Build production bundle
npm run build

# Serve dist/ folder with nginx/apache
# Configure reverse proxy for /api and /ollama
```

### Option C: Use Production .env
```bash
# Copy .env.production to .env
cp .env.production .env

# Edit with your actual URLs
nano .env

# Build
npm run build
```

---

## 📋 CONFIGURATION FILES MODIFIED

1. ✅ `/askevo/.env` - CREATED
2. ✅ `/askevo/vite.config.js` - UPDATED
3. ✅ `/askevo/backend/server.js` - UPDATED (CORS)
4. ✅ `/askevo/backend/.env` - UPDATED (CORS_ORIGIN)
5. ✅ `/askevo/.env.production` - CREATED (template)

---

## 🔧 TROUBLESHOOTING

### If Backend Won't Start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill existing process
kill -9 $(lsof -t -i:3001)

# Check logs
tail -f /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/backend/backend.log
```

### If Frontend Won't Start
```bash
# Check if port 5173 is in use
lsof -i :5173

# Kill existing process
kill -9 $(lsof -t -i:5173)

# Clear Vite cache
rm -rf node_modules/.vite
```

### If Ollama Not Accessible
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Or if systemd
sudo systemctl start ollama
```

### If CORS Errors
1. Check browser console for specific origin
2. Add origin to allowedOrigins array in server.js
3. Restart backend server

### If "Cannot connect to API"
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check .env file has correct VITE_API_URL
3. Restart frontend to pick up .env changes
4. Check browser network tab for actual URL being called

---

## 📊 EXPECTED SERVICE STATUS

```
✅ Backend API:        0.0.0.0:3001 (accessible from network)
✅ Frontend (Vite):    0.0.0.0:5173 (accessible from network)
✅ Ollama:             127.0.0.1:11434 (localhost only)
✅ MySQL:              localhost:3306
```

---

## 🎯 SUCCESS CRITERIA

Application is working when:
1. ✅ All three ports (3001, 5173, 11434) are listening
2. ✅ Can access http://localhost:5173
3. ✅ Login works without errors
4. ✅ Chat interface loads
5. ✅ Can send messages
6. ✅ Ollama responds (green status indicator)
7. ✅ No CORS errors in browser console
8. ✅ Can access from network (http://SERVER_IP:5173)

---

**For detailed analysis, see: CONFIGURATION_ANALYSIS_REPORT.md**

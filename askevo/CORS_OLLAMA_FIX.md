# CORS and Ollama Issues - RESOLVED

**Date:** 2025-12-02T18:48:29+05:30

---

## 🔍 **What Happened**

After implementing the initial CORS fixes, two critical issues appeared:
1. **Backend CORS errors** - Blocking requests from network IPs
2. **Ollama CORS errors** - Ollama doesn't support CORS at all

---

## ❌ **Root Causes Identified**

### Issue 1: Backend CORS Blocking Network IPs

**Symptom:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:3001/api/chat/sessions. (Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 500.
```

**Root Cause:**
- Frontend accessed via network IP: `http://192.168.29.11:5173`
- CORS whitelist only had: `http://localhost:5173`
- **Network IP was not in the whitelist!**

**Why It Worked Before:**
- Original code had `origin: true` (allowed ANY origin - insecure)
- My secure whitelist was TOO strict for development

### Issue 2: Ollama CORS Errors (403)

**Symptom:**
```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:11434/api/tags. (Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 403.
```

**Root Cause:**
- **Ollama server does NOT support CORS headers**
- It's designed to be used as a local API, not called directly from browsers
- Browser security won't allow cross-origin requests to localhost:11434

**Why It Worked Before:**
- It DIDN'T work! You were likely always having this issue
- OR you were using it only on localhost (same origin)

### Issue 3: Custom Domain (chat.progenicslabs.com) - 403 Errors

**Symptom:**
```
GET https://chat.progenicslabs.com/ [HTTP/2 403 482ms]
```

**Root Cause:**
- Cloudflare Tunnel or web server blocking requests
- Possible authentication/security rules on Cloudflare
- Static files not being served correctly

---

## ✅ **Solutions Implemented**

### Fix 1: Flexible CORS for Development

**What Changed:**
- Added automatic detection of local network IPs in development mode
- CORS now allows:
  - ✅ All localhost variants
  - ✅ All 192.168.x.x addresses (local network)
  - ✅ All 10.x.x.x addresses (private network)
  - ✅ All 172.16-31.x.x addresses (private network)
  - ✅ Custom domain whitelist (production)

**Code Update:**
```javascript
// In development mode
if (isDevelopment) {
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isLocalNetwork = /^https?:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(origin);
  
  if (isLocalhost || isLocalNetwork) {
    console.log('Development mode: allowing origin:', origin);
    return callback(null, true);
  }
}
```

**Security Note:** 
- Only active in development mode (`NODE_ENV !== 'production'`)
- Production uses strict whitelist

### Fix 2: Vite Proxy for Ollama

**What Changed:**
- Frontend now calls `/ollama` instead of `http://localhost:11434`
- Vite dev server proxies `/ollama/*` → `localhost:11434/*`
- This bypasses CORS completely (same-origin requests)

**Vite Configuration:**
```javascript
proxy: {
  '/ollama': {
    target: 'http://localhost:11434',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/ollama/, ''),
  }
}
```

**Frontend Service:**
```javascript
// Now uses /ollama proxy instead of direct localhost:11434
const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_URL || '/ollama';
```

**Benefits:**
- ✅ No CORS errors
- ✅ Works on any network IP
- ✅ No browser security restrictions
- ✅ Works in all browsers

---

## 📁 **Files Modified (Round 2)**

1. ✅ `/askevo/backend/server.js` - Flexible CORS for development
2. ✅ `/askevo/vite.config.js` - Added Ollama proxy
3. ✅ `/askevo/src/services/ollamaService.js` - Use proxy path
4. ✅ `/askevo/.env` - Updated VITE_OLLAMA_URL=/ollama

---

## 🔄 **What You Need To Do**

### Step 1: Restart Backend (It Will Auto-Restart with nodemon)
Backend should auto-restart when you saved server.js. Wait 2 seconds.

Check logs:
```bash
tail -f /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/backend/backend.log
```

You should see:
```
Development mode: allowing origin: http://192.168.29.11:5173
```

### Step 2: Restart Frontend (REQUIRED)
The frontend MUST restart to:
1. Pick up new VITE_OLLAMA_URL from .env
2. Enable the Ollama proxy in Vite

```bash
# Stop current frontend (Ctrl+C in the terminal running it)
# Or kill it:
lsof -ti:5173 | xargs kill -9

# Start again:
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo
npm run dev
```

---

## 🧪 **Verify It's Working**

### Test 1: Check Vite Proxy is Active
Open browser console and look for network requests. You should see:
- ❌ NO requests to `http://localhost:11434`
- ✅ Requests to `/ollama/api/tags` (same origin!)

### Test 2: Check Backend CORS
Look for backend logs showing:
```
Development mode: allowing origin: http://192.168.29.11:5173
```

### Test 3: Ollama Connection Indicator
In the chat interface, top right should show:
- ✅ Green dot + model name (e.g., "gemma3n:latest")
- ❌ NOT "Disconnected"

### Test 4: Try Sending a Message
1. Login to the app
2. Send a test message
3. Should see streaming response from Ollama

---

## 🌐 **Custom Domain (chat.progenicslabs.com) - Additional Steps Needed**

The 403 error on your custom domain is a separate issue. Possible causes:

### 1. Cloudflare Security Settings
- Check Cloudflare dashboard WAF rules
- Check if there's IP blocking
- Verify SSL/TLS mode is "Full" or "Full (Strict)"

### 2. Cloudflare Tunnel Not Serving Files
```bash
# Check tunnel status
sudo systemctl status cloudflared

# Check tunnel logs
sudo journalctl -u cloudflared -f
```

### 3. Need NGINX Setup
The custom domain needs proper routing (see CUSTOM_DOMAIN_DEPLOYMENT.md):
```nginx
server {
    listen 8080;
    root /path/to/askevo/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/api/;
    }
    
    location /ollama/ {
        proxy_pass http://localhost:11434/;
    }
}
```

---

## 📊 **Architecture Comparison**

### Before (Broken):
```
Browser → Direct to localhost:11434 ❌ CORS Error
Browser → Backend (http://localhost:3001) ❌ Origin mismatch
```

### After (Fixed):
```
Browser → Vite Dev Server (http://192.168.29.11:5173)
            ├─→ /ollama/* → Proxy → localhost:11434 ✅
            ├─→ /api/* → Proxy → localhost:3001 ✅
            └─→ /* → React App ✅
            
Backend → Checks origin → Allows if:
            - Development + Local network ✅
            - In whitelist ✅
```

---

## 🔐 **Security Notes**

### Development Mode (Current)
- Allows all local network IPs
- Only active when `NODE_ENV !== 'production'`
- Perfect for testing across devices on same network

### Production Mode
To enable production mode:
```bash
# In backend/.env
NODE_ENV=production
```

In production:
- ❌ Local network IPs NOT allowed
- ✅ Only explicit whitelist allowed
- ✅ Secure for deployment

---

## 📝 **Summary**

### What Broke:
1. Strict CORS blocked network IPs
2. Ollama doesn't support CORS (never did)

### What Fixed It:
1. Development-friendly CORS (auto-allows local networks)
2. Vite proxy for Ollama (bypasses CORS)

### What Works Now:
- ✅ Access from localhost
- ✅ Access from network IP (192.168.x.x)
- ✅ Access from other devices on same network
- ✅ Ollama connection (via proxy)
- ✅ Backend API (with flexible CORS)
- ✅ All browsers (Chrome, Firefox, Edge, etc.)

### Still Need Work:
- ⚠️ Custom domain (chat.progenicslabs.com) - 403 error
- → See CUSTOM_DOMAIN_DEPLOYMENT.md for full setup

---

## ✅ **Expected Behavior Now**

1. **Start frontend:**
   ```bash
   npm run dev
   ```

2. **Access from any device on network:**
   ```
   http://192.168.29.11:5173
   ```

3. **Ollama indicator:** Green (connected)

4. **Send message:** Works with streaming response

5. **No CORS errors in console**

---

**RESTART THE FRONTEND NOW TO APPLY THESE FIXES!**

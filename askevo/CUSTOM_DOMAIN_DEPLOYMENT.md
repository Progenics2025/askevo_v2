# Custom Domain Deployment Guide
**For chat.progenicslabs.com**

---

## 🎯 Goal
Deploy the Progenics AI application to work seamlessly on your custom domain: **chat.progenicslabs.com**

---

## 🔍 Current Situation Analysis

### What Works
- ✅ Cloudflare Tunnel is configured
- ✅ Domain resolves to your server
- ✅ Application works in Chrome (partially)

### What Doesn't Work
- ❌ Application fails in browsers other than Chrome
- ❌ Backend API not accessible via custom domain
- ❌ Ollama not accessible via custom domain
- ❌ Possible ServiceWorker caching issues

---

## 🏗️ Architecture Options

### Option A: Full Reverse Proxy (Recommended for Production)

**Architecture:**
```
Internet → Cloudflare Tunnel → NGINX → Services
                                  ├─→ /api/* → Backend (3001)
                                  ├─→ /ollama/* → Ollama (11434)
                                  └─→ /* → Static Files
```

**Advantages:**
- Full control over routing
- Better performance
- Easier to debug
- No client-side dynamic URL generation

**Implementation:**

1. **Install and Configure NGINX:**
```bash
sudo apt update
sudo apt install nginx -y
```

2. **Create NGINX Configuration:**
```bash
sudo nano /etc/nginx/sites-available/progenics-ai
```

```nginx
server {
    listen 8080;
    server_name localhost;
    
    # Root for static files
    root /home/progenics-bioinfo/genomics_project/askevo_v2/askevo/dist;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/progenics-access.log;
    error_log /var/log/nginx/progenics-error.log;
    
    # Serve static files with proper caching
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Proxy Ollama
    location /ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Headers
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Ollama needs longer timeouts for LLM generation
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        
        # Disable buffering for streaming responses
        proxy_buffering off;
    }
}
```

3. **Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/progenics-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Update Cloudflare Tunnel:**
```yaml
# /home/progenics-bioinfo/.cloudflared/config.yml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/progenics-bioinfo/.cloudflared/YOUR_CREDENTIALS.json

ingress:
  - hostname: chat.progenicslabs.com
    service: http://localhost:8080
  - service: http_status:404
```

5. **Build Frontend for Production:**
```bash
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo

# Copy production environment
cp .env.production .env

# Update .env with actual URLs
nano .env
# Set: VITE_API_URL=https://chat.progenicslabs.com/api
# Set: VITE_OLLAMA_URL=https://chat.progenicslabs.com/ollama

# Build
npm run build

# Files will be in ./dist directory
```

6. **Restart Cloudflare Tunnel:**
```bash
sudo systemctl restart cloudflared
# OR
cloudflared tunnel run
```

---

### Option B: Direct Cloudflare Tunnel (Multiple Services)

**Implementation:**

1. **Update Cloudflare Tunnel Config:**
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/progenics-bioinfo/.cloudflared/credentials.json

ingress:
  # API endpoints
  - hostname: chat.progenicslabs.com
    path: /api/*
    service: http://localhost:3001
    
  # Ollama endpoints
  - hostname: chat.progenicslabs.com
    path: /ollama/*
    service: http://localhost:11434
    
  # Frontend (Vite dev server OR static files via nginx:8080)
  - hostname: chat.progenicslabs.com
    service: http://localhost:5173  # For dev
    # OR service: http://localhost:8080  # For production (nginx serving dist/)
    
  - service: http_status:404
```

2. **Update Frontend .env:**
```bash
# Use relative paths since everything is on same domain
VITE_API_URL=/api
VITE_OLLAMA_URL=/ollama
```

3. **Rebuild Frontend:**
```bash
npm run build
```

---

### Option C: Development Mode (Not Recommended for Production)

Keep using Vite dev server directly:

```yaml
# Cloudflare Tunnel config
ingress:
  - hostname: chat.progenicslabs.com
    service: http://localhost:5173
  - service: http_status:404
```

**Issues:**
- Backend and Ollama still not accessible
- Need to use full URLs with ports
- Not secure
- Won't work due to CORS

---

## 🐛 Troubleshooting ServiceWorker Issues

Based on your conversation history, the app only works in Chrome. This suggests a ServiceWorker issue.

### Diagnosis:

1. **Check for ServiceWorker:**
```bash
cd /home/progenics-bioinfo/genomics_project/askevo_v2/askevo
grep -r "serviceWorker" src/
find public/ -name "*service-worker*" -o -name "*sw.js"
```

2. **Check Vite PWA Plugin:**
```bash
# Check if vite-plugin-pwa is installed
npm list | grep pwa
```

3. **Clear ServiceWorker (In Browser Console):**
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Found ServiceWorkers:', registrations.length);
  registrations.forEach(registration => {
    console.log('Unregistering:', registration);
    registration.unregister();
  });
});

// Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

### Fix:

If there's no ServiceWorker in your code but one is registered:

**Option 1: Add Unregister Script**
```javascript
// In src/main.jsx or index.html
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
```

**Option 2: Configure Vite to Disable ServiceWorker**
```javascript
// vite.config.js
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
```

---

## 🔒 Security Considerations

### Update Backend JWT Secret
```bash
# Edit backend/.env
# Generate secure secret
openssl rand -base64 32

# Update:
JWT_SECRET=<generated-secret>
```

### Enable HTTPS (Cloudflare handles this automatically)
- Cloudflare Tunnel provides automatic SSL/TLS
- Ensure SSL/TLS mode is set to "Full" or "Full (Strict)" in Cloudflare dashboard

### Restrict CORS Origins
Already done! The backend now only allows specific origins.

---

## 🧪 Testing Checklist

### Local Testing (Before Domain Deploy)
```bash
# 1. Start all services
bash start_all_services.sh

# 2. Verify ports
ss -tuln | grep -E ":(3001|5173|11434)"

# 3. Test backend
curl http://localhost:3001/api/health

# 4. Test frontend
curl http://localhost:5173

# 5. Test Ollama
curl http://localhost:11434/api/tags

# 6. Test in browser
open http://localhost:5173
```

### Production Testing (After Domain Deploy)
```bash
# 1. Test API endpoint
curl https://chat.progenicslabs.com/api/health

# 2. Test Ollama endpoint
curl https://chat.progenicslabs.com/ollama/api/tags

# 3. Test frontend
curl https://chat.progenicslabs.com

# 4. Browser tests (in MULTIPLE browsers)
# - Chrome
# - Firefox
# - Safari
# - Edge

# Check for:
# - No CORS errors
# - No 404 errors
# - Can login
# - Can send messages
# - Ollama responds
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Backend running and accessible on localhost:3001
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Ollama running on localhost:11434
- [ ] Database accessible
- [ ] NGINX installed and configured (if using Option A)
- [ ] Cloudflare Tunnel configured

### Deployment
- [ ] Copy .env.production to .env
- [ ] Update .env with production URLs
- [ ] Build frontend: `npm run build`
- [ ] Test dist/ folder locally
- [ ] Configure NGINX to serve dist/
- [ ] Update Cloudflare Tunnel config
- [ ] Restart all services
- [ ] Restart Cloudflare Tunnel

### Post-Deployment
- [ ] Test https://chat.progenicslabs.com
- [ ] Verify API calls work
- [ ] Verify Ollama integration
- [ ] Test in multiple browsers
- [ ] Clear browser cache and test
- [ ] Test from different networks/devices
- [ ] Monitor logs for errors

---

## 🚨 Common Issues and Solutions

### Issue: "Cannot connect to API"
**Solution:**
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check NGINX is proxying: `sudo nginx -t && sudo systemctl status nginx`
3. Check Cloudflare Tunnel: `sudo systemctl status cloudflared`
4. Verify .env has correct VITE_API_URL

### Issue: "Ollama not responding"
**Solution:**
1. Verify Ollama running: `curl http://localhost:11434/api/tags`
2. Check NGINX proxy for /ollama/
3. Increase proxy timeouts in NGINX (already in config above)
4. Check Ollama logs: `journalctl -u ollama`

### Issue: "Works in Chrome, not other browsers"
**Solution:**
1. Clear ServiceWorker (see above)
2. Check browser console for specific errors
3. Test with browser cache disabled
4. Verify CORS headers in browser network tab

### Issue: "404 on refresh"
**Solution:**
1. Ensure NGINX has `try_files $uri $uri/ /index.html;`
2. Verify index.html is in dist/
3. Check NGINX error logs: `sudo tail -f /var/log/nginx/progenics-error.log`

---

## 📊 Recommended Architecture

**Final Recommended Setup:**

```
┌─────────────────────────────────────────────────────────────┐
│                          Internet                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Tunnel                        │
│              (SSL/TLS termination, DDoS protection)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          NGINX                              │
│                      (localhost:8080)                       │
│  ┌────────────┬─────────────────┬──────────────────────┐   │
│  │ Static     │ Proxy /api/*    │ Proxy /ollama/*      │   │
│  │ Files      │ → :3001         │ → :11434             │   │
│  │ (dist/)    │                 │                      │   │
│  └────────────┴─────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │                  │                    │
        │                  │                    │
        ▼                  ▼                    ▼
   ┌─────────┐      ┌──────────┐         ┌─────────┐
   │ Static  │      │ Backend  │         │ Ollama  │
   │ Files   │      │ :3001    │         │ :11434  │
   └─────────┘      └──────────┘         └─────────┘
                          │
                          ▼
                    ┌──────────┐
                    │  MySQL   │
                    │  :3306   │
                    └──────────┘
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ https://chat.progenicslabs.com loads without errors
2. ✅ Can login and authenticate
3. ✅ Can create and send messages
4. ✅ Ollama responds to queries (green indicator)
5. ✅ Works in ALL browsers (Chrome, Firefox, Safari, Edge)
6. ✅ No CORS errors in console
7. ✅ No 404 errors in console
8. ✅ Page refresh works (no 404)
9. ✅ Works from different networks/devices

---

**Good luck with your deployment! 🚀**

For questions or issues, check:
- CONFIGURATION_ANALYSIS_REPORT.md - Full technical analysis
- QUICK_FIX_CHECKLIST.md - Step-by-step fixes

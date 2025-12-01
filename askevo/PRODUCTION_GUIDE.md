# Production Deployment Guide for askEVo

This guide outlines the steps to deploy the **askEVo** application (Frontend + Backend + Ollama) in a production environment capable of handling 10-20 simultaneous users.

## Prerequisites

- **Server:** Linux (Ubuntu 20.04/22.04 recommended)
- **CPU:** 8+ Cores (for Ollama concurrency)
- **RAM:** 32GB+ (16GB minimum, 32GB recommended for LLM models)
- **GPU:** NVIDIA GPU with 12GB+ VRAM (Recommended for fast inference)
- **Storage:** 100GB+ SSD

## 1. System Setup

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx
```

Install Node.js (v18+):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 (Process Manager):
```bash
sudo npm install -g pm2
```

## 2. Ollama Setup (LLM Server)

Install Ollama:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Configure Ollama for Concurrency:
Edit the service file to allow multiple parallel requests.
```bash
sudo systemctl edit ollama.service
```
Add the following environment variables:
```ini
[Service]
Environment="OLLAMA_NUM_PARALLEL=4"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
```
*Note: `OLLAMA_NUM_PARALLEL=4` allows 4 simultaneous requests per model copy. Adjust based on VRAM.*

Reload and restart Ollama:
```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Pull the model:
```bash
ollama pull gemma3:4b
```

## 3. Database Setup (MySQL)

Install MySQL:
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

Create Database and User:
```sql
CREATE DATABASE askevo_db;
CREATE USER 'askevo_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON askevo_db.* TO 'askevo_user'@'localhost';
FLUSH PRIVILEGES;
```

Import Schema:
```bash
mysql -u askevo_user -p askevo_db < /path/to/project/backend/schema.sql
```

## 4. Backend Deployment

Navigate to backend directory:
```bash
cd /path/to/project/backend
npm install --production
```

Create `.env` file:
```env
PORT=3001
DB_HOST=localhost
DB_USER=askevo_user
DB_PASSWORD=StrongPassword123!
DB_NAME=askevo_db
JWT_SECRET=YourSuperSecretProductionKey
OLLAMA_URL=http://localhost:11434
CORS_ORIGIN=http://your-domain.com
```

Start with PM2:
```bash
pm2 start server.js --name "askevo-backend"
```

## 5. Frontend Deployment

Navigate to frontend directory:
```bash
cd /path/to/project/askevo
npm install
```

Create `.env.production` file:
```env
VITE_API_URL=http://your-domain.com/api
VITE_OLLAMA_URL=http://your-domain.com/ollama
```

Build the project:
```bash
npm run build
```
This creates a `dist` folder.

## 6. Nginx Configuration (Reverse Proxy)

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/askevo
```

Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/project/askevo/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Ollama API (Optional, if frontend accesses directly)
    location /ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/askevo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Scaling & Maintenance

- **Monitoring:** Use `pm2 monit` to check backend status.
- **Logs:** Check `pm2 logs askevo-backend`.
- **Auto-restart:** Run `pm2 startup` and `pm2 save` to ensure backend starts on reboot.
- **SSL:** Use Certbot for HTTPS:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d your-domain.com
  ```

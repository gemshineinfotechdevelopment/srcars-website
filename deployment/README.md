# 🚀 Car Care VPS Deployment Folder

This folder contains all configuration files and scripts required to deploy the application on your VPS for **`srcars.gemshine.tech`** on **Port 5030** with **MongoDB**, **PM2**, and **Nginx**.

---

## 📁 Files in this Folder

| File Name | Purpose |
| :--- | :--- |
| `run_full_deployment.sh` | **Master 1-click script** that runs MongoDB installation, build, PM2 & Nginx setup. |
| `01_install_mongodb.sh` | Installs and configures MongoDB Community Edition on VPS Ubuntu (20.04/22.04/24.04). |
| `02_deploy_app.sh` | Builds frontend, deploys to `/var/www/srcars.gemshine.tech/dist`, launches backend on Port 5030 via PM2, and configures Nginx. |
| `03_setup_ssl.sh` | Configures free HTTPS / SSL certificate using Let's Encrypt Certbot. |
| `nginx_srcars.gemshine.tech.conf` | Complete production Nginx reverse proxy configuration file. |
| `ecosystem.config.cjs` | PM2 process manager configuration (Port 5030, auto-restart, logging). |
| `.env.production` | Environment variables template for production. |
| `VPS_COMMANDS_STEP_BY_STEP.txt` | Complete copy-pasteable terminal commands cheat sheet. |

---

## ⚡ Quick Deployment on VPS

```bash
# 1. Go to project root directory
cd /var/www/car-care

# 2. Run the master deployment script
sudo bash deployment/run_full_deployment.sh
```

---

## 🔍 Health Verification
```bash
# Check Backend API:
curl http://127.0.0.1:5030/api/health

# Check PM2:
pm2 status

# Check Logs:
pm2 logs car-care-app
```

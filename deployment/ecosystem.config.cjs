/**
 * PM2 Ecosystem Configuration for Car Care Application
 * VPS Deployment: srcars.gemshine.tech on Port 5030
 */

module.exports = {
  apps: [
    {
      name: 'car-care-app',
      script: './server/index.js',
      cwd: './',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5030,
        MONGODB_URI: 'mongodb://127.0.0.1:27017/car_care'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};

/**
 * PM2 Ecosystem Configuration for Car Care Application
 * VPS Deployment: srcars.gemshine.tech on Port 5030
 *
 * Commands:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 save
 *   pm2 startup
 *   pm2 logs car-care-app
 *   pm2 reload car-care-app
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
      env: {
        NODE_ENV: 'development',
        PORT: 5030,
        MONGODB_URI: 'mongodb://127.0.0.1:27017/car_care'
      },
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

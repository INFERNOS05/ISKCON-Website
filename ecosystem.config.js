module.exports = {
  apps: [
    {
      name: "ngo-donation-server",
      script: "./server/server.cjs",
      env_production: {
        NODE_ENV: "production",
        PORT: 3001
      },
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G"
    }
  ]
};

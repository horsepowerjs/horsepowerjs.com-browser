module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'Horsepowerjs.com',
      script: 'app/index.js',
      instances: 'max',
      exec_mode: "cluster",
      watch: ['app']
    }
  ]
};

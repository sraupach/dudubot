module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First applicationenenen
    {
      name      : "dudu_dev",
      watch	: true,
      ignore_watch : ["node_modules", "storage.nedb"],
      script    : "dudu_dev.js",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ],
}

module.exports = {
  apps : [{
    name   : "REST SERVER",
    script : "./dist/src/app.js",
    env_production: {
      NODE_ENV: "production"
}
  }]
}

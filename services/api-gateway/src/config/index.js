const { urlencoded } = require("express")

const env = {
  port: process.env.PORT || 5002,
  node_env: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,

  },
  rabbmq: {
    url: process.env.RABBITMQ_URL,
  },
  services: {
    user_service_url: process.env.USER_SERVICE_URL,
  }
}

module.exports = env

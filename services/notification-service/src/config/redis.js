const Redis = require('ioredis')
const env = require('./index')

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port,
})

redis.on('connect', () => {
  console.log('Notification Service: Redis connected')
})

redis.on('error', (err) => {
  console.error('Notification Service: Redis error:', err.message)
})

module.exports = redis
const Redis = require('ioredis')
const env = require('./index')

const redis = new Redis({
  host: env.redis.host,
  port: env.redis.port
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message)
})

module.exports = redis
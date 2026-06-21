const env = require('./src/config/index')
const app = require('./src/app')
const { connectRabbitMQ } = require('./src/config/rabbitmq')
const redis = require('./src/config/redis')

const startServer = async () => {
  try {
    await connectRabbitMQ()

    redis.on('connect', () => {
      console.log('Redis connected successfully')
    })

    app.listen(env.port, () => {
      console.log(`API Gateway is running on port ${env.port}`)
    })

  } catch (error) {
    console.error('Failed to start API Gateway:', error.message)
    process.exit(1)
  }
}

startServer()
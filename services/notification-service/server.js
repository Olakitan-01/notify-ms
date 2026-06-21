require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const env = require('./src/config/index')
const logger = require('./src/utils/logger')
const { connectRabbitMQ } = require('./src/config/rabbitmq')
const { startConsumers } = require('./src/consumers')

const app = express()

app.use(morgan('dev'))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification service is running',
    timestamp: new Date().toISOString()
  })
})

const startServer = async () => {
  try {
    await connectRabbitMQ()
    await startConsumers()

    app.listen(env.port, () => {
      logger.info(`Notification service is running on port ${env.port}`)
    })
  } catch (error) {
    logger.error('Failed to start Notification Service:', error)
    process.exit(1)
  }
}

startServer()

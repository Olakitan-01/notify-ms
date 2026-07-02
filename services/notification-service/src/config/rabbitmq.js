const amqp = require('amqplib')
const env = require('./index')
const logger = require('../utils/logger')

const EXCHANGE = 'notifications.direct'
const QUEUES = {
  email: 'email.queue',
  push: 'push.queue',
  failed: 'failed.queue',
}

let connection = null
let channel = null

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(env.rabbitmq.url)
    channel = await connection.createChannel()

    await channel.assertExchange(EXCHANGE, 'direct', { durable: true })

    await channel.assertQueue(QUEUES.email, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': EXCHANGE,
        'x-dead-letter-routing-key': 'failed',
      },
    })

    await channel.assertQueue(QUEUES.push, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': EXCHANGE,
        'x-dead-letter-routing-key': 'failed',
      },
    })

    await channel.assertQueue(QUEUES.failed, { durable: true })

    await channel.bindQueue(QUEUES.email, EXCHANGE, 'email')
    await channel.bindQueue(QUEUES.push, EXCHANGE, 'push')
    await channel.bindQueue(QUEUES.failed, EXCHANGE, 'failed')

    logger.info('Notification Service: RabbitMQ connected successfully')

    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err)
      setTimeout(connectRabbitMQ, 5000)
    })

    connection.on('close', () => {
      logger.warn('RabbitMQ connection closed. Reconnecting...')
      setTimeout(connectRabbitMQ, 5000)
    })

  } catch (error) {
    logger.error('RabbitMQ connection failed:', error)
    setTimeout(connectRabbitMQ, 5000)
  }
}

const getChannel = () => channel

module.exports = { connectRabbitMQ, getChannel, QUEUES }
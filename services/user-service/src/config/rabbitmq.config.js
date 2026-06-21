const amqp = require('amqplib')
const env = require('./index.config')

const EXCHANGE = 'notifications.direct'

let channel = null

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(env.rabbitmq.url)
    channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE, 'direct', { durable: true })
    console.log('User Service: RabbitMQ connected successfully')
  } catch (error) {
    console.error('User Service: RabbitMQ connection failed:', error.message)
    // We don't exit here as the user service can still function without notifications
  }
}

const getChannel = () => channel

module.exports = { connectRabbitMQ, getChannel }

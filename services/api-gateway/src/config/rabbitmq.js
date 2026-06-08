const amqp = require('amqplib')
const env = require('./env')

const EXCHANGE = 'notifications.direct'

const QUEUES = {
  email: 'email.queue',
  push: 'push.queue',
  failed: 'failed.queue',
}

let channel = null  

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(env.rabbitmq.url)
    channel = await connection.createChannel()

    await channel.assertExchange(EXCHANGE, 'direct', { durable: true })

    await channel.assertQueue(QUEUES.email, { durable: true })
    await channel.assertQueue(QUEUES.push, { durable: true })
    await channel.assertQueue(QUEUES.failed, { durable: true })

    await channel.bindQueue(QUEUES.email, EXCHANGE, 'email')
    await channel.bindQueue(QUEUES.push, EXCHANGE, 'push')
    await channel.bindQueue(QUEUES.failed, EXCHANGE, 'failed')

    console.log('RabbitMQ connected successfully')

  } catch (error) {
    console.error('RabbitMQ connection failed:', error.message)
    process.exit(1)
  }
}

const getChannel = () => channel

module.exports = { connectRabbitMQ, getChannel }
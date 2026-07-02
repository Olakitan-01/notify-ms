const logger = require('../utils/logger')
const { getChannel, QUEUES } = require('../config/rabbitmq')
const { sendEmail } = require('../providers/email.provider')
const { sendPush } = require('../providers/push.provider')
const { getUserData } = require('../utils/user-client')
const { updateStatus } = require('../utils/status')

const startConsumers = async () => {
  const channel = getChannel()
  if (!channel) {
    logger.error('Cannot start consumers: RabbitMQ channel not available')
    return
  }

  // Set Prefetch to 1 to handle messages one by one
  channel.prefetch(1)

  // Email Consumer
  channel.consume(QUEUES.email, async (msg) => {
    if (msg !== null) {
      let content
      try {
        content = JSON.parse(msg.content.toString())
        const { user_id, template_code, variables } = content
        
        logger.info(`Processing email notification for user: ${user_id}`)

        // 1. Get User Data (email, preferences)
        const user = await getUserData(user_id)
        
        if (!user.preferences.email) {
          logger.info(`User ${user_id} has disabled email notifications. Skipping.`)
          return channel.ack(msg)
        }

        // 2. Prepare Email (Normally you'd use a template engine here)
        const subject = `Notification: ${template_code}`
        const body = `Hello ${variables.name}, this is a notification for ${template_code}.`

        // 3. Send Email
        await sendEmail(user.email, subject, body)

        await updateStatus(content.request_id, 'delivered')
        
        logger.info(`Email sent successfully to ${user.email}`)
        channel.ack(msg)
      } catch (error) {
        logger.error('Error processing email notification:', error.message)
        if (content?.request_id) {
          await updateStatus(content.request_id, 'failed', { error: error.message })
        }
        // Move to failed queue for retries or manual inspection
        channel.nack(msg, false, false)
      }
    }
  })

  // Push Consumer
  channel.consume(QUEUES.push, async (msg) => {
    if (msg !== null) {
      let content
      try {
        content = JSON.parse(msg.content.toString())
        const { user_id, template_code, variables } = content

        logger.info(`Processing push notification for user: ${user_id}`)

        // 1. Get User Data (push_token, preferences)
        const user = await getUserData(user_id)

        if (!user.preferences.push || !user.push_token) {
          logger.info(`User ${user_id} has disabled push or lacks a token. Skipping.`)
          return channel.ack(msg)
        }

        // 2. Send Push
        const title = `Notification: ${template_code}`
        const body = `Hello ${variables.name}, you have a new message.`
        
        await sendPush(user.push_token, title, body)

        await updateStatus(content.request_id, 'delivered')
        
        logger.info(`Push notification sent successfully to token ending in ...${user.push_token.slice(-5)}`)
        channel.ack(msg)
      } catch (error) {
        logger.error('Error processing push notification:', error.message)
        if (content?.request_id) {
          await updateStatus(content.request_id, 'failed', { error: error.message })
        }
        channel.nack(msg, false, false)
      }
    }
  })

  // Failed/Dead Letter Queue Consumer — just logs for now, for visibility
  channel.consume(QUEUES.failed, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString())
        logger.warn(`Dead-lettered message received: request_id=${content.request_id}, type=${content.notification_type}, user_id=${content.user_id}`)

        if (content.request_id) {
          await updateStatus(content.request_id, 'failed', { reason: 'moved to dead letter queue' })
        }

        channel.ack(msg)
      } catch (error) {
        logger.error('Error processing dead-lettered message:', error.message)
        channel.ack(msg) // ack anyway — nothing more we can do with malformed data
      }
    }
  })

  logger.info('Consumers started and listening for messages')
}

module.exports = { startConsumers }
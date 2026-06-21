const { getChannel } = require('../config/rabbitmq')
const { sendResponse } = require('../utils/response')

const EXCHANGE = 'notifications.direct'

const sendNotification = async (req, res, next) => {
  try {
    const { notification_type, user_id, template_code, variables, request_id, priority, metadata } = req.body
    const channel = getChannel()

    if (!channel) {
      throw new Error('RabbitMQ channel not available')
    }

    const payload = {
      notification_type,
      user_id,
      template_code,
      variables,
      request_id,
      priority: priority || 1,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    }

    const routingKey = notification_type // 'email' or 'push'

    channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    )

    return sendResponse(res, {
      status_code: 202,
      message: 'Notification request accepted and queued',
      data: { request_id },
    })

  } catch (error) {
    next(error)
  }
}

module.exports = { sendNotification }

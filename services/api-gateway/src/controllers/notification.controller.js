const { getChannel } = require('../config/rabbitmq')
const { sendResponse } = require('../utils/response')
const { setNotificationStatus, getNotificationStatus } = require('../services/status.service')

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

    const routingKey = notification_type

    channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    )

    await setNotificationStatus(request_id, 'pending', { notification_type, user_id })

    return sendResponse(res, {
      status_code: 202,
      message: 'Notification request accepted and queued',
      data: { request_id, status: 'pending' },
    })

  } catch (error) {
    next(error)
  }
}

const checkNotificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const status = await getNotificationStatus(id)

    return sendResponse(res, {
      status_code: 200,
      message: 'Notification status fetched successfully',
      data: status,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { sendNotification, checkNotificationStatus }
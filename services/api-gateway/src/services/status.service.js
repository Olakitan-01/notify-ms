const redis = require('../config/redis')

const EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

const setNotificationStatus = async (notification_id, status, meta = {}) => {
  const data = JSON.stringify({
    notification_id,
    status,
    meta,
    updated_at: new Date().toISOString(),
  })

  await redis.set(`notification:${notification_id}`, data, 'EX', EXPIRY)
}

const getNotificationStatus = async (notification_id) => {
  const data = await redis.get(`notification:${notification_id}`)

  if (!data) {
    const error = new Error('Notification not found')
    error.status = 404
    throw error
  }

  return JSON.parse(data)
}

module.exports = { setNotificationStatus, getNotificationStatus }
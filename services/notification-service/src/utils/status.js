const redis = require('../config/redis')

const EXPIRY = 60 * 60 * 24 * 7

const updateStatus = async (request_id, status, meta = {}) => {
  const data = JSON.stringify({
    notification_id: request_id,
    status,
    meta,
    updated_at: new Date().toISOString(),
  })

  await redis.set(`notification:${request_id}`, data, 'EX', EXPIRY)
}

module.exports = { updateStatus }
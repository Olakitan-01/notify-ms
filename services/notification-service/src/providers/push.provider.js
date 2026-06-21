const axios = require('axios')
const env = require('../config/index')
const logger = require('../utils/logger')

// Note: This is a placeholder for Firebase Cloud Messaging (FCM) Legacy HTTP API
// In a real app, you'd use firebase-admin SDK
const sendPush = async (token, title, body, data = {}) => {
  try {
    const response = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: token,
        notification: {
          title,
          body,
        },
        data,
      },
      {
        headers: {
          'Authorization': `key=${env.push.fcm_server_key}`,
          'Content-Type': 'application/json',
        },
      }
    )

    logger.info(`Push notification sent to ${token}: ${response.data.message_id}`)
    return response.data
  } catch (error) {
    logger.error('Push notification failed:', error.response ? error.response.data : error.message)
    throw error
  }
}

module.exports = { sendPush }

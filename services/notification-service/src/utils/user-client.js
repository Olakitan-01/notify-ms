const axios = require('axios')
const env = require('../config/index')

const getUserData = async (userId) => {
  // In a microservices environment, we call the User Service via the API Gateway internal URL
  // or directly if they are in the same network.
  // For now, let's assume we call it through the gateway or user service host
  try {
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5001'
    const response = await axios.get(`${userServiceUrl}/api/v1/users/${userId}`)
    return response.data.data
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`)
  }
}

module.exports = { getUserData }

const jwt = require('jsonwebtoken')
const env = require('../config/index.config')
const { sendResponse } = require('../utils/response')

const authenticate = (req, res, next) => {
  const auth_header = req.headers.authorization

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return sendResponse(res, {
      status_code: 401,
      success: false,
      message: 'Access denied',
      error: 'No token provided',
    })
  }

  const token = auth_header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    return sendResponse(res, {
      status_code: 401,
      success: false,
      message: 'Access denied',
      error: 'Invalid or expired token',
    })
  }
}

module.exports = { authenticate }
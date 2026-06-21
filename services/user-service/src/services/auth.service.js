const User = require('../models/user.model')
const { hashPassword, comparePassword } = require('../utils/hash')
const jwt = require('jsonwebtoken')
const env = require('../config/index.config')
const { getChannel } = require('../config/rabbitmq.config')

const EXCHANGE = 'notifications.direct'

const registerUser = async ({ name, email, password }) => {

  const existing_user = await User.findOne({ where: { email } })
  if (existing_user) {
    const error = new Error('Email already registered')
    error.status = 409
    throw error
  }

  const hashed_password = await hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: hashed_password,
  })

  // Publish notification event
  const channel = getChannel()
  if (channel) {
    const payload = {
      notification_type: 'email',
      user_id: user.id,
      template_code: 'WELCOME_EMAIL',
      variables: { name: user.name },
      request_id: require('crypto').randomUUID(),
    }

    channel.publish(
      EXCHANGE,
      'email',
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    )
    console.log(`Welcome email event published for user: ${user.id}`)
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    created_at: user.created_at,
  }
}

const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ where: { email } })
  if (!user) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  const is_match = await comparePassword(password, user.password)
  if (!is_match) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expires_in }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    }
  }
}

module.exports = { registerUser, loginUser }
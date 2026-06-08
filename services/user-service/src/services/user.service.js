const User = require('../models/user.model')

const getUserById = async (id) => {
  const user = await User.findOne({ where: { id } })
  
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    push_token: user.push_token,
    preferences: user.preferences,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}

const updatePushToken = async (id, push_token) => {
  const user = await User.findOne({ where: { id } })

  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  await user.update({ push_token })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    push_token: user.push_token,
  }
}

const updatePreferences = async (id, preferences) => {
  const user = await User.findOne({ where: { id } })

  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const updated_preferences = {
    email: preferences.email ?? user.preferences.email,
    push: preferences.push ?? user.preferences.push,
  }

  await user.update({ preferences: updated_preferences })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
  }
}

module.exports = { getUserById, updatePushToken, updatePreferences }
const { getUserById, updatePushToken, updatePreferences } = require('../services/user.service')
const { sendResponse } = require('../utils/response')
const asyncHandler = require('../middlewares/async.middleware')

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await getUserById(id)

  return sendResponse(res, {
    status_code: 200,
    success: true,
    message: 'User fetched successfully',
    data: user,
  })
})

const updateToken = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { push_token } = req.body

  const user = await updatePushToken(id, push_token)

  return sendResponse(res, {
    status_code: 200,
    success: true,
    message: 'Push token updated successfully',
    data: user,
  })
})

const updateUserPreferences = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { preferences } = req.body

  const user = await updatePreferences(id, preferences)

  return sendResponse(res, {
    status_code: 200,
    success: true,
    message: 'Preferences updated successfully',
    data: user,
  })
})

module.exports = { getUser, updateToken, updateUserPreferences }
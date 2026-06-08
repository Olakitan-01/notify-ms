const { registerUser, loginUser } = require('../services/auth.service')
const { sendResponse } = require('../utils/response')
const asyncHandler = require('../middlewares/async.middleware')

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const user = await registerUser({ name, email, password })

  return sendResponse(res, {
    status_code: 201,
    success: true,
    message: 'User registered successfully',
    data: user,
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const result = await loginUser({ email, password })

  return sendResponse(res, {
    status_code: 200,
    success: true,
    message: 'Login successful',
    data: result,
  })
})
 
module.exports = { register, login }
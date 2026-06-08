const express = require('express')
const router = express.Router()
const { getUser, updateToken, updateUserPreferences } = require('../controllers/user.controller')
const { authenticate } = require('../middlewares/auth.middleware')

router.get('/:id', authenticate, getUser)
router.patch('/:id/push-token', authenticate, updateToken)
router.patch('/:id/preferences', authenticate, updateUserPreferences)

module.exports = router
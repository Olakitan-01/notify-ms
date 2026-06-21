const express = require('express')
const router = express.Router()
const { sendNotification } = require('../controllers/notification.controller')
const { validate, schemas } = require('../middlewares/validate.middleware')
const { authenticate } = require('../middlewares/auth.middleware')

router.post('/send', authenticate, validate(schemas.send_notification), sendNotification)

module.exports = router

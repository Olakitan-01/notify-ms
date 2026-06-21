const Joi = require('joi')
const { sendResponse } = require('../utils/response')

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const error_messages = error.details.map((detail) => detail.message).join(', ')
      return sendResponse(res, {
        status_code: 400,
        success: false,
        message: 'Validation failed',
        error: error_messages,
      })
    }

    next()
  }
}

const schemas = {
  send_notification: Joi.object({
    notification_type: Joi.string().valid('email', 'push').required(),
    user_id: Joi.string().uuid().required(),
    template_code: Joi.string().required(),
    variables: Joi.object({
      name: Joi.string().required(),
      link: Joi.string().uri().optional(),
      meta: Joi.object().optional(),
    }).required(),
    request_id: Joi.string().required(),
    priority: Joi.number().integer().min(1).max(10).optional(),
    metadata: Joi.object().optional(),
  }),
}

module.exports = { validate, schemas }
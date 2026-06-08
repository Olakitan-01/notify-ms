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
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

}

module.exports = { validate, schemas }
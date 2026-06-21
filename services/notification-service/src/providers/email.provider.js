const nodemailer = require('nodemailer')
const env = require('../config/index')
const logger = require('../utils/logger')

const transporter = nodemailer.createTransport({
  host: env.email.nodemailer.host,
  port: env.email.nodemailer.port,
  secure: env.email.nodemailer.port == 465,
  auth: {
    user: env.email.nodemailer.user,
    pass: env.email.nodemailer.pass,
  },
})

const sendEmail = async (to, subject, body, isHtml = true) => {
  try {
    const info = await transporter.sendMail({
      from: env.email.from_email,
      to,
      subject,
      [isHtml ? 'html' : 'text']: body,
    })

    logger.info(`Email sent: ${info.messageId}`)
    return info
  } catch (error) {
    logger.error('Email sending failed:', error)
    throw error
  }
}

module.exports = { sendEmail }

const env = {
  port: process.env.PORT || 5003,
  node_env: process.env.NODE_ENV || 'development',
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'nodemailer', // 'sendgrid' or 'nodemailer'
    sendgrid_api_key: process.env.SENDGRID_API_KEY,
    from_email: process.env.FROM_EMAIL || 'no-reply@notificationsystem.com',
    nodemailer: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  },
  push: {
    fcm_server_key: process.env.FCM_SERVER_KEY,
  }
}

module.exports = env

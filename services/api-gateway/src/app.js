const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const proxy = require('express-http-proxy')
const env = require('./config/index')
const notificationRoutes = require('./routes/notification.route')

const app = express()

// Security & Middlewares
app.use(helmet())
app.use(cors())
if (env.node_env === 'development') {
  app.use(morgan('dev'))
}

// Routes that don't need body parsing
// Proxy routes should come BEFORE express.json() if you want to avoid issues with body parsing
// However, if we need to inspect or transform the body, we might need it.
// For simple proxying, it's often better to proxy before parsing.
// But we have a mix of local routes and proxy routes.

// Local health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    data: null,
    meta: {
      timestamp: new Date().toISOString()
    },
  })
})

// Proxy routes to User Service
const userServiceProxy = proxy(env.services.user_service_url, {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyErrorHandler: (err, res, next) => {
    res.status(503).json({
      success: false,
      message: 'User Service is currently unavailable',
      error: err.message
    })
  }
})

app.use('/api/v1/auth', userServiceProxy)
app.use('/api/v1/users', userServiceProxy)

// Standard body parsing for local routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Local routes
app.use('/api/v1/notifications', notificationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.url}`,
    data: null,
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: err.message,
    data: null,
  })
})

module.exports = app

const express = require('express')
const morgan = require('morgan')
const authRoutes = require('./routes/auth.route.js')
const userRoutes = require('./routes/user.route.js')

const app = express()

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User service is running',
    data: null,
    meta: {
      total: 0,
      limit: 0,
      page: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    },
  })
})

//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.url}`,
    meta: {
      total: 0,
      limit: 0,
      page: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    },
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: err.message,
    meta: {
      total: 0,
      limit: 0,
      page: 0,
      total_pages: 0,
      has_next: false,
      has_previous: false,
    },
  })
})

module.exports = app
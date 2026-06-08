const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    data: null,
    error: null,
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

// routes — uncomment as we build them
// app.use('/api/v1/notifications', notificationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.url}`,
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

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: err.message,
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

module.exports = app
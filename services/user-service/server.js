// Initialize environment variables
require('dotenv').config()
// Fix: Import path was './src/config/db', should be './src/config/db.config'
const { connectDB } = require('./src/config/db.config')
const { connectRabbitMQ } = require('./src/config/rabbitmq.config')
const env = require('./src/config/index.config')
const app = require('./src/app')

const startServer = async () => {
  try {
    await connectDB()
    await connectRabbitMQ()
    
    // Fix: Using env.port which is now imported above
    app.listen(env.port, () => {
      console.log(`User service is running on port ${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
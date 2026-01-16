import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import authRoutes from './routes/auth'
import cartRoutes from './routes/carts'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Seed sample products if database is empty
    const Product = require('./models/Product').default
    const productCount = await Product.countDocuments()

    // Always reseed products to get updated images
    if (true) {
      // Delete all existing products
      await Product.deleteMany({})
      
      const sampleProducts = [
        {
          name: 'Wireless Headphones',
          price: 399.99,
          description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
          stock: 50,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1657223143970-08cc5afe9943?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'USB-C Cable',
          price: 249.99,
          description: 'Durable USB-C cable for fast charging and data transfer. Supports 100W charging.',
          stock: 100,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1595756630452-736bc8ef3693?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Laptop Stand',
          price: 349.99,
          description: 'Adjustable aluminum laptop stand for better ergonomics and improved desk organization.',
          stock: 30,
          category: 'Office',
          image: 'https://plus.unsplash.com/premium_photo-1683736986821-e4662912a70d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFwdG9wJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D',
        },
        {
          name: 'Mouse Pad',
          price: 199.99,
          description: 'Large non-slip mouse pad with wrist support. Perfect for gaming and work.',
          stock: 75,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1587749091716-f7b291a87f87?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Wireless Mouse',
          price: 299.99,
          description: 'High-precision wireless mouse with ergonomic design and 18-month battery life.',
          stock: 40,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1707592691247-5c3a1c7ba0e3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Phone Screen Protector',
          price: 229.99,
          description: 'Tempered glass screen protector with high clarity and anti-fingerprint coating.',
          stock: 200,
          category: 'Accessories',
          image: 'https://plus.unsplash.com/premium_photo-1681702307639-1b3b0d7a5d7c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: '4K Webcam',
          price: 1299.99,
          description: 'Ultra HD 4K webcam with autofocus and built-in microphone for crystal clear video calls.',
          stock: 25,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1728971975421-50f3dc9663a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Desk Lamp',
          price: 329.99,
          description: 'LED desk lamp with adjustable brightness and color temperature. Energy efficient.',
          stock: 45,
          category: 'Office',
          image: 'https://images.unsplash.com/photo-1621447980929-6638614633c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzayUyMGxhbXB8ZW58MHx8MHx8fDA%3D',
        },
        {
          name: 'USB Hub',
          price: 279.99,
          description: '7-port USB 3.0 hub with fast charging capability and individual switches.',
          stock: 60,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1760376789487-994070337c76?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Portable SSD',
          price: 1499.99,
          description: '1TB portable SSD with 550MB/s read speed and rugged design.',
          stock: 35,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1577538926210-fc6cc624fde2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydGFibGUlMjBzc2R8ZW58MHx8MHx8fDA%3D',
        },
        {
          name: 'Desk Organizer',
          price: 299.99,
          description: 'Multi-compartment wooden desk organizer for pens, papers, and small items.',
          stock: 55,
          category: 'Office',
          image: 'https://images.unsplash.com/photo-1644463589256-02679b9c0767?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
          name: 'Phone Stand',
          price: 249.99,
          description: 'Adjustable aluminum phone stand compatible with all smartphones.',
          stock: 80,
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1553556135-009e5858adce?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
      ]

      await Product.insertMany(sampleProducts)
      console.log('✓ Sample products seeded to database')
    }
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error)
    process.exit(1)
  }
}

// Start server
async function startServer() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`)
    console.log(`✓ API available at http://localhost:${PORT}/api`)
  })
}

startServer()

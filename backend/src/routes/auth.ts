import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import Cart from '../models/Cart'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' })
    }

    // Create new user
    const user = new User({ username, email, password })
    await user.save()

    // Create empty cart for user
    await Cart.create({ userId: user._id.toString(), items: [] })

    // Generate token
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to sign up' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: '7d',
    })

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to login' })
  }
})

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json({ user: { id: user._id, username: user.username, email: user.email } })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
})

export default router

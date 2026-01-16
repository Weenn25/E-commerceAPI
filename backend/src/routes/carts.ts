import { Router, Request, Response } from 'express'
import Cart from '../models/Cart'
import Product from '../models/Product'
import { protect, AuthRequest } from '../middleware/auth'

const router = Router()

// Get user's cart
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })

    if (!cart) {
      return res.json({ items: [] })
    }

    return res.json({ items: cart.items })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch cart' })
  }
})

// Add item to cart
router.post('/add', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, name, price, quantity, stock } = req.body

    if (!productId || !name || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    let cart = await Cart.findOne({ userId: req.userId })

    if (!cart) {
      cart = await Cart.create({
        userId: req.userId,
        items: [{ _id: productId, name, price, quantity, stock }],
      })
      return res.json(cart)
    }

    // Check if item already exists
    const existingItem = cart.items.find((item) => item._id === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ _id: productId, name, price, quantity, stock })
    }

    await cart.save()
    return res.json(cart)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to add to cart' })
  }
})

// Update cart item quantity
router.put('/update/:productId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    const cart = await Cart.findOne({ userId: req.userId })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const item = cart.items.find((item) => item._id === productId)

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' })
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item._id !== productId)
    } else {
      item.quantity = quantity
    }

    await cart.save()
    return res.json(cart)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to update cart' })
  }
})

// Remove item from cart
router.delete('/remove/:productId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ userId: req.userId })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = cart.items.filter((item) => item._id !== productId)
    await cart.save()

    return res.json(cart)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to remove from cart' })
  }
})

// Clear cart
router.post('/clear', protect, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    cart.items = []
    await cart.save()

    return res.json(cart)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to clear cart' })
  }
})

export default router

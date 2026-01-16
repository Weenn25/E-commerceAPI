import { Router, Request, Response } from 'express'
import Order, { IOrder } from '../models/Order'
import Product from '../models/Product'
import Cart from '../models/Cart'
import { protect, AuthRequest } from '../middleware/auth'

const router = Router()

// Get user's orders
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 })
    return res.json(orders)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get order by ID
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    return res.json(order)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Create order
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { customerName, email, address, items, total } = req.body

    // Validation
    if (!customerName || !email || !address) {
      return res.status(400).json({ error: 'Missing required customer information' })
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' })
    }

    if (!total || total < 0) {
      return res.status(400).json({ error: 'Invalid total amount' })
    }

    // Check stock for all items
    for (const item of items) {
      const product = await Product.findById(item._id)
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }
    }

    // Deduct stock from products
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      )
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      customerName,
      email,
      address,
      items,
      total,
      status: 'completed',
    })

    const savedOrder = await order.save()

    // Clear user's cart
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] })

    return res.status(201).json(savedOrder)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create order' })
  }
})

// Update order status
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' })
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    return res.json(order)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to update order' })
  }
})

// Cancel order
router.post('/:id/cancel', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled order' })
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { stock: item.quantity } },
        { new: true }
      )
    }

    order.status = 'cancelled'
    await order.save()

    return res.json(order)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to cancel order' })
  }
})

export default router

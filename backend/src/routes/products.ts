import { Router, Request, Response } from 'express'
import Product from '../models/Product'

const router = Router()

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return res.json(products)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    return res.json(product)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock, category } = req.body

    // Validation
    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' })
    }

    if (stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' })
    }

    const product = new Product({
      name,
      price,
      description,
      stock: stock || 0,
      category,
    })

    const savedProduct = await product.save()
    return res.status(201).json(savedProduct)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create product' })
  }
})

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock, category } = req.body

    // Validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' })
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, stock, category },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.json(product)
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to update product' })
  }
})

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    return res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router

import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message)
    return res.status(400).json({ error: messages.join(', ') })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // Default error
  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
}

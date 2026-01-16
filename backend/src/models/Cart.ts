import mongoose, { Schema, Document } from 'mongoose'

export interface ICartItem {
  _id: string
  name: string
  price: number
  quantity: number
  stock: number
}

export interface ICart extends Document {
  userId: string
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
    },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        stock: Number,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model<ICart>('Cart', cartSchema)

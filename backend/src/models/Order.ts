import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  _id: string
  name: string
  price: number
  quantity: number
}

export interface IOrder extends Document {
  userId: string
  customerName: string
  email: string
  address: string
  items: IOrderItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>('Order', orderSchema)

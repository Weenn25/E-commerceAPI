import { useState } from 'react'
import './Checkout.css'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface CheckoutProps {
  cartItems: CartItem[]
  onCheckout: (data: {
    customerName: string
    email: string
    address: string
  }) => void
  onCancel: () => void
}

export default function Checkout({
  cartItems,
  onCheckout,
  onCancel,
}: CheckoutProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customerName || !formData.email || !formData.address) {
      alert('Please fill in all fields')
      return
    }
    setLoading(true)
    await onCheckout(formData)
    setLoading(false)
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h2>Checkout</h2>
        <p>Complete your order</p>
      </div>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Customer Information</h3>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="customerName"
                placeholder="John Doe"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="123 Main Street, City, State 12345"
                value={formData.address}
                onChange={handleChange}
                rows={4}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Back to Cart
            </button>
            <button type="submit" className="btn-place-order" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="summary-item-info">
                  <div className="summary-item-name">{item.name}</div>
                  <div className="summary-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="summary-item-price">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-breakdown">
            <div className="breakdown-row">
              <span>Subtotal:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="breakdown-row">
              <span>Tax (10%):</span>
              <span>₱{(total * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>₱{(total * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Orders.css'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  customerName: string
  email: string
  address: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export default function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
      setError('')
    } catch (err) {
      setError('Failed to load orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <p className="orders-subtitle">View your order history and status</p>

      {error && <div className="orders-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet</p>
          <p className="orders-empty-hint">Start shopping to place your first order!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-summary">
                  <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                  <span className="order-total">₱{order.total.toFixed(2)}</span>
                  <span className={`order-expand ${expandedOrder === order._id ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="order-details">
                  <div className="order-customer">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>₱{item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="order-total-section">
                    <p><strong>Total Amount:</strong> ₱{order.total.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

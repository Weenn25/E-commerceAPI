import './Cart.css'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  stock: number
}

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveFromCart: (productId: string) => void
  onCheckout: () => void
}

export default function Cart({
  items,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p>{items.length} item(s) in your cart</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.name.charAt(0).toUpperCase()}
                </div>

                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item._id, parseInt(e.target.value) || 1)
                    }
                    className="qty-input"
                  />
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="btn-remove"
                  onClick={() => onRemoveFromCart(item._id)}
                  title="Remove from cart"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-header">Order Summary</div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>

            <button className="btn-checkout" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

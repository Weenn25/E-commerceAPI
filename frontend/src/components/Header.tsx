import './Header.css'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  cartCount: number
  currentPage: 'products' | 'cart' | 'checkout' | 'orders'
  onNavigate: (page: 'products' | 'cart' | 'checkout' | 'orders') => void
}

export default function Header({ cartCount, currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="logo">🛍️ E-Store</h1>
        </div>

        <nav className="nav">
          <button
            className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => onNavigate('products')}
          >
            Products
          </button>
          <button
            className={`nav-link ${currentPage === 'cart' ? 'active' : ''}`}
            onClick={() => onNavigate('cart')}
          >
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button
            className={`nav-link ${currentPage === 'orders' ? 'active' : ''}`}
            onClick={() => onNavigate('orders')}
          >
            Orders
          </button>
        </nav>

        <div className="user-section">
          {user && (
            <>
              <span className="username">👤 {user.username}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

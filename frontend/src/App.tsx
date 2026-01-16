import { useState, useEffect } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Signup from './components/Signup'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Orders from './components/Orders'
import Header from './components/Header'

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  stock: number
}

interface Product {
  _id: string
  name: string
  price: number
  description: string
  stock: number
  category: string
}

type AuthPage = 'login' | 'signup'

function App() {
  const { user, token, loading: authLoading } = useAuth()
  const [authPage, setAuthPage] = useState<AuthPage>('login')
  const [page, setPage] = useState<'products' | 'cart' | 'checkout' | 'orders'>('products')
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = 'http://localhost:5000/api'

  // Fetch products
  useEffect(() => {
    if (user && token) {
      fetchProducts()
      fetchCart()
    }
  }, [user, token])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      setCart(data.items || [])
    } catch (err) {
      console.error('Failed to load cart:', err)
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        }),
      })

      if (!response.ok) throw new Error('Failed to add to cart')
      const data = await response.json()
      setCart(data.items || [])
    } catch (err) {
      alert('Failed to add to cart')
      console.error(err)
    }
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Failed to remove from cart')
        const data = await response.json()
        setCart(data.items || [])
      } else {
        const response = await fetch(`${API_URL}/cart/update/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        })
        if (!response.ok) throw new Error('Failed to update cart')
        const data = await response.json()
        setCart(data.items || [])
      }
    } catch (err) {
      alert('Failed to update cart')
      console.error(err)
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to remove from cart')
      const data = await response.json()
      setCart(data.items || [])
    } catch (err) {
      alert('Failed to remove from cart')
      console.error(err)
    }
  }

  const handleCheckout = async (orderData: {
    customerName: string
    email: string
    address: string
  }) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: orderData.customerName,
          email: orderData.email,
          address: orderData.address,
          items: cart,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')
      alert('Order placed successfully!')
      setCart([])
      setPage('products')
      await fetchProducts()
    } catch (err) {
      alert('Failed to place order. Please try again.')
      console.error(err)
    }
  }

  // Show auth pages if not logged in
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || !token) {
    return authPage === 'login' ? (
      <Login onSwitchToSignup={() => setAuthPage('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthPage('login')} />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cart.length}
        currentPage={page}
        onNavigate={setPage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {loading && page === 'products' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : page === 'products' ? (
          <ProductList products={products} onAddToCart={handleAddToCart} />
        ) : page === 'cart' ? (
          <Cart
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={() => setPage('checkout')}
          />
        ) : page === 'checkout' ? (
          <Checkout
            cartItems={cart}
            onCheckout={handleCheckout}
            onCancel={() => setPage('cart')}
          />
        ) : (
          <Orders />
        )}
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App

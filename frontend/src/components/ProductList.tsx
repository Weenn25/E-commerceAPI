import './ProductList.css'
import { useState, useMemo } from 'react'

interface Product {
  _id: string
  name: string
  price: number
  description: string
  stock: number
  category: string
  image?: string
}

interface ProductListProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const handleImageError = (productId: string) => {
    setFailedImages((prev) => new Set([...prev, productId]))
  }

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return ['All', ...Array.from(cats).sort()]
  }, [products])

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products
    }
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Our Products</h2>
        <p>Discover our amazing collection</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products available in this category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image && !failedImages.has(product._id) ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onError={() => handleImageError(product._id)}
                  />
                ) : (
                  <div className="image-placeholder">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="out-of-stock-badge">Out of Stock</div>
                )}
              </div>

              <div className="product-content">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <div className="product-stock">
                    {product.stock > 0 ? (
                      <span className="in-stock">In Stock ({product.stock})</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-add-to-cart"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

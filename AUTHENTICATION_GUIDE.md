# Authentication System Setup Guide

## What's New

I've added a complete user authentication system with login/signup functionality. Each user now has:
- ✅ Separate user accounts with secure password hashing
- ✅ User-specific shopping carts (database-backed, not localStorage)
- ✅ User-specific orders and order history
- ✅ JWT token-based authentication
- ✅ Automatic session persistence
- ✅ Beautiful login/signup pages

## Backend Installation

1. Navigate to the backend directory:
```bash
cd "E-commerce API/backend"
```

2. Install new dependencies:
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

3. Verify the .env file has JWT_SECRET:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the backend:
```bash
npm run dev
```

## Frontend Installation

1. Navigate to the frontend directory:
```bash
cd "E-commerce API/frontend"
```

2. The dependencies are already installed. Start the frontend:
```bash
npm run dev
```

## New Backend Endpoints

### Authentication Routes (`/api/auth`)
- `POST /auth/signup` - Create new account
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- `POST /auth/login` - Login to account
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /auth/me` - Get current user info (requires token)

### Cart Routes (`/api/cart`) - All require authentication token
- `GET /cart` - Get user's cart items
- `POST /cart/add` - Add item to cart
- `PUT /cart/update/:productId` - Update item quantity
- `DELETE /cart/remove/:productId` - Remove item from cart
- `POST /cart/clear` - Clear entire cart

### Protected Routes
- All order endpoints now require authentication
- All cart operations are user-specific
- Products remain public (no auth required)

## Authentication Flow

1. **User lands on site** → Shown login page
2. **User creates account** → Signup form with validation
3. **Successful signup/login** → Token stored in localStorage
4. **Token sent with requests** → `Authorization: Bearer {token}` header
5. **Access products** → Browse and add to cart (cart is per-user)
6. **Checkout** → Order is tied to user account
7. **Logout** → Token cleared, redirected to login

## Token Usage

When making API requests after login, include the token:

```typescript
const response = await fetch(`${API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Token from login response
  },
  body: JSON.stringify(orderData)
})
```

## Password Security

- Passwords are hashed using bcryptjs with 10 salt rounds
- Passwords are never sent back from the server
- Only the hash is stored in MongoDB

## Database Models

### User Model
```
{
  username: string (unique, min 3 chars)
  email: string (unique, valid email)
  password: string (hashed, min 6 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Cart Model
```
{
  userId: string (reference to User)
  items: [{
    _id: string (product ID)
    name: string
    price: number
    quantity: number
    stock: number
  }]
  createdAt: Date
  updatedAt: Date
}
```

### Order Model (Updated)
```
{
  userId: string (reference to User)
  customerName: string
  email: string
  address: string
  items: [...]
  total: number
  status: string
  createdAt: Date
  updatedAt: Date
}
```

## Frontend Components

### New Components
- `AuthContext.tsx` - Authentication state management
- `Login.tsx` - Login page with form validation
- `Signup.tsx` - Account creation page
- `Auth.css` - Beautiful authentication styling

### Updated Components
- `App.tsx` - Now shows login/signup if not authenticated
- `Header.tsx` - Shows username and logout button
- `Cart.tsx` - Now syncs with backend per-user cart
- `Checkout.tsx` - Orders are now user-specific

## Testing the System

1. **Start both servers** (backend on 5000, frontend on 5173)
2. **Create first account**: 
   - Switch to "Sign Up" tab
   - Username: user1
   - Email: user1@test.com
   - Password: test123
3. **Add to cart** and checkout
4. **Logout** and create second account
5. **Verify**: Cart is empty for new user, orders are separate

## Environment Variables

**Backend .env:**
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Change `JWT_SECRET` in production to a secure random string!

## Important Notes

1. **Token Expiration**: Tokens expire in 7 days
2. **Cart Persistence**: Cart is stored in MongoDB (survives page refresh)
3. **Session Persistence**: Token is stored in localStorage (auto-login on page refresh)
4. **CORS**: Enabled for localhost:5173
5. **Security**: In production, use HTTPS and secure JWT secrets

## Troubleshooting

**Issue: "No token provided" error**
- Solution: Make sure you're logged in before accessing cart/orders

**Issue: "Invalid email or password"**
- Solution: Check your email/password, case-sensitive

**Issue: Cart not syncing**
- Solution: Check browser console for errors, verify backend is running

**Issue: Can't create account with email**
- Solution: Email already exists, try different email or login instead

---

The authentication system is now fully integrated! Each user has complete data isolation and secure sessions. 🎉

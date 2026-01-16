# E-Commerce System

A beautiful, responsive e-commerce application with React frontend and Node.js/Express backend with MongoDB database.

## Features

### Frontend
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Minimalistic UI**: Clean and user-friendly interface
- **Product Listing**: Browse all available products with categories
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout**: Complete customer information form
- **Real-time Updates**: Stock information updates in real-time

### Backend
- **Product Management**: CRUD operations for products
- **Order Management**: Create, track, and manage orders
- **Stock Validation**: Automatic stock validation and deduction
- **Price Validation**: Ensures valid pricing
- **MongoDB Integration**: Persistent data storage with MongoDB

## Project Structure

```
E-commerce API/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # Entry point
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                  # Node.js backend
    ├── src/
    │   ├── models/          # MongoDB schemas
    │   ├── routes/          # API routes
    │   ├── middleware/      # Custom middleware
    │   └── server.ts        # Main server file
    ├── package.json
    └── .env
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or a connection string)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd "E-commerce API/backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MongoDB connection in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "E-commerce API/frontend"
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or a different port if 5173 is in use)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

## Example API Requests

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "price": 599.99,
    "description": "Latest smartphone with amazing features",
    "stock": 25,
    "category": "Electronics"
  }'
```

### Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "items": [
      {
        "_id": "product_id_here",
        "name": "Wireless Headphones",
        "price": 79.99,
        "quantity": 1
      }
    ],
    "total": 87.89
  }'
```

## MongoDB Setup

### Local MongoDB
If you don't have MongoDB installed, you can:

1. **Install MongoDB Community Edition** from https://www.mongodb.com/try/download/community
2. **Start MongoDB service** (on Windows):
   ```bash
   net start MongoDB
   ```

### MongoDB Atlas (Cloud)
Alternatively, use MongoDB Atlas for a cloud database:
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `.env` with your connection string

## Development

### Frontend Development
- The frontend uses React with TypeScript and Vite
- Tailwind CSS is configured for styling
- Hot module reloading is enabled
- Navigate between Products, Cart, and Checkout pages

### Backend Development
- Uses Express for API routing
- MongoDB with Mongoose for data modeling
- Comprehensive input validation
- Error handling middleware included

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/`

### Backend Build
```bash
cd backend
npm run build
```

Output will be in `backend/dist/`

## Features Implementation Details

### Stock Management
- Products have a stock field
- When an order is placed, stock is automatically deducted
- If order is cancelled, stock is restored
- Cannot order more items than available stock

### Order Validation
- Customer information is required
- Stock is validated before order creation
- Price validation ensures no negative values
- Email validation is performed

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly interface
- Optimized for all screen sizes

## Testing the Application

1. **View Products**: Navigate to Products page to see seeded sample products
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click Cart in header to see added items
4. **Checkout**: Click "Proceed to Checkout" and fill in customer information
5. **Place Order**: Submit the form to create the order
6. **Verify**: Check that stock has been deducted from products

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running locally or check your connection string
- Verify port 27017 is available (default MongoDB port)

### CORS Errors
- Backend CORS is configured to accept requests from frontend
- Check that both servers are running

### Port Already in Use
- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT in `.env` file

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check:
- MongoDB documentation: https://docs.mongodb.com/
- Express documentation: https://expressjs.com/
- React documentation: https://react.dev/

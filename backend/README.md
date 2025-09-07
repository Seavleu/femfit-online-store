# FemFit E-Commerce Backend

A Node.js/Express.js backend API for the FemFit e-commerce platform with MongoDB integration.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with multi-language support
- **Cart Functionality**: Persistent cart management across sessions
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: ABA PayWay integration for local payments
- **Multi-currency Support**: USD and KHR pricing
- **Multi-language**: Khmer and English content support

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy the `.env` file and update the values as needed:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for JWT token generation
   - `ABA_PAYWAY_*`: PayWay API credentials
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
   - `GOOGLE_REDIRECT_URI`: OAuth redirect URI, e.g. `http://localhost:5000/api/auth/google/callback`
   - `AUTH_COOKIE_NAME`: Cookie name for JWT (default: `ff_jwt`)
   - `COOKIE_DOMAIN`: Cookie domain for production (e.g. `.your-domain.com`)
   - `AUTH_SUCCESS_REDIRECT`: Optional frontend URL after success
   - `AUTH_FAILURE_REDIRECT`: Optional frontend URL after failure

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /verify` - Verify JWT token
- `GET /google/init` - Get Google OAuth URL to start login
- `GET /google/callback` - Google OAuth callback to exchange code and set JWT cookie
- `POST /logout` - Clear auth cookie

### Products (`/api/products`)
- `GET /` - Get all products (with filtering)
- `GET /:id` - Get single product
- `GET /featured/list` - Get featured products
- `GET /category/:category` - Get products by category
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)

### Cart (`/api/cart`)
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /update/:itemId` - Update cart item quantity
- `DELETE /remove/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Orders (`/api/orders`)
- `GET /` - Get user's orders
- `GET /:id` - Get single order
- `POST /create` - Create new order
- `GET /track/:orderNumber` - Track order (public)
- `GET /admin/all` - Get all orders (Admin only)
- `PUT /:id/status` - Update order status (Admin only)

### Payments (`/api/payments`)
- `POST /payway/create` - Create PayWay payment
- `POST /payway/webhook` - PayWay webhook handler
- `GET /verify/:transactionId` - Verify payment status

## Database Models

### User
- Personal information and authentication
- Addresses and preferences
- Language and currency settings

### Product
- Multi-language product information
- Multi-currency pricing (USD/KHR)
- Category and tag management
- Stock and variant tracking

### Order
- Complete order information
- Payment and shipping details
- Status tracking
- Multi-currency totals

### Cart
- Persistent cart storage
- Product variants selection
- Quantity management

### PromoCode
- Discount code management
- Usage tracking and limits
- Category and product restrictions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- CORS configuration
- Secure HTTP-only JWT cookies with SameSite settings for cross-origin auth
- ID token verification with Google for OAuth sign-in

## Google OAuth – Frontend usage

1. Start login by requesting the init endpoint and redirecting to the returned URL:
```ts
async function loginWithGoogle() {
  const res = await fetch('http://localhost:5000/api/auth/google/init', {
    credentials: 'include'
  });
  const { url } = await res.json();
  window.location.href = url;
}
```

2. After callback completes, the backend sets an HTTP-only cookie. Call APIs with credentials:
```ts
const res = await fetch('http://localhost:5000/api/auth/verify', {
  credentials: 'include'
});
```

Ensure your frontend origin is allowed by CORS and you are using HTTPS in production.

## Development

The backend is structured with:
- **Models**: MongoDB schemas using Mongoose
- **Routes**: API endpoint handlers
- **Middleware**: Authentication and validation
- **Utils**: Helper functions and utilities

## Deployment

This backend can be deployed to various platforms:
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: App Platform or Droplets
- **AWS**: EC2, Lambda, or Elastic Beanstalk
- **Google Cloud**: Cloud Run or Compute Engine

Make sure to set all environment variables in your deployment platform.
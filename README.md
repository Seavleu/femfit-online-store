# FEMFIT E-commerce Platform

A modern, full-stack e-commerce platform for fashion and fitness products built with Next.js 15, Node.js, TypeScript, and MongoDB.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Clean, minimalist design with black and white theme
- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Interactive Animations**: GSAP-powered animations and smooth scrolling effects
- **Product Showcase**: Dynamic product grids with hover effects and filtering
- **Shopping Experience**: Intuitive navigation with sidebar and product categories
- **Brand Integration**: Animated brand sections and promotional elements

### Backend
- **RESTful API**: Express.js server with MongoDB integration
- **Authentication**: JWT-based authentication with Google OAuth 2.0
- **Payment Processing**: ABA PayWay API integration for secure payments
- **Admin Dashboard**: Complete admin panel for product and order management
- **Real-time Features**: WebSocket support for live updates

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **Animations**: GSAP, Framer Motion, Motion (Lenis)
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **State Management**: React Context, Zustand (planned)

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, Google OAuth 2.0
- **Payments**: ABA PayWay API
- **File Upload**: Multer
- **Validation**: Joi, express-validator

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: MongoDB Atlas
- **Version Control**: Git, GitHub

## 📁 Project Structure

```
femfit_ecommerce/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components
│   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   ├── sections/       # Page sections (Hero, Products, etc.)
│   │   ├── ui/             # Reusable UI components
│   │   └── pages/          # Page components
│   ├── lib/                # Utility functions and configurations
│   ├── public/             # Static assets
│   └── styles/             # Global styles
├── backend/                 # Express.js backend application
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google OAuth 2.0 credentials
- ABA PayWay API credentials

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Seavleu/femfit-online-store.git
cd femfit-online-store
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

3. **Install backend dependencies:**
```bash
cd ../backend
npm install
```

4. **Set up environment variables:**

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Create `.env` in the backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ABA_PAYWAY_API_KEY=your_aba_payway_api_key
ABA_PAYWAY_MERCHANT_ID=your_aba_payway_merchant_id
```

5. **Run the development servers:**

Frontend (Terminal 1):
```bash
cd frontend
npm run dev
```

Backend (Terminal 2):
```bash
cd backend
npm run dev
```

6. **Open your browser:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## 📱 Key Features

### User Features
- Browse products with advanced filtering
- Add to cart and wishlist
- Secure checkout with ABA PayWay
- User authentication with Google OAuth
- Order tracking and history
- Newsletter subscription

### Admin Features
- Product management (CRUD operations)
- Order management and tracking
- User management
- Analytics dashboard
- Inventory management

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run test` - Run tests

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for commit messages

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access and database users
3. Update connection string in backend environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to FEMFIT.

## 📞 Contact

For questions or support, please contact the development team.

---

**FEMFIT** - Elevate Your Style, Enhance Your Performance
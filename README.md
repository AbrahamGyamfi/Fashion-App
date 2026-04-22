# ShopNow Fashion E-Commerce Platform

A modern multi-vendor fashion e-commerce platform with microservices architecture, featuring buyer/vendor/admin roles, fashion learning hub, and real-time product management.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, Axios, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Process Management**: Nodemon

### System Architecture
```
Frontend (React - Port 8080)
    ↓
Backend API (Express - Port 3000)
    ↓
├── PostgreSQL (Port 5432) - Data Persistence
└── Redis (Port 6379) - Caching Layer
```

## 🚀 Features

### User Roles
1. **Admin** - Full platform management
2. **Vendor** - Product management and storefront
3. **Buyer** - Shopping and learning

### Core Features
- ✅ Multi-vendor marketplace
- ✅ User authentication (login/register)
- ✅ Product browsing with filters (category, price, search)
- ✅ Shopping cart (persisted in database)
- ✅ Vendor dashboard for product management
- ✅ Admin panel for platform oversight
- ✅ Fashion Learning Hub (style guides & outfit ideas)
- ✅ Designer profiles with ratings and reviews
- ✅ Redis caching for performance
- ✅ Responsive design

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

## 🛠️ Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Polly_Ochestrator
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Setup PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE shopnow;
CREATE USER admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE shopnow TO admin;
\q
```

### 4. Start Redis
```bash
redis-server
```

### 5. Start Backend (with auto-reload)
```bash
cd backend
npm start
```

Backend runs on: http://localhost:3000

### 6. Start Frontend (with hot-reload)
```bash
cd frontend
npm start
```

Frontend runs on: http://localhost:8080

## 🗄️ Database Schema

### Tables
- `users` - User accounts (admin, vendor, buyer)
- `designers` - Vendor brand profiles
- `products` - Product catalog
- `cart_items` - Shopping cart persistence
- `wishlists` - User wishlists
- `reviews` - Product reviews
- `designer_reviews` - Designer ratings
- `fashion_guides` - Educational content
- `outfit_ideas` - Curated outfit combinations

### Auto-Initialization
- Database automatically initializes on first run
- Seeds sample data (users, products, guides)
- Subsequent runs preserve existing data

## 🔑 Default Credentials

### Admin
- Email: `gyamfiabraham95@gmail.com`
- Password: `hash123`

### Vendors
- Email: `vendor1@example.com` (Urban Threads)
- Email: `vendor2@example.com` (Elegant Designs)
- Email: `vendor3@example.com` (EcoWear)
- Password: `hash123` (all vendors)

### Buyers
- Email: `john@example.com`
- Email: `jane@example.com`
- Email: `bob@example.com`
- Password: `hash123` (all buyers)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List all products (cached)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor/admin)
- `GET /api/products/:id/reviews` - Get product reviews

### Search & Filter
- `GET /api/search?category=&search=&minPrice=&maxPrice=&sortBy=` - Search products (cached)

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/items` - Add to cart
- `PATCH /api/cart/:userId/items/:productId` - Update quantity
- `DELETE /api/cart/:userId/items/:productId` - Remove from cart

### Designers
- `GET /api/designers` - List all designers
- `GET /api/designers/:id` - Get designer profile
- `GET /api/designers/:id/products` - Get designer products
- `GET /api/designers/:id/reviews` - Get designer reviews

### Fashion Learning
- `GET /api/fashion/guides` - Get style guides
- `GET /api/fashion/guides/:id` - Get single guide
- `GET /api/fashion/outfits` - Get outfit ideas
- `GET /api/fashion/outfits/:id` - Get outfit with products
- `POST /api/fashion/guides/:id/like` - Like a guide
- `POST /api/fashion/outfits/:id/like` - Like an outfit

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.js - Navigation header
│   │   ├── ProductCard.js - Product display
│   │   ├── Cart.js - Shopping cart
│   │   ├── AuthModal.js - Login/Register
│   │   ├── LandingPage.js - Landing page
│   │   ├── FashionLearning.js - Learning hub
│   │   ├── VendorDashboard.js - Vendor interface
│   │   └── Sidebar.js - Admin sidebar
│   ├── pages/
│   │   ├── Dashboard.js - Admin dashboard
│   │   ├── Products.js - Admin products
│   │   ├── Designers.js - Admin designers
│   │   ├── Orders.js - Admin orders
│   │   └── Analytics.js - Admin analytics
│   ├── App.js - Main application
│   └── App.css - Global styles
└── public/
```

## 🔧 Backend Structure

```
backend/
├── config/
│   ├── database.js - PostgreSQL connection
│   └── redis.js - Redis client
├── models/
│   └── init.js - Database initialization
├── routes/
│   ├── auth.js - Authentication
│   ├── products.js - Product management
│   ├── search.js - Search & filter
│   ├── cart.js - Shopping cart
│   ├── designers.js - Designer profiles
│   ├── fashion.js - Learning content
│   └── stats.js - Statistics
├── server.js - Main server
├── package.json
└── nodemon.json - Nodemon config
```

## 🚀 Performance Optimizations

### Redis Caching Strategy
- **Product listings**: 60 seconds TTL
- **Search results**: 300 seconds TTL
- **Cart data**: 300 seconds TTL
- **Automatic cache invalidation** on data mutations

### Database Optimizations
- Indexed queries for fast lookups
- JOIN queries to reduce round trips
- Parameterized queries to prevent SQL injection

## 🔒 Security Notes

⚠️ **Current Implementation (Development Only)**
- Passwords stored as plain text (hash123)
- No JWT/session tokens
- No HTTPS
- CORS enabled for all origins

🔐 **Production Requirements**
- Implement bcrypt password hashing
- Add JWT authentication
- Enable HTTPS/SSL
- Configure CORS for specific domains
- Add rate limiting
- Implement input validation
- Add CSRF protection

### Security Scanning

This project uses **triple SAST scanning** for comprehensive security:

1. **GitLeaks** (Secrets Detection - All PRs)
   - Runs on every pull request and push
   - ~10 seconds scan time
   - Detects hardcoded secrets, API keys, passwords
   - Prevents credential leaks

2. **Semgrep** (Fast Security - All PRs)
   - Runs on every pull request
   - ~30 seconds scan time
   - Focuses on security vulnerabilities
   - Blocks PRs with high-severity issues

3. **SonarCloud** (Deep Analysis - dev/stage/main)
   - Runs on push to important branches
   - ~3-5 minutes scan time
   - Security + Code Quality + Coverage
   - Provides detailed metrics and trends
   - Dashboard: https://sonarcloud.io

See [SONARCLOUD_SETUP.md](SONARCLOUD_SETUP.md) for configuration details.

## 📦 Next Steps: Containerization

### Planned Docker Setup
1. **Frontend Container** - Nginx serving React build
2. **Backend Container** - Node.js API server
3. **PostgreSQL Container** - Database
4. **Redis Container** - Cache layer
5. **Docker Compose** - Orchestration

### Environment Variables (To Be Added)
```env
# Database
DATABASE_URL=postgresql://admin:password@postgres:5432/shopnow

# Redis
REDIS_URL=redis://redis:6379

# Backend
PORT=3000
NODE_ENV=production

# Frontend
REACT_APP_API_URL=http://localhost:3000
```

## 🐛 Known Issues

1. No password hashing (security risk)
2. No session persistence (users logout on refresh)
3. No file upload for product images (URLs only)
4. No payment integration
5. No email notifications
6. No order management system

## 📝 Development Notes

- Backend uses **nodemon** for auto-restart on file changes
- Frontend uses **Fast Refresh** for hot module replacement
- Database auto-initializes only once (preserves data)
- Redis used only for caching (PostgreSQL is source of truth)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## 📄 License

MIT

## 👥 Team

- Abraham Gyamfi - Platform Admin

---

**Ready for Containerization** 🐳

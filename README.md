# Stablecoin Comparison Website

A comprehensive website for comparing global stablecoin options and exploring Layer-1 and Layer-2 blockchain solutions focused on stablecoins.

## Features

- **Dynamic Blog System**: In-depth articles about different L1 and L2 blockchain solutions including Ethereum, Solana, Arbitrum, Optimism, Polygon, Base, zkSync, StarkNet, Avalanche, Stellar, and Algorand
- **Admin Dashboard**: Secure admin panel for creating, editing, and publishing blog posts
- **JWT Authentication**: Protected admin routes with token-based authentication
- **Comparison Tool**: Compare major stablecoins including USDT, USDC, DAI, PYUSD, FRAX, and more
- **Filter Options**: Filter stablecoins by type (fiat-backed, crypto-backed, algorithmic)
- **Multiple Views**: Toggle between grid and table views for comparison
- **Responsive Design**: Mobile-friendly layout

## Running the Website

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

```bash
cd stablehub
npm install
```

### Starting the Server

```bash
npm start
```

The server will start on `http://localhost:8000`

### Admin Access

1. Navigate to `http://localhost:8000/admin/login`
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You'll be redirected to the admin dashboard where you can:
   - **Blog Posts**: Create, edit, publish/unpublish, and delete blog posts
   - **Newsletter**: Compose and send newsletters to subscribers
   - **Subscribers**: Manage newsletter subscribers (view, activate/deactivate, delete)

**IMPORTANT**: Change the default admin password in production!

### Newsletter Configuration

The newsletter feature uses Nodemailer for sending emails. Configure SMTP settings via environment variables:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=newsletter@stablehub.com
```

If no SMTP settings are configured, emails will be logged to the console (useful for testing).

## Project Structure

```
stablehub/
├── index.html              # Main blog page (dynamic content)
├── compare.html            # Stablecoin comparison page
├── server.js               # Express server and API routes
├── migrate-posts.js        # Database migration script
├── package.json            # Project metadata and dependencies
├── stablehub.db            # SQLite database (auto-generated)
├── backend/
│   ├── db/
│   │   └── database.js     # Database schema and operations
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   └── blog.js         # Blog CRUD endpoints
│   └── middleware/
│       └── auth.js         # JWT authentication middleware
├── admin/
│   ├── login.html          # Admin login page
│   ├── dashboard.html      # Admin dashboard
│   ├── dashboard.css       # Admin dashboard styles
│   └── dashboard.js        # Admin dashboard logic
├── css/
│   └── style.css           # Main site styling
├── js/
│   └── compare.js          # Comparison page filtering
└── README.md               # This file
```

## Stablecoins Covered

- **Fiat-Backed**: USDT, USDC, FDUSD, PYUSD, TUSD, USDP, GUSD
- **Crypto-Backed**: DAI, LUSD, USDe
- **Algorithmic/Hybrid**: FRAX, USDD

## Blockchain Networks Featured

- **Layer-1**: Ethereum, Solana, Avalanche, Stellar, Algorand
- **Layer-2**: Arbitrum, Optimism, Polygon, Base, zkSync, StarkNet

## API Endpoints

### Public Endpoints

**Blog:**
- `GET /api/blog/posts` - Get all published blog posts
- `GET /api/blog/posts/:id` - Get a specific blog post by ID

**Newsletter:**
- `POST /api/newsletter/subscribe` - Subscribe to newsletter (email, name optional)

### Admin Endpoints (Requires Authentication)

**Authentication:**
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/logout` - Logout and clear token
- `GET /api/auth/verify` - Verify authentication token

**Blog Management:**
- `GET /api/blog/posts/all` - Get all posts (including drafts)
- `POST /api/blog/posts` - Create a new blog post
- `PUT /api/blog/posts/:id` - Update a blog post
- `DELETE /api/blog/posts/:id` - Delete a blog post
- `PATCH /api/blog/posts/:id/status` - Update post status (publish/unpublish)

**Newsletter Management:**
- `GET /api/newsletter/subscribers` - Get all subscribers with stats
- `DELETE /api/newsletter/subscribers/:id` - Delete a subscriber
- `PATCH /api/newsletter/subscribers/:id/toggle` - Activate/deactivate subscriber
- `POST /api/newsletter/send` - Send newsletter (supports test mode)
- `GET /api/newsletter/history` - View sent newsletters

## Security Features

- JWT-based authentication with HTTP-only cookies
- bcrypt password hashing
- Protected admin routes with authentication middleware
- XSS protection with HTML escaping
- CORS configuration for API security

## Database

- SQLite database for lightweight data storage
- Automatic database initialization on first run
- Blog posts with status tracking (draft/published)
- User management for admin authentication

## Educational Purpose

This website is designed for educational and research purposes. It is not financial advice. Always conduct your own research before making investment decisions.

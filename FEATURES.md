# Stablecoin Hub - Feature Documentation

## Overview

This application is a comprehensive stablecoin information and blogging platform built with React + Vite frontend and Node.js + Express backend. It combines the modern React architecture with powerful admin features including authentication, blog publishing, and newsletter management.

## Merged Features

This application now includes all features from both branches:
- **react-app**: Modern React frontend with Vite
- **admin-blog-publishing-auth**: Admin authentication, blog management, and newsletter system

## Key Features

### 1. Public Features
- **Blog System**: Dynamic blog posts about L1/L2 blockchain solutions
- **Stablecoin Comparison**: Interactive comparison tool with filtering
- **Newsletter Subscription**: Public subscription form
- **Responsive Design**: Mobile-friendly across all pages

### 2. Admin Authentication
- **JWT-based Login**: Secure token-based authentication
- **Protected Routes**: Admin endpoints secured with middleware
- **Session Management**: 24-hour session with HTTP-only cookies
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
  - ⚠️ **IMPORTANT**: Change these in production!

### 3. Blog Publishing System
- **Create/Edit Posts**: Rich text editor for blog content
- **Draft/Published States**: Manage post visibility
- **Categories**: Organize posts by Layer-1, Layer-2, DeFi, etc.
- **Full CRUD Operations**: Complete blog management

### 4. Newsletter Management
- **Subscriber Management**: View and manage newsletter subscribers
- **Email Campaigns**: Send newsletters to all active subscribers
- **Test Mode**: Send test emails before mass distribution
- **SMTP Integration**: Configure with any email provider
- **HTML Email Templates**: Professional newsletter formatting

## Project Structure

```
stablecoin-app/
├── src/                          # React frontend
│   ├── components/              # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Subscribe.jsx
│   ├── pages/                   # Page components
│   │   ├── Home.jsx             # Blog listing
│   │   ├── BlogPost.jsx         # Individual post view
│   │   ├── Compare.jsx          # Stablecoin comparison
│   │   ├── AdminLogin.jsx       # Admin login
│   │   └── AdminDashboard.jsx   # Full admin dashboard
│   └── App.jsx                  # Routing
├── server/                      # Backend API
│   ├── api.js                   # Main server file
│   ├── database.js              # Database operations
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   └── routes/
│       ├── auth.js             # Authentication endpoints
│       ├── blog.js             # Blog CRUD endpoints
│       └── newsletter.js       # Newsletter management
├── dist/                        # Production build
└── stablehub.db                # SQLite database (auto-generated)
```

## Database Schema

### users
- id (PRIMARY KEY)
- username (UNIQUE)
- password_hash
- created_at

### blog_posts
- id (PRIMARY KEY)
- title
- category
- content
- author_id (FOREIGN KEY → users.id)
- status ('draft' | 'published')
- date_display
- created_at
- updated_at

### subscribers
- id (PRIMARY KEY)
- email (UNIQUE)
- name
- is_active (0 | 1)
- subscribed_at

### newsletters
- id (PRIMARY KEY)
- subject
- content
- sent_by (FOREIGN KEY → users.id)
- recipients_count
- sent_at

## API Endpoints

### Public Endpoints

**Blog:**
- `GET /api/blog/posts` - Get all published posts
- `GET /api/blog/posts/:id` - Get specific post

**Newsletter:**
- `POST /api/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/subscribe` - Alternative subscription endpoint

### Admin Endpoints (Authentication Required)

**Authentication:**
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

**Blog Management:**
- `GET /api/blog/posts/all` - Get all posts (including drafts)
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/:id` - Update post
- `DELETE /api/blog/posts/:id` - Delete post
- `PATCH /api/blog/posts/:id/status` - Update status

**Newsletter Management:**
- `GET /api/newsletter/subscribers` - Get all subscribers
- `DELETE /api/newsletter/subscribers/:id` - Delete subscriber
- `PATCH /api/newsletter/subscribers/:id/toggle` - Toggle active status
- `POST /api/newsletter/send` - Send newsletter
- `GET /api/newsletter/history` - View sent newsletters

## Routes

### Frontend Routes
- `/` - Homepage with blog listing
- `/blog/:id` - Individual blog post
- `/compare` - Stablecoin comparison tool
- `/admin` - Redirects to `/admin/login`
- `/admin/login` - Admin login page
- `/admin/dashboard` - Full admin dashboard (requires authentication)

## Environment Variables

### Required for Email (Optional for Development)

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=newsletter@stablehub.com

# Alternative naming (also supported)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application
PORT=3001
NODE_ENV=production
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=your-secret-key-change-in-production
```

**Note**: If no SMTP settings are configured, emails will be logged to console (useful for testing).

## Running the Application

### Development Mode
```bash
# Terminal 1: Start backend API
npm run server

# Terminal 2: Start React dev server
npm run dev
```

### Production Mode
```bash
# Build React app
npm run build

# Start production server with PM2
npm run server:prod

# View logs
npm run server:logs

# Restart server
npm run server:restart

# Stop server
npm run server:stop
```

## Admin Dashboard Features

### Dashboard Tabs

**1. Posts**
- View all blog posts (published and drafts)
- Quick publish/unpublish toggle
- Edit and delete posts
- Status indicators

**2. Editor**
- Create new blog posts
- Edit existing posts
- Rich text content support
- Category selection
- Draft/Published status control

**3. Newsletter**
- Compose HTML newsletters
- Send to all active subscribers
- Test mode for email previews
- Email template with branding

**4. Subscribers**
- View all subscribers
- See active/inactive status
- Subscriber count statistics

## Security Features

✅ JWT-based authentication with HTTP-only cookies
✅ bcrypt password hashing (10 rounds)
✅ Protected admin routes with middleware
✅ CORS configuration for API security
✅ Token expiration (24 hours)
✅ XSS protection through React's built-in escaping

## Production Deployment Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET environment variable
- [ ] Configure SMTP settings for email
- [ ] Update APP_URL and FRONTEND_URL
- [ ] Enable HTTPS in production
- [ ] Set up database backups
- [ ] Configure PM2 for process management
- [ ] Set up monitoring and logging
- [ ] Review CORS settings
- [ ] Test all authentication flows

## Troubleshooting

### Database Issues
If you need to reset the database:
```bash
rm server/stablehub.db
npm run server:restart
```
This will recreate the database with the default admin user.

### Email Not Sending
- Check SMTP credentials
- Verify firewall/security settings
- For Gmail, use App Passwords (not regular password)
- Check console logs for email content in development

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token hasn't expired
- Check server logs for authentication errors

## Tech Stack

**Frontend:**
- React 19
- Vite 7
- React Router 7
- TanStack React Query 5
- React Markdown

**Backend:**
- Node.js
- Express 5
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcrypt.js
- Nodemailer
- PM2 (process management)

## Contributing

When adding new features:
1. Update API documentation in this file
2. Test authentication flows
3. Ensure database migrations are handled
4. Update environment variable documentation
5. Test email functionality in both test and production modes

## License

Educational resource for cryptocurrency research.
Not financial advice. Always conduct your own research.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase, subscriberDb } from './database.js';
import { sendBlogPostToSubscribers } from './email.js';
import { getAllBlogPosts, getBlogPostById, getLatestBlogPost } from './blogService.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import newsletterRoutes from './routes/newsletter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database
initDatabase();

// CORS configuration for remote access
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all origins in development, or specific origin in production
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3001'];

    // In production, you might want to be more restrictive
    // For now, allow all origins for remote access
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Serve static files from React app
app.use(express.static(join(__dirname, '../dist')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Legacy subscribe endpoint (kept for backwards compatibility)
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = subscriberDb.create(email);
    if (result === null) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    res.json({
      success: true,
      message: 'Successfully subscribed!',
      id: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Legacy get all subscribers endpoint (kept for backwards compatibility)
app.get('/api/subscribers', (req, res) => {
  try {
    const subscribers = subscriberDb.getAll();
    res.json({ subscribers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// Get all blog posts endpoint
app.get('/api/blog', (req, res) => {
  try {
    const posts = getAllBlogPosts();
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get latest blog post endpoint
app.get('/api/blog/latest', (req, res) => {
  try {
    const post = getLatestBlogPost();
    if (!post) {
      return res.status(404).json({ error: 'No blog posts found' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest blog post' });
  }
});

// Send latest blog post to all subscribers
app.post('/api/send-latest-blog', async (req, res) => {
  try {
    const { blogId } = req.body;

    // Get blog post (either specific ID or latest)
    let blogPost;
    if (blogId) {
      blogPost = getBlogPostById(blogId);
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
    } else {
      blogPost = getLatestBlogPost();
      if (!blogPost) {
        return res.status(404).json({ error: 'No blog posts available' });
      }
    }

    // Get all subscribers
    const subscribers = subscriberDb.getAll();

    if (subscribers.length === 0) {
      return res.json({
        success: true,
        message: 'No subscribers to send to',
        total: 0,
        successful: 0,
        failed: 0
      });
    }

    // Send emails
    const results = await sendBlogPostToSubscribers(subscribers, blogPost);

    res.json({
      success: true,
      message: `Blog post sent to ${results.successful} subscribers`,
      ...results,
      blogPost: {
        id: blogPost.id,
        title: blogPost.title
      }
    });
  } catch (error) {
    console.error('Error sending blog emails:', error);
    res.status(500).json({ error: 'Failed to send blog emails' });
  }
});

// Test email endpoint (for development)
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const blogPost = getLatestBlogPost();
    if (!blogPost) {
      return res.status(404).json({ error: 'No blog posts available' });
    }

    const result = await sendBlogPostToSubscribers([{ email }], blogPost);

    res.json({
      success: true,
      message: 'Test email sent',
      ...result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Fallback route - serve React app for all non-API routes
// This must be AFTER all API routes
app.use((req, res, next) => {
  // If it's not an API route, serve the React app
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT} in ${NODE_ENV} mode`);
  console.log(`Server accessible at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`  - Network: http://37.60.249.62:${PORT}`);
});

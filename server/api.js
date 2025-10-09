import express from 'express';
import cors from 'cors';
import { addSubscriber, getAllSubscribers } from './db.js';
import { sendBlogPostToSubscribers } from './email.js';
import { getAllBlogPosts, getBlogPostById, getLatestBlogPost } from './blogService.js';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = addSubscriber(email);
    res.json({
      success: true,
      message: 'Successfully subscribed!',
      id: result.lastInsertRowid
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Get all subscribers endpoint
app.get('/api/subscribers', (req, res) => {
  try {
    const subscribers = getAllSubscribers();
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
    const subscribers = getAllSubscribers();

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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});

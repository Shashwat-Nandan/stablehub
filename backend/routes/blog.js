const express = require('express');
const { blogDb } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all published blog posts (public)
router.get('/posts', (req, res) => {
  try {
    const posts = blogDb.getAll('published');
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all posts including drafts (admin only)
router.get('/posts/all', authenticateToken, (req, res) => {
  try {
    const posts = blogDb.getAll();
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single post by ID
router.get('/posts/:id', (req, res) => {
  try {
    const post = blogDb.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new blog post (admin only)
router.post('/posts', authenticateToken, (req, res) => {
  try {
    const { title, category, content, status, date_display } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const postId = blogDb.create({
      title,
      category,
      content,
      author_id: req.user.userId,
      status: status || 'draft',
      date_display: date_display || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      postId
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog post (admin only)
router.put('/posts/:id', authenticateToken, (req, res) => {
  try {
    const { title, category, content, status, date_display } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const changes = blogDb.update(req.params.id, {
      title,
      category,
      content,
      status: status || 'draft',
      date_display
    });

    if (changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog post (admin only)
router.delete('/posts/:id', authenticateToken, (req, res) => {
  try {
    const changes = blogDb.delete(req.params.id);

    if (changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Publish/unpublish post (admin only)
router.patch('/posts/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (draft or published) is required' });
    }

    const changes = blogDb.updateStatus(req.params.id, status);

    if (changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      message: `Post ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

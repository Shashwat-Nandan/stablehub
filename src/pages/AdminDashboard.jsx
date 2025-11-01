import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../config';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Helper to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  return response;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('posts');
  const [editingPost, setEditingPost] = useState(null);
  const [postForm, setPostForm] = useState({
    title: '',
    category: '',
    content: '',
    status: 'draft',
    date_display: ''
  });
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    testMode: false,
    testEmail: ''
  });

  // Check authentication
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authFetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      // Ignore errors
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  // Fetch all posts (including drafts)
  const { data: postsData } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/blog/posts/all`);
      return res.json();
    },
  });

  // Fetch subscribers
  const { data: subscribersData } = useQuery({
    queryKey: ['admin-subscribers'],
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/newsletter/subscribers`);
      return res.json();
    },
  });

  // Create/Update post mutation
  const savePostMutation = useMutation({
    mutationFn: async (postData) => {
      const url = editingPost
        ? `${API_URL}/api/blog/posts/${editingPost.id}`
        : `${API_URL}/api/blog/posts`;
      const method = editingPost ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
      setPostForm({ title: '', category: '', content: '', status: 'draft', date_display: '' });
      setEditingPost(null);
      alert(editingPost ? 'Post updated!' : 'Post created!');
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await authFetch(`${API_URL}/api/blog/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
      alert('Post deleted!');
    },
  });

  // Toggle post status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ postId, status }) => {
      const res = await authFetch(`${API_URL}/api/blog/posts/${postId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-posts']);
    },
  });

  // Send newsletter mutation
  const sendNewsletterMutation = useMutation({
    mutationFn: async (newsletterData) => {
      const res = await authFetch(`${API_URL}/api/newsletter/send`, {
        method: 'POST',
        body: JSON.stringify(newsletterData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: (data) => {
      alert(`✅ ${data.message}`);
      setNewsletterForm({ subject: '', content: '', testMode: false, testEmail: '' });
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`);
    },
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    savePostMutation.mutate(postForm);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      category: post.category,
      content: post.content,
      status: post.status,
      date_display: post.date_display || ''
    });
    setActiveTab('editor');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterForm.testMode || newsletterForm.testEmail) {
      sendNewsletterMutation.mutate(newsletterForm);
    }
  };

  const posts = postsData?.posts || [];
  const subscribers = subscribersData?.subscribers || [];
  const activeSubscribers = subscribersData?.activeCount || 0;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
              <span className="user-info">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <div className="container">
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({posts.length})
          </button>
          <button
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => { setActiveTab('editor'); setEditingPost(null); setPostForm({ title: '', category: '', content: '', status: 'draft', date_display: '' }); }}
          >
            {editingPost ? 'Edit Post' : 'New Post'}
          </button>
          <button
            className={`tab ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
          >
            Newsletter
          </button>
          <button
            className={`tab ${activeTab === 'subscribers' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            Subscribers ({activeSubscribers})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="container">
          {activeTab === 'posts' && (
            <div className="posts-list">
              <h2>All Blog Posts</h2>
              {posts.length === 0 ? (
                <p>No posts yet. Create your first post!</p>
              ) : (
                <table className="posts-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.title}</td>
                        <td>{post.category}</td>
                        <td>
                          <span className={`status-badge ${post.status}`}>
                            {post.status}
                          </span>
                        </td>
                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                        <td className="actions">
                          <button onClick={() => handleEditPost(post)} className="btn-small">Edit</button>
                          <button
                            onClick={() => toggleStatusMutation.mutate({
                              postId: post.id,
                              status: post.status === 'published' ? 'draft' : 'published'
                            })}
                            className="btn-small secondary"
                          >
                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this post?')) {
                                deletePostMutation.mutate(post.id);
                              }
                            }}
                            className="btn-small danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="post-editor">
              <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <form onSubmit={handlePostSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Layer-1">Layer-1</option>
                      <option value="Layer-2">Layer-2</option>
                      <option value="DeFi">DeFi</option>
                      <option value="Stablecoins">Stablecoins</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date Display</label>
                    <input
                      type="text"
                      value={postForm.date_display}
                      onChange={(e) => setPostForm({ ...postForm, date_display: e.target.value })}
                      placeholder="e.g., January 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={postForm.status}
                      onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows={15}
                    required
                  />
                  <small>Supports HTML and Markdown</small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={savePostMutation.isPending}>
                    {savePostMutation.isPending ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                  </button>
                  {editingPost && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setPostForm({ title: '', category: '', content: '', status: 'draft', date_display: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="newsletter-section">
              <h2>Send Newsletter</h2>
              <form onSubmit={handleNewsletterSubmit}>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newsletterForm.subject}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content (HTML)</label>
                  <textarea
                    value={newsletterForm.content}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                    rows={12}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newsletterForm.testMode}
                      onChange={(e) => setNewsletterForm({ ...newsletterForm, testMode: e.target.checked })}
                    />
                    {' '}Test Mode (send to test email only)
                  </label>
                </div>

                {newsletterForm.testMode && (
                  <div className="form-group">
                    <label>Test Email</label>
                    <input
                      type="email"
                      value={newsletterForm.testEmail}
                      onChange={(e) => setNewsletterForm({ ...newsletterForm, testEmail: e.target.value })}
                      required={newsletterForm.testMode}
                    />
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={sendNewsletterMutation.isPending}>
                  {sendNewsletterMutation.isPending ? 'Sending...' : `Send to ${newsletterForm.testMode ? 'Test Email' : `${activeSubscribers} Subscribers`}`}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="subscribers-section">
              <h2>Subscribers ({subscribers.length})</h2>
              <p>Active subscribers: {activeSubscribers}</p>
              {subscribers.length === 0 ? (
                <p>No subscribers yet.</p>
              ) : (
                <table className="subscribers-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id}>
                        <td>{sub.email}</td>
                        <td>{sub.name || '-'}</td>
                        <td>
                          <span className={`status-badge ${sub.is_active ? 'published' : 'draft'}`}>
                            {sub.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f7fafc;
        }

        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0;
          font-size: 2rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .user-info {
          font-size: 0.9rem;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .admin-tabs {
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-tabs .container {
          display: flex;
          gap: 0.5rem;
        }

        .tab {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          cursor: pointer;
          font-size: 1rem;
          color: #4a5568;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #667eea;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          font-weight: 600;
        }

        .admin-content {
          padding: 2rem 0;
        }

        .posts-table, .subscribers-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          border-collapse: collapse;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .posts-table th, .subscribers-table th {
          background: #f7fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #2d3748;
        }

        .posts-table td, .subscribers-table td {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.published {
          background: #c6f6d5;
          color: #22543d;
        }

        .status-badge.draft {
          background: #fed7d7;
          color: #742a2a;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: #667eea;
          color: white;
        }

        .btn-small.secondary {
          background: #48bb78;
        }

        .btn-small.danger {
          background: #f56565;
        }

        .post-editor, .newsletter-section, .subscribers-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2d3748;
        }

        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #2d3748;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
        }

        small {
          color: #718096;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .admin-tabs .container {
            overflow-x: auto;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

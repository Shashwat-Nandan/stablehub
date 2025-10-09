import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

const fetchBlogPosts = async () => {
  const response = await fetch('http://localhost:3001/api/blog');
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

const fetchSubscribers = async () => {
  const response = await fetch('http://localhost:3001/api/subscribers');
  if (!response.ok) throw new Error('Failed to fetch subscribers');
  return response.json();
};

const sendBlogEmail = async ({ blogId }) => {
  const response = await fetch('http://localhost:3001/api/send-latest-blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blogId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send email');
  }

  return response.json();
};

const sendTestEmail = async (email) => {
  const response = await fetch('http://localhost:3001/api/test-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send test email');
  }

  return response.json();
};

export default function Admin() {
  const [selectedBlogId, setSelectedBlogId] = useState('');
  const [testEmail, setTestEmail] = useState('');

  const { data: blogData } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts,
  });

  const { data: subscriberData } = useQuery({
    queryKey: ['subscribers'],
    queryFn: fetchSubscribers,
  });

  const sendEmailMutation = useMutation({
    mutationFn: sendBlogEmail,
    onSuccess: (data) => {
      alert(`✅ ${data.message}\nSuccessful: ${data.successful}\nFailed: ${data.failed}`);
      setSelectedBlogId('');
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`);
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: sendTestEmail,
    onSuccess: (data) => {
      alert(`✅ ${data.message}`);
      setTestEmail('');
    },
    onError: (error) => {
      alert(`❌ Error: ${error.message}`);
    },
  });

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to send this blog post to all subscribers?')) {
      sendEmailMutation.mutate({ blogId: selectedBlogId || undefined });
    }
  };

  const handleTestEmail = (e) => {
    e.preventDefault();
    testEmailMutation.mutate(testEmail);
  };

  const posts = blogData?.posts || [];
  const subscribers = subscriberData?.subscribers || [];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>Admin Panel</h2>
          <p>Manage newsletter and blog post emails</p>
        </div>
      </section>

      <section className="admin-section">
        <div className="container">
          <div className="admin-grid">
            {/* Statistics */}
            <div className="admin-card stats-card">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{subscribers.length}</div>
                  <div className="stat-label">Total Subscribers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{posts.length}</div>
                  <div className="stat-label">Blog Posts</div>
                </div>
              </div>
            </div>

            {/* Send Blog Email */}
            <div className="admin-card">
              <h3>Send Blog Post Email</h3>
              <p className="card-description">
                Send a blog post to all {subscribers.length} subscribers
              </p>
              <form onSubmit={handleSendEmail} className="admin-form">
                <div className="form-group">
                  <label htmlFor="blog-select">Select Blog Post</label>
                  <select
                    id="blog-select"
                    value={selectedBlogId}
                    onChange={(e) => setSelectedBlogId(e.target.value)}
                    className="admin-select"
                  >
                    <option value="">Latest Blog Post</option>
                    {posts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="admin-btn primary"
                  disabled={sendEmailMutation.isPending || subscribers.length === 0}
                >
                  {sendEmailMutation.isPending ? 'Sending...' : 'Send to All Subscribers'}
                </button>
                {subscribers.length === 0 && (
                  <p className="warning-text">No subscribers yet</p>
                )}
              </form>
            </div>

            {/* Test Email */}
            <div className="admin-card">
              <h3>Send Test Email</h3>
              <p className="card-description">
                Send a test email with the latest blog post
              </p>
              <form onSubmit={handleTestEmail} className="admin-form">
                <div className="form-group">
                  <label htmlFor="test-email">Email Address</label>
                  <input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="admin-input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="admin-btn secondary"
                  disabled={testEmailMutation.isPending}
                >
                  {testEmailMutation.isPending ? 'Sending...' : 'Send Test Email'}
                </button>
              </form>
            </div>

            {/* Subscribers List */}
            <div className="admin-card full-width">
              <h3>Recent Subscribers</h3>
              <div className="subscribers-list">
                {subscribers.length === 0 ? (
                  <p className="empty-state">No subscribers yet</p>
                ) : (
                  <table className="subscribers-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.slice(0, 10).map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td>{subscriber.email}</td>
                          <td>{new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Email Configuration Note */}
            <div className="admin-card full-width info-card">
              <h3>📧 Email Configuration</h3>
              <p>
                To send emails, set the following environment variables:
              </p>
              <ul className="config-list">
                <li><code>EMAIL_USER</code> - Your email address (e.g., Gmail)</li>
                <li><code>EMAIL_PASS</code> - Your email password or app password</li>
                <li><code>EMAIL_SERVICE</code> - Email service provider (default: gmail)</li>
                <li><code>APP_URL</code> - Your app URL (for links in emails)</li>
              </ul>
              <p className="info-note">
                <strong>Note:</strong> For Gmail, you need to use an{' '}
                <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer">
                  App Password
                </a>{' '}
                instead of your regular password.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

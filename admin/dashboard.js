// State
let currentUser = null;
let allPosts = [];
let currentFilter = 'all';
let editingPostId = null;

// DOM Elements
const postsView = document.getElementById('postsView');
const editorView = document.getElementById('editorView');
const postsContainer = document.getElementById('postsContainer');
const postForm = document.getElementById('postForm');
const logoutBtn = document.getElementById('logoutBtn');
const newPostBtn = document.getElementById('newPostBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadPosts();
    setupEventListeners();
});

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
            window.location.href = '/admin/login';
            return;
        }
        const data = await response.json();
        currentUser = data.user;
        document.getElementById('adminUsername').textContent = currentUser.username;
    } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/admin/login';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });

    // New post button
    newPostBtn.addEventListener('click', () => {
        switchView('new-post');
    });

    // Cancel edit
    cancelEditBtn.addEventListener('click', () => {
        switchView('posts');
        resetForm();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            renderPosts();
        });
    });

    // Post form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.submitter;
        const status = submitBtn.dataset.status;
        await savePost(status);
    });
}

// Switch views
function switchView(view) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === view) {
            item.classList.add('active');
        }
    });

    // Update views
    if (view === 'posts') {
        postsView.classList.add('active');
        editorView.classList.remove('active');
    } else if (view === 'new-post') {
        postsView.classList.remove('active');
        editorView.classList.add('active');
        resetForm();
    }
}

// Load posts
async function loadPosts() {
    try {
        const response = await fetch('/api/blog/posts/all');
        const data = await response.json();
        if (data.success) {
            allPosts = data.posts;
            renderPosts();
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p class="empty-state">Error loading posts</p>';
    }
}

// Render posts
function renderPosts() {
    let filteredPosts = allPosts;

    if (currentFilter !== 'all') {
        filteredPosts = allPosts.filter(post => post.status === currentFilter);
    }

    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p class="empty-state">No posts found</p>';
        return;
    }

    postsContainer.innerHTML = filteredPosts.map(post => `
        <div class="post-card">
            <div class="post-card-header">
                <div class="post-card-title">
                    <h3>${escapeHtml(post.title)}</h3>
                    <div class="post-card-meta">
                        <span class="post-category">${escapeHtml(post.category)}</span>
                        <span>${escapeHtml(post.date_display || 'No date')}</span>
                        <span class="post-status ${post.status}">${post.status}</span>
                    </div>
                </div>
                <div class="post-card-actions">
                    <button class="btn btn-small btn-primary" onclick="editPost(${post.id})">Edit</button>
                    ${post.status === 'draft'
                        ? `<button class="btn btn-small btn-success" onclick="toggleStatus(${post.id}, 'published')">Publish</button>`
                        : `<button class="btn btn-small btn-secondary" onclick="toggleStatus(${post.id}, 'draft')">Unpublish</button>`
                    }
                    <button class="btn btn-small btn-danger" onclick="deletePost(${post.id})">Delete</button>
                </div>
            </div>
            <div class="post-card-content">
                ${escapeHtml(post.content.substring(0, 200))}...
            </div>
        </div>
    `).join('');
}

// Edit post
async function editPost(id) {
    const post = allPosts.find(p => p.id === id);
    if (!post) return;

    editingPostId = id;
    document.getElementById('editorTitle').textContent = 'Edit Blog Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postDate').value = post.date_display || '';
    document.getElementById('postContent').value = post.content;

    switchView('new-post');
}

// Save post
async function savePost(status) {
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const date_display = document.getElementById('postDate').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!title || !category || !content) {
        alert('Please fill in all required fields');
        return;
    }

    const postData = {
        title,
        category,
        content,
        status,
        date_display: date_display || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    try {
        const url = id ? `/api/blog/posts/${id}` : '/api/blog/posts';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (data.success) {
            alert(id ? 'Post updated successfully!' : 'Post created successfully!');
            await loadPosts();
            switchView('posts');
            resetForm();
        } else {
            alert('Error saving post: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Error saving post');
    }
}

// Toggle post status
async function toggleStatus(id, status) {
    if (!confirm(`Are you sure you want to ${status === 'published' ? 'publish' : 'unpublish'} this post?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/blog/posts/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            await loadPosts();
        } else {
            alert('Error updating post status: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating post status');
    }
}

// Delete post
async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/api/blog/posts/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            await loadPosts();
        } else {
            alert('Error deleting post: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
    }
}

// Reset form
function resetForm() {
    editingPostId = null;
    document.getElementById('editorTitle').textContent = 'New Blog Post';
    postForm.reset();
    document.getElementById('postId').value = '';
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== NEWSLETTER FUNCTIONALITY =====

let allSubscribers = [];

// Load subscriber count
async function loadSubscriberCount() {
    try {
        const response = await fetch('/api/newsletter/subscribers');
        const data = await response.json();
        if (data.success) {
            const count = data.activeCount || 0;
            const countElement = document.getElementById('subscriberCount');
            if (countElement) {
                countElement.textContent = count;
            }
        }
    } catch (error) {
        console.error('Error loading subscriber count:', error);
    }
}

// Load all subscribers
async function loadSubscribers() {
    try {
        const response = await fetch('/api/newsletter/subscribers');
        const data = await response.json();

        if (data.success) {
            allSubscribers = data.subscribers;
            renderSubscribers();

            // Update stats
            document.getElementById('totalSubscribers').textContent = allSubscribers.length;
            document.getElementById('activeSubscribers').textContent = data.activeCount || 0;
        }
    } catch (error) {
        console.error('Error loading subscribers:', error);
        document.getElementById('subscribersContainer').innerHTML = '<p class="empty-state">Error loading subscribers</p>';
    }
}

// Render subscribers
function renderSubscribers() {
    const container = document.getElementById('subscribersContainer');

    if (allSubscribers.length === 0) {
        container.innerHTML = '<p class="empty-state">No subscribers yet</p>';
        return;
    }

    container.innerHTML = allSubscribers.map(sub => `
        <div class="subscriber-item">
            <div class="subscriber-info">
                <div class="subscriber-email">${escapeHtml(sub.email)}</div>
                ${sub.name ? `<div class="subscriber-name">${escapeHtml(sub.name)}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center;">
                <span class="subscriber-date">${new Date(sub.subscribed_at).toLocaleDateString()}</span>
                <span class="subscriber-status ${sub.is_active ? 'active' : 'inactive'}">
                    ${sub.is_active ? 'Active' : 'Inactive'}
                </span>
                <div class="subscriber-actions">
                    <button class="btn btn-small btn-secondary" onclick="toggleSubscriber(${sub.id}, ${!sub.is_active})">
                        ${sub.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteSubscriber(${sub.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle subscriber status
async function toggleSubscriber(id, isActive) {
    try {
        const response = await fetch(`/api/newsletter/subscribers/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive })
        });

        const data = await response.json();
        if (data.success) {
            await loadSubscribers();
        } else {
            alert('Error updating subscriber: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error toggling subscriber:', error);
        alert('Error updating subscriber');
    }
}

// Delete subscriber
async function deleteSubscriber(id) {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
        return;
    }

    try {
        const response = await fetch(`/api/newsletter/subscribers/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
            await loadSubscribers();
        } else {
            alert('Error deleting subscriber: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Error deleting subscriber');
    }
}

// Send newsletter
async function sendNewsletter(event) {
    event.preventDefault();

    const subject = document.getElementById('newsletterSubject').value.trim();
    const content = document.getElementById('newsletterContent').value.trim();
    const testMode = document.getElementById('testModeCheck').checked;
    const testEmail = document.getElementById('testEmail').value.trim();

    if (!subject || !content) {
        alert('Please fill in all required fields');
        return;
    }

    if (testMode && !testEmail) {
        alert('Please enter a test email address');
        return;
    }

    const confirmMsg = testMode
        ? `Send test newsletter to ${testEmail}?`
        : `Send newsletter to all active subscribers?`;

    if (!confirm(confirmMsg)) {
        return;
    }

    const sendBtn = document.getElementById('sendNewsletterBtn');
    const originalText = sendBtn.textContent;
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
        const response = await fetch('/api/newsletter/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject,
                content,
                testMode,
                testEmail: testMode ? testEmail : null
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            document.getElementById('newsletterForm').reset();
            document.getElementById('testEmailGroup').style.display = 'none';
        } else {
            alert('Error sending newsletter: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error sending newsletter:', error);
        alert('Error sending newsletter');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = originalText;
    }
}

// Preview newsletter
function previewNewsletter() {
    const subject = document.getElementById('newsletterSubject').value.trim();
    const content = document.getElementById('newsletterContent').value.trim();

    if (!subject || !content) {
        alert('Please enter subject and content first');
        return;
    }

    const modal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');

    previewContent.innerHTML = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">StableHub Newsletter</h1>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
                <h2 style="color: #333;">${escapeHtml(subject)}</h2>
                <div>${content}</div>
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
                <p>You're receiving this email because you subscribed to StableHub newsletter.</p>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Setup newsletter event listeners
function setupNewsletterListeners() {
    // Test mode checkbox
    const testModeCheck = document.getElementById('testModeCheck');
    if (testModeCheck) {
        testModeCheck.addEventListener('change', (e) => {
            document.getElementById('testEmailGroup').style.display = e.target.checked ? 'block' : 'none';
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', sendNewsletter);
    }

    // Preview button
    const previewBtn = document.getElementById('previewNewsletterBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', previewNewsletter);
    }

    // Modal close
    const modal = document.getElementById('previewModal');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Update switchView to handle newsletter views
const originalSwitchView = switchView;
switchView = function(view) {
    originalSwitchView(view);

    // Load data when switching to newsletter/subscriber views
    if (view === 'newsletter') {
        loadSubscriberCount();
    } else if (view === 'subscribers') {
        loadSubscribers();
    }
};

// Initialize newsletter features
document.addEventListener('DOMContentLoaded', () => {
    setupNewsletterListeners();
});

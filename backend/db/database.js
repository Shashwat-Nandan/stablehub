const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../../stablehub.db');
const db = new Database(dbPath);

// Initialize database and create tables
function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create blog_posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'draft',
      date_display TEXT,
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);

  // Create subscribers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Create newsletters table
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_by INTEGER NOT NULL,
      recipients_count INTEGER DEFAULT 0,
      FOREIGN KEY (sent_by) REFERENCES users (id)
    )
  `);

  // Create default admin user if not exists (username: admin, password: admin123)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Default admin user created (username: admin, password: admin123)');
  }

  console.log('Database initialized successfully');
}

// User operations
const userDb = {
  findByUsername: (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  create: (username, password_hash) => {
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, password_hash);
    return result.lastInsertRowid;
  }
};

// Blog post operations
const blogDb = {
  getAll: (status = null) => {
    if (status) {
      return db.prepare('SELECT * FROM blog_posts WHERE status = ? ORDER BY created_at DESC').all(status);
    }
    return db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  },

  getById: (id) => {
    return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
  },

  create: (post) => {
    const { title, category, content, author_id, status, date_display } = post;
    const result = db.prepare(
      'INSERT INTO blog_posts (title, category, content, author_id, status, date_display) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(title, category, content, author_id, status || 'draft', date_display);
    return result.lastInsertRowid;
  },

  update: (id, post) => {
    const { title, category, content, status, date_display } = post;
    const result = db.prepare(
      'UPDATE blog_posts SET title = ?, category = ?, content = ?, status = ?, date_display = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(title, category, content, status, date_display, id);
    return result.changes;
  },

  delete: (id) => {
    const result = db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    return result.changes;
  },

  updateStatus: (id, status) => {
    const result = db.prepare('UPDATE blog_posts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    return result.changes;
  }
};

// Subscriber operations
const subscriberDb = {
  getAll: () => {
    return db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC').all();
  },

  getActive: () => {
    return db.prepare('SELECT * FROM subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC').all();
  },

  getById: (id) => {
    return db.prepare('SELECT * FROM subscribers WHERE id = ?').get(id);
  },

  findByEmail: (email) => {
    return db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email);
  },

  create: (email, name = null) => {
    try {
      const result = db.prepare('INSERT INTO subscribers (email, name) VALUES (?, ?)').run(email, name);
      return result.lastInsertRowid;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return null; // Email already exists
      }
      throw error;
    }
  },

  delete: (id) => {
    const result = db.prepare('DELETE FROM subscribers WHERE id = ?').run(id);
    return result.changes;
  },

  toggleActive: (id, isActive) => {
    const result = db.prepare('UPDATE subscribers SET is_active = ? WHERE id = ?').run(isActive, id);
    return result.changes;
  },

  getCount: () => {
    return db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE is_active = 1').get().count;
  }
};

// Newsletter operations
const newsletterDb = {
  getAll: () => {
    return db.prepare('SELECT * FROM newsletters ORDER BY sent_at DESC').all();
  },

  create: (subject, content, sentBy, recipientsCount) => {
    const result = db.prepare(
      'INSERT INTO newsletters (subject, content, sent_by, recipients_count) VALUES (?, ?, ?, ?)'
    ).run(subject, content, sentBy, recipientsCount);
    return result.lastInsertRowid;
  },

  getById: (id) => {
    return db.prepare('SELECT * FROM newsletters WHERE id = ?').get(id);
  }
};

module.exports = {
  initDatabase,
  userDb,
  blogDb,
  subscriberDb,
  newsletterDb
};

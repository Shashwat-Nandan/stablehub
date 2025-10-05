import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'subscribers.db'));

// Create subscribers table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const addSubscriber = (email) => {
  const insert = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
  return insert.run(email);
};

export const getAllSubscribers = () => {
  const select = db.prepare('SELECT * FROM subscribers ORDER BY subscribed_at DESC');
  return select.all();
};

export default db;

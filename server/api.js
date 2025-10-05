import express from 'express';
import cors from 'cors';
import { addSubscriber, getAllSubscribers } from './db.js';

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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});

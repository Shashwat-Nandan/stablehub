const express = require('express');
const nodemailer = require('nodemailer');
const { subscriberDb, newsletterDb } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create email transporter (configure with your email settings)
// For testing, you can use a service like Ethereal Email or Gmail
function createTransporter() {
  // Default to console logging if no SMTP configured
  if (!process.env.SMTP_HOST) {
    console.log('⚠️  No SMTP configuration found. Emails will be logged to console.');
    return nodemailer.createTransport({
      jsonTransport: true
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Public: Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const subscriberId = subscriberDb.create(email, name);

    if (subscriberId === null) {
      return res.status(400).json({ error: 'This email is already subscribed' });
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all subscribers
router.get('/subscribers', authenticateToken, (req, res) => {
  try {
    const subscribers = subscriberDb.getAll();
    const activeCount = subscriberDb.getCount();

    res.json({
      success: true,
      subscribers,
      activeCount
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete subscriber
router.delete('/subscribers/:id', authenticateToken, (req, res) => {
  try {
    const changes = subscriberDb.delete(req.params.id);

    if (changes === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Toggle subscriber active status
router.patch('/subscribers/:id/toggle', authenticateToken, (req, res) => {
  try {
    const { isActive } = req.body;
    const changes = subscriberDb.toggleActive(req.params.id, isActive ? 1 : 0);

    if (changes === 0) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.json({
      success: true,
      message: `Subscriber ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling subscriber:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Send newsletter
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { subject, content, testMode, testEmail } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    const transporter = createTransporter();
    let recipients;
    let recipientsCount = 0;

    if (testMode && testEmail) {
      // Send test email
      recipients = [{ email: testEmail, name: 'Test User' }];
    } else {
      // Send to all active subscribers
      recipients = subscriberDb.getActive();
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No active subscribers found' });
    }

    // Send emails
    const emailPromises = recipients.map(subscriber => {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'newsletter@stablehub.com',
        to: subscriber.email,
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f8fafc; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
              a { color: #2563eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>StableHub Newsletter</h1>
              </div>
              <div class="content">
                ${content}
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to StableHub newsletter.</p>
                <p><a href="#">Unsubscribe</a> | <a href="http://localhost:8000">Visit Website</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      return transporter.sendMail(mailOptions)
        .then(() => {
          recipientsCount++;
          return true;
        })
        .catch(err => {
          console.error(`Failed to send email to ${subscriber.email}:`, err);
          return false;
        });
    });

    await Promise.all(emailPromises);

    // Save newsletter to database (only if not test mode)
    if (!testMode) {
      newsletterDb.create(subject, content, req.user.userId, recipientsCount);
    }

    // Log if using console transport
    if (!process.env.SMTP_HOST) {
      console.log('\n📧 Newsletter Email (Console Mode):');
      console.log('Subject:', subject);
      console.log('Recipients:', recipients.map(r => r.email).join(', '));
      console.log('Content:', content);
      console.log('\n');
    }

    res.json({
      success: true,
      message: testMode
        ? `Test newsletter sent to ${testEmail}`
        : `Newsletter sent to ${recipientsCount} subscribers`,
      recipientsCount,
      testMode
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});

// Admin: Get newsletter history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const newsletters = newsletterDb.getAll();
    res.json({
      success: true,
      newsletters
    });
  } catch (error) {
    console.error('Error fetching newsletter history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

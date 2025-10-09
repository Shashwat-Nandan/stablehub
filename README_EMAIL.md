# Email Feature Documentation

## Overview

This feature allows you to send blog posts to all subscribers via email. The system includes:

- Email templates with beautiful HTML design
- Admin panel for sending emails
- Test email functionality
- API endpoints for programmatic access

## Setup

### 1. Install Dependencies

Already installed: `nodemailer`

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
APP_URL=http://localhost:5173
```

**Important for Gmail Users:**
- You must use an [App Password](https://myaccount.google.com/apppasswords), not your regular Gmail password
- Enable 2-factor authentication first
- Generate an App Password for "Mail"
- Use this 16-character password in `EMAIL_PASS`

### 3. Start the Server

```bash
npm run server
```

The server will run on `http://localhost:3001`

## Using the Admin Panel

1. Navigate to `http://localhost:5173/admin`
2. You'll see:
   - **Statistics**: Total subscribers and blog posts
   - **Send Blog Post Email**: Send to all subscribers
   - **Send Test Email**: Test the email with a single address
   - **Recent Subscribers**: View subscriber list

### Sending Blog Posts

1. Select a blog post from the dropdown (or leave blank for latest)
2. Click "Send to All Subscribers"
3. Confirm the action
4. Wait for confirmation with success/failure counts

### Testing Emails

1. Enter your email address
2. Click "Send Test Email"
3. Check your inbox for the latest blog post

## API Endpoints

### Send Latest Blog Post

**POST** `/api/send-latest-blog`

```json
{
  "blogId": "optional-blog-id" // Leave empty for latest post
}
```

**Response:**

```json
{
  "success": true,
  "message": "Blog post sent to 10 subscribers",
  "total": 10,
  "successful": 10,
  "failed": 0,
  "blogPost": {
    "id": "ethereum-defi-stablecoins",
    "title": "Ethereum: The Foundation of DeFi Stablecoins"
  }
}
```

### Send Test Email

**POST** `/api/test-email`

```json
{
  "email": "test@example.com"
}
```

### Get All Blog Posts

**GET** `/api/blog`

### Get Latest Blog Post

**GET** `/api/blog/latest`

### Get All Subscribers

**GET** `/api/subscribers`

## Email Template

The email template includes:

- Beautiful gradient header with StablecoinHub branding
- Blog post category badge
- Full blog content with formatted HTML
- "Read Full Article" CTA button
- Unsubscribe link (placeholder)
- Mobile-responsive design

## Programmatic Usage

### Using cURL

Send latest blog post:

```bash
curl -X POST http://localhost:3001/api/send-latest-blog \
  -H "Content-Type: application/json" \
  -d '{}'
```

Send specific blog post:

```bash
curl -X POST http://localhost:3001/api/send-latest-blog \
  -H "Content-Type: application/json" \
  -d '{"blogId": "ethereum-defi-stablecoins"}'
```

Send test email:

```bash
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### Using JavaScript/Node.js

```javascript
const sendBlogPost = async (blogId = null) => {
  const response = await fetch('http://localhost:3001/api/send-latest-blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blogId }),
  });

  const result = await response.json();
  console.log(result);
};

// Send latest blog post
await sendBlogPost();

// Send specific blog post
await sendBlogPost('ethereum-defi-stablecoins');
```

## Troubleshooting

### Emails Not Sending

1. **Check environment variables**: Ensure `EMAIL_USER` and `EMAIL_PASS` are set
2. **Gmail App Password**: Use App Password, not regular password
3. **Check server logs**: Look for error messages in the console
4. **Try test email**: Use the test email feature to debug

### Email Goes to Spam

1. Add proper SPF/DKIM records (for production)
2. Use a verified domain email
3. Consider using a dedicated email service (SendGrid, Mailgun, etc.)

### No Subscribers

The system will handle this gracefully and return:

```json
{
  "success": true,
  "message": "No subscribers to send to",
  "total": 0
}
```

## Production Deployment

For production:

1. Use environment variables (not `.env` file)
2. Consider using a dedicated email service (SendGrid, AWS SES, etc.)
3. Implement rate limiting
4. Add proper error handling and logging
5. Implement unsubscribe functionality
6. Add email analytics/tracking
7. Use a queue system for large subscriber lists (Bull, RabbitMQ, etc.)

## Alternative Email Services

To use SendGrid, Mailgun, or other services, modify `server/email.js`:

```javascript
// Example: SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## Security Notes

- Never commit `.env` file to git
- Use App Passwords for Gmail
- Implement authentication for the admin panel in production
- Add CORS restrictions in production
- Validate email addresses before sending
- Implement rate limiting to prevent abuse

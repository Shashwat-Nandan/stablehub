import nodemailer from 'nodemailer';

// Create transporter with Gmail or custom SMTP
// For production, use environment variables
const createTransporter = () => {
  // Check if email credentials are configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // For Gmail, use App Password
      },
    });
  }

  // For development/testing, create a test account
  return null;
};

// Create email HTML template
const createBlogEmailHTML = (blogPost) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${blogPost.title}</title>
  <style>
    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fafafa;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #8B7BFF 0%, #C4BFFF 100%);
      color: white;
      padding: 30px;
      border-radius: 12px 12px 0 0;
      margin: -30px -30px 30px -30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 700;
    }
    .category {
      display: inline-block;
      background: rgba(255, 255, 255, 0.3);
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .content {
      color: #1a1a1a;
      margin: 20px 0;
    }
    .content h2 {
      color: #6A52FD;
      font-size: 20px;
      margin-top: 25px;
    }
    .content ul {
      margin: 15px 0;
      padding-left: 25px;
    }
    .content li {
      margin: 8px 0;
    }
    .cta-button {
      display: inline-block;
      background: #6A52FD;
      color: white;
      padding: 12px 30px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e8e8e8;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
    .unsubscribe {
      color: #999;
      font-size: 12px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 StablecoinHub Newsletter</h1>
      <span class="category">${blogPost.category}</span>
    </div>

    <h2 style="color: #1a1a1a; font-size: 22px;">${blogPost.title}</h2>
    <p style="color: #666; font-size: 14px;">${blogPost.date}</p>

    <div class="content">
      ${blogPost.content}
    </div>

    <center>
      <a href="${process.env.APP_URL || 'http://localhost:5173'}/blog/${blogPost.id}" class="cta-button">
        Read Full Article →
      </a>
    </center>

    <div class="footer">
      <p>You're receiving this because you subscribed to StablecoinHub newsletter.</p>
      <p>Stay ahead in blockchain finance with our weekly insights!</p>
      <p class="unsubscribe">
        <a href="${process.env.APP_URL || 'http://localhost:5173'}/unsubscribe" style="color: #999;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Send email to a single recipient
export const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('Email not configured. Would send email to:', to);
    console.log('Subject:', subject);
    console.log('---');
    return { success: false, message: 'Email service not configured. Set EMAIL_USER and EMAIL_PASS environment variables.' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"StablecoinHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send blog post email to all subscribers
export const sendBlogPostToSubscribers = async (subscribers, blogPost) => {
  const subject = `📰 New Post: ${blogPost.title}`;
  const html = createBlogEmailHTML(blogPost);

  const results = await Promise.allSettled(
    subscribers.map(subscriber =>
      sendEmail(subscriber.email, subject, html)
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  return {
    total: subscribers.length,
    successful,
    failed,
    results
  };
};

// Create email template for blog post
export const createBlogEmail = (blogPost) => {
  return {
    subject: `📰 New Post: ${blogPost.title}`,
    html: createBlogEmailHTML(blogPost)
  };
};

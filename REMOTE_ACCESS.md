# Remote Access Guide

## Server Information

**Server IP**: `37.60.249.62`
**Port**: `3001`
**Status**: ✅ Online and accessible remotely

## Access URLs

### Frontend Application
```
http://37.60.249.62:3001
```
✅ **WORKING** - React app is now serving correctly!

### Admin Panel
```
Login: http://37.60.249.62:3001/admin/login
Dashboard: http://37.60.249.62:3001/admin/dashboard
```
✅ **WORKING** - All routes accessible via browser

**Default Credentials:**
- Username: `admin`
- Password: `admin123`
- ⚠️ **IMPORTANT**: Change these credentials in production!

### API Endpoints

**Base URL**: `http://37.60.249.62:3001/api`

#### Public Endpoints
- `GET /api/blog/posts` - Get all published blog posts
- `GET /api/blog/posts/:id` - Get specific blog post
- `POST /api/subscribe` - Subscribe to newsletter

#### Admin Endpoints (require authentication)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token
- `GET /api/blog/posts/all` - Get all posts (including drafts)
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/:id` - Update post
- `DELETE /api/blog/posts/:id` - Delete post
- `PATCH /api/blog/posts/:id/status` - Update post status
- `GET /api/newsletter/subscribers` - Get all subscribers
- `POST /api/newsletter/send` - Send newsletter

## Testing Remote Access

### Test API Connection
```bash
curl http://37.60.249.62:3001/api/blog/posts
```

### Test Authentication
```bash
curl -X POST http://37.60.249.62:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test with Authentication Token
```bash
# First, get the token from login response
TOKEN="your-jwt-token-here"

# Then use it in requests
curl -X GET http://37.60.249.62:3001/api/blog/posts/all \
  -H "Authorization: Bearer $TOKEN"
```

## Configuration Details

### Server Configuration
- **Listening on**: `0.0.0.0:3001` (all network interfaces)
- **CORS**: Enabled for all origins (configured for remote access)
- **Firewall**: Inactive (no restrictions)

### Network Configuration
- **IPv4**: `37.60.249.62`
- **IPv6**: `2a02:c207:2284:74::1`

### Frontend Configuration
The React application automatically uses the server IP in production mode:
- **Development**: `http://localhost:3001`
- **Production**: `http://37.60.249.62:3001`

This is configured in `src/config.js`

## Security Considerations

### Current Security Status
✅ JWT authentication with 24-hour expiration
✅ bcrypt password hashing
✅ HTTP-only cookies
✅ Protected admin routes
⚠️ HTTP only (no HTTPS)
⚠️ CORS allows all origins
⚠️ Default credentials in use

### Recommended Security Enhancements

1. **Enable HTTPS**
   - Install SSL certificate (Let's Encrypt)
   - Configure nginx reverse proxy
   - Update URLs to use HTTPS

2. **Restrict CORS**
   - Set specific allowed origins
   - Update `server/api.js` CORS configuration

3. **Change Default Credentials**
   - Login to admin panel
   - Create new admin user
   - Delete default admin

4. **Add Rate Limiting**
   - Install express-rate-limit
   - Protect login endpoint from brute force

5. **Enable Firewall**
   - Configure UFW
   - Allow only necessary ports (22, 80, 443, 3001)

6. **Environment Variables**
   - Set strong JWT_SECRET
   - Configure production database
   - Set up email SMTP credentials

## Accessing from Different Devices

### From Browser
Simply navigate to:
```
http://37.60.249.62:3001
```

### From Mobile Device
Use the same URL in your mobile browser:
```
http://37.60.249.62:3001
```

### From Another Computer
Access via the public IP:
```
http://37.60.249.62:3001
```

### API Integration
Use the base URL in your applications:
```javascript
const API_URL = 'http://37.60.249.62:3001/api';

// Example: Login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Troubleshooting

### Cannot Access Remotely
1. **Check server is running**
   ```bash
   pm2 status
   ```

2. **Check server logs**
   ```bash
   pm2 logs stablecoin-api
   ```

3. **Verify server is listening on 0.0.0.0**
   ```bash
   netstat -tuln | grep 3001
   ```

4. **Test local connectivity**
   ```bash
   curl http://localhost:3001/api/blog/posts
   ```

### CORS Errors
If you see CORS errors in the browser:
1. Verify CORS is enabled in `server/api.js`
2. Check browser console for specific error
3. Ensure credentials: true is set if using cookies

### Authentication Issues
1. **Check JWT token is valid**
   - Tokens expire after 24 hours
   - Clear browser localStorage and login again

2. **Verify credentials**
   - Default: admin / admin123
   - Check database for user accounts

3. **Check authorization header**
   - Format: `Authorization: Bearer <token>`
   - Or use HTTP-only cookies

## Monitoring

### Server Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs stablecoin-api
```

### Check Resource Usage
```bash
pm2 monit
```

### Restart Server
```bash
npm run server:restart
```

### Stop Server
```bash
npm run server:stop
```

## Production Deployment Checklist

When deploying for production use:

- [ ] Enable HTTPS with SSL certificate
- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET in environment
- [ ] Configure specific CORS allowed origins
- [ ] Enable rate limiting on API endpoints
- [ ] Set up firewall rules (UFW)
- [ ] Configure environment variables
- [ ] Set up automated backups for database
- [ ] Configure logging and monitoring
- [ ] Set up process monitoring (already using PM2)
- [ ] Configure email SMTP for newsletters
- [ ] Test all endpoints with production data
- [ ] Set up domain name (optional)
- [ ] Configure nginx reverse proxy (recommended)

## Support

For issues or questions:
1. Check server logs: `pm2 logs stablecoin-api`
2. Review error logs: `cat logs/api-error.log`
3. Verify configuration in `server/api.js`
4. Test endpoints with curl commands above

---

**Last Updated**: 2025-11-01
**Server Version**: 1.0.0
**Status**: Production Ready for Remote Access ✅

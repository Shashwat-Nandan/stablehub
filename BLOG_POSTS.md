# Placeholder Blog Posts

## Created Blog Posts

4 placeholder blog posts have been created in the database with professional content and title images from Unsplash.

### 1. Understanding Stablecoins: A Complete Guide
- **Category**: Stablecoins
- **Date**: November 2025
- **Image**: https://images.unsplash.com/photo-1621761191319-c6fb62004040
- **Topics**: What are stablecoins, types (fiat-backed, crypto-backed, algorithmic), popular options (USDT, USDC, DAI)

### 2. Ethereum Layer-2 Solutions: Scaling the Future
- **Category**: Layer-2
- **Date**: November 2025
- **Image**: https://images.unsplash.com/photo-1639762681485-074b7f938ba0
- **Topics**: Arbitrum, Optimism, Polygon, zkSync, benefits of L2 solutions, stablecoins on L2

### 3. Solana: High-Performance Blockchain for Stablecoins
- **Category**: Layer-1
- **Date**: October 2025
- **Image**: https://images.unsplash.com/photo-1620321023374-d1a68fbc720d
- **Topics**: Solana architecture, speed & scalability, low costs, USDC/USDT on Solana, DeFi ecosystem

### 4. DeFi Lending: Earning Yield with Stablecoins
- **Category**: DeFi
- **Date**: November 2025
- **Image**: https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3
- **Topics**: DeFi lending protocols (Aave, Compound, MakerDAO), earning strategies, risk considerations, best practices

## Accessing the Blog Posts

**Frontend**:
- Homepage: http://37.60.249.62:3001
- Individual posts: http://37.60.249.62:3001/blog/1 (or 2, 3, 4)

**Admin Dashboard**:
- View all posts: http://37.60.249.62:3001/admin/dashboard
- Edit posts: Click "Edit" button on any post
- Create new posts: Click "New Post" tab

## Managing Blog Posts

### Via Admin Dashboard

1. **Login**: http://37.60.249.62:3001/admin/login
   - Username: admin
   - Password: admin123

2. **View Posts**: Navigate to "Posts" tab
   - See all published and draft posts
   - View creation dates and categories

3. **Edit Posts**: Click "Edit" on any post
   - Modify title, category, content
   - Change date display
   - Toggle between draft/published

4. **Create New Posts**: Click "New Post" tab
   - Add title and category
   - Write HTML content (supports images)
   - Choose draft or published status

### Content Format

Blog posts support HTML content. Each post includes:
- Title image at the top
- Structured headings (H2, H3, H4)
- Paragraphs and lists
- Inline styling for images

Example image code:
```html
<div style="margin-bottom: 2rem;">
  <img src="https://images.unsplash.com/photo-id?w=1200&h=600&fit=crop"
       alt="Description"
       style="width: 100%; border-radius: 8px; margin-bottom: 1.5rem;" />
</div>
```

## Categories Used

- **Stablecoins** - General stablecoin topics
- **Layer-1** - L1 blockchain platforms (Ethereum, Solana, etc.)
- **Layer-2** - Scaling solutions (Arbitrum, Optimism, Polygon, zkSync)
- **DeFi** - Decentralized finance applications
- **Technology** - Technical topics

## Image Sources

All images are from Unsplash (free to use):
- High-quality professional photos
- Cryptocurrency and technology themes
- Properly sized (1200x600) for blog headers

## Next Steps

You can:
1. Edit the placeholder content to match your specific needs
2. Add more blog posts through the admin dashboard
3. Change the title images to different Unsplash photos
4. Modify categories to match your content strategy
5. Update the date displays as needed

## Database Location

Blog posts are stored in: `/root/stablecoin-app/server/stablehub.db`

To backup your blog posts:
```bash
cp server/stablehub.db server/stablehub.db.backup
```

## API Access

Get all published posts:
```bash
curl http://37.60.249.62:3001/api/blog/posts
```

Get specific post:
```bash
curl http://37.60.249.62:3001/api/blog/posts/1
```

Get all posts (admin only - requires authentication):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://37.60.249.62:3001/api/blog/posts/all
```

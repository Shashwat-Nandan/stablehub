# Stablecoin Hub - React Application

Modern stablecoin information website built with React + Vite.

## Features

- 🚀 Fast development with Vite
- ⚛️ React 18 with React Router
- 📝 Blog system with individual post pages
- 💰 Stablecoin comparison tool with filtering
- 📱 Fully responsive design
- 🎨 Modern UI with gradient effects

## Requirements

- Node.js 20.19+ or 22.12+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
stablecoin-app/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Header.jsx   # Navigation header
│   │   ├── Footer.jsx   # Site footer
│   │   └── Subscribe.jsx # Newsletter subscription
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Homepage with blog listing
│   │   ├── BlogPost.jsx # Individual blog post page
│   │   └── Compare.jsx  # Stablecoin comparison page
│   ├── data/            # Data files
│   │   ├── blogPosts.js # Blog post content
│   │   └── stablecoins.js # Stablecoin data
│   ├── App.jsx          # Main app with routing
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json
```

## Adding New Blog Posts

To add a new blog post:

1. Open `src/data/blogPosts.js`
2. Add a new object to the `blogPosts` array:

```javascript
{
  id: 'your-blog-slug',
  title: 'Your Blog Title',
  category: 'Layer-1', // or Layer-2, Emerging Tech, etc.
  date: 'Month Year',
  excerpt: 'Short summary for the blog list...',
  content: {
    intro: 'Opening paragraph...',
    features: [
      'Feature 1',
      'Feature 2',
      // ... more features
    ],
    additional: [
      { label: 'Section Title', text: 'Section content...' }
    ]
  }
}
```

3. The new post will automatically appear on the homepage and be accessible at `/blog/your-blog-slug`

## Adding Stablecoins

To add a new stablecoin to the comparison page:

1. Open `src/data/stablecoins.js`
2. Add a new object to the `stablecoins` array:

```javascript
{
  id: 'coin-id',
  name: 'Coin Name',
  ticker: 'TICKER',
  type: 'fiat', // or 'crypto', 'algorithmic'
  marketCap: '$XB+',
  backing: 'USD Reserves',
  issuer: 'Issuer Name',
  audited: 'Audit Type',
  chains: ['Ethereum', 'Polygon', ...]
}
```

## Available Routes

- `/` - Homepage with blog listing
- `/blog/:id` - Individual blog post pages
- `/compare` - Stablecoin comparison tool

## Development

The app uses:
- **Vite** for blazing fast development and optimized builds
- **React Router** for client-side routing
- **React Hooks** (useState) for state management
- **CSS Variables** for consistent theming

## Deployment

Build the app for production:

```bash
npm run build
```

The built files will be in the `dist/` directory. Deploy to:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`
- GitHub Pages: Configure with vite.config.js base path
- Any static hosting service

## Troubleshooting

**Node version error**: Ensure you're using Node.js 20.19+ or 22.12+
```bash
node --version
```

If you need to upgrade Node.js:
- Use nvm: `nvm install 20 && nvm use 20`
- Or download from nodejs.org

## License

Educational resource for cryptocurrency research.
Not financial advice. Always conduct your own research.

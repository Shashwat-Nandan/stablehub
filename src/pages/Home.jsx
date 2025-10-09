import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Subscribe from '../components/Subscribe';

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      const blogIds = [
        'ethereum-defi-stablecoins',
        'arbitrum-optimism-scaling',
        'polygon-traditional-finance',
        'solana-high-performance',
        'base-coinbase-onchain',
        'avalanche-subnet-architecture',
        'zksync-starknet-privacy',
        'stellar-algorand-digital-assets',
        'cross-chain-interoperability'
      ];

      const posts = await Promise.all(
        blogIds.map(async (id) => {
          try {
            const response = await fetch(`/src/content/blog/${id}.md`);
            const text = await response.text();

            // Parse frontmatter
            const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
            const match = text.match(frontmatterRegex);

            if (match) {
              const frontmatter = {};
              const lines = match[1].split('\n');
              lines.forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                  frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
                }
              });

              return frontmatter;
            }
          } catch (error) {
            console.error(`Error loading post ${id}:`, error);
          }
          return null;
        })
      );

      setBlogPosts(posts.filter(Boolean));
    };

    loadBlogPosts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>Making Blockchain Finance Simple</h2>
          <p>Your daily dose of stablecoin insights and L1/L2 blockchain news</p>
        </div>
      </section>

      <Subscribe />

      <section className="blog-section">
        <div className="container">
          <div className="blog-list">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="blog-card">
                {post.titleImage && (
                  <div className="blog-card-image">
                    <img src={post.titleImage} alt={post.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <div className="post-header">
                    <span className="category">{post.category}</span>
                    <span className="date">{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <span className="read-more">Read More</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

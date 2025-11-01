import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Subscribe from '../components/Subscribe';
import { API_URL } from '../config';

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog/posts`);
        const data = await response.json();

        if (data.success && data.posts) {
          setBlogPosts(data.posts);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
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
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading blog posts...</p>
          ) : blogPosts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>No blog posts available yet.</p>
          ) : (
            <div className="blog-list">
              {blogPosts.map((post) => {
                // Extract image from content if exists
                const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
                const titleImage = imgMatch ? imgMatch[1] : null;

                // Extract excerpt from content (first paragraph)
                const contentWithoutImg = post.content.replace(/<div[^>]*>[\s\S]*?<\/div>/, '');
                const firstPMatch = contentWithoutImg.match(/<p>(.*?)<\/p>/);
                const excerpt = firstPMatch ? firstPMatch[1].substring(0, 150) + '...' : '';

                return (
                  <Link key={post.id} to={`/blog/${post.id}`} className="blog-card">
                    {titleImage && (
                      <div className="blog-card-image">
                        <img src={titleImage} alt={post.title} />
                      </div>
                    )}
                    <div className="blog-card-content">
                      <div className="post-header">
                        <span className="category">{post.category}</span>
                        <span className="date">{post.date_display || new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p className="blog-excerpt">{excerpt}</p>
                      <span className="read-more">Read More</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

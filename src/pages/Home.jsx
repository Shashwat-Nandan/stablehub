import { Link } from 'react-router-dom';
import Subscribe from '../components/Subscribe';
import { blogPosts } from '../data/blogPosts';

export default function Home() {
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
                <div className="post-header">
                  <span className="category">{post.category}</span>
                  <span className="date">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <span className="read-more">Read More</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

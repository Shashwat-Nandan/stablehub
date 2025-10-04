import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>{post.title}</h2>
          <div className="post-header">
            <span className="category">{post.category}</span>
            <span className="date">{post.date}</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <article className="blog-post">
            <div className="post-content">
              <p>{post.content.intro}</p>

              <p><strong>Key Features:</strong></p>
              <ul>
                {post.content.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              {post.content.additional.map((section, index) => (
                <p key={index}>
                  <strong>{section.label}:</strong> {section.text}
                </p>
              ))}
            </div>
            <div className="post-footer">
              <Link to="/" className="back-link">← Back to Blog</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

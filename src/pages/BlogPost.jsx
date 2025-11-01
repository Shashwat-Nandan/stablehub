import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blog/posts/${id}`);
        const data = await response.json();

        if (data.success && data.post) {
          setPost(data.post);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
            <span className="date">{post.date_display || new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <article className="blog-post">
            <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            <div className="post-footer">
              <Link to="/" className="back-link">← Back to Blog</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
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

          setPost({
            ...frontmatter,
            content: match[2]
          });
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
            <span className="date">{post.date}</span>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <article className="blog-post">
            {post.titleImage && (
              <div className="title-image">
                <img src={post.titleImage} alt={post.title} />
              </div>
            )}
            <div className="post-content">
              <ReactMarkdown>{post.content}</ReactMarkdown>
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

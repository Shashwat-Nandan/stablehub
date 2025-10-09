import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_DIR = join(__dirname, '../src/content/blog');

// Get all blog posts
export const getAllBlogPosts = () => {
  try {
    const files = readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));

    const posts = files.map(filename => {
      const filePath = join(BLOG_DIR, filename);
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        id: data.id || filename.replace('.md', ''),
        title: data.title,
        category: data.category,
        date: data.date,
        excerpt: data.excerpt,
        content: content
      };
    });

    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
};

// Get a single blog post by ID
export const getBlogPostById = (id) => {
  try {
    const filePath = join(BLOG_DIR, `${id}.md`);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      id: data.id || id,
      title: data.title,
      category: data.category,
      date: data.date,
      excerpt: data.excerpt,
      content: content
    };
  } catch (error) {
    console.error(`Error reading blog post ${id}:`, error);
    return null;
  }
};

// Get the latest blog post
export const getLatestBlogPost = () => {
  const posts = getAllBlogPosts();

  if (posts.length === 0) {
    return null;
  }

  // Sort by date (newest first) - assuming date format is consistent
  // For production, you might want to add a timestamp field
  return posts[0]; // For now, return the first post
};

// Parse date from blog post (helper function)
const parseDate = (dateString) => {
  // Handle "October 2025" format
  const monthYear = dateString.match(/(\w+)\s+(\d{4})/);
  if (monthYear) {
    const [, month, year] = monthYear;
    const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
    return new Date(year, monthIndex);
  }
  return new Date(dateString);
};

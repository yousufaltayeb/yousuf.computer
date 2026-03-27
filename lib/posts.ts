import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import toml from 'toml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { Post, PostMeta } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Custom TOML parser that handles dates without times
const parseTomlWithDates = (input: string) => {
  // Replace date values like "2025-11-09" with quoted strings "2025-11-09"
  // so TOML parser doesn't try to parse them as incomplete datetimes
  const processedInput = input.replace(/date\s*=\s*(\d{4}-\d{2}-\d{2})(?!\d)/g, 'date = "$1"');
  const parsed = toml.parse(processedInput);
  return parsed;
};

const matterOptions = {
  delimiters: ['+++', '+++'] as [string, string],
  engines: {
    toml: {
      parse: parseTomlWithDates,
      stringify: () => '',
    },
  },
  language: 'toml',
};

function slugify(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

export async function getAllPostMeta(): Promise<PostMeta[]> {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md') && !file.startsWith('_'));

  const posts: PostMeta[] = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(CONTENT_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent, matterOptions);

      let dateString = '';
      if (data.date) {
        if (typeof data.date === 'string') {
          dateString = data.date;
        } else if (data.date instanceof Date) {
          dateString = data.date.toISOString().split('T')[0];
        } else {
          dateString = String(data.date);
        }
      }

      return {
        title: data.title || 'Untitled',
        date: dateString,
        lang: data.extra?.lang || 'en',
        slug: slugify(file),
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!fs.existsSync(CONTENT_DIR)) {
    return null;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md') && !file.startsWith('_'));

  for (const file of files) {
    if (slugify(file) === slug) {
      const filePath = path.join(CONTENT_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent, matterOptions);

      const html = await markdownToHtml(content);

      let dateString = '';
      if (data.date) {
        if (typeof data.date === 'string') {
          dateString = data.date;
        } else if (data.date instanceof Date) {
          dateString = data.date.toISOString().split('T')[0];
        } else {
          dateString = String(data.date);
        }
      }

      return {
        title: data.title || 'Untitled',
        date: dateString,
        lang: data.extra?.lang || 'en',
        slug,
        html,
      };
    }
  }

  return null;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllPostMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

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
import { Project, Job } from './types';

const WORK_DIR = path.join(process.cwd(), 'content', 'work');
const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

const parseTomlWithDates = (input: string) => {
  const processedInput = input.replace(/date\s*=\s*(\d{4}-\d{2}-\d{2})(?!\d)/g, 'date = "$1"');
  return toml.parse(processedInput);
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

export async function getAllJobs(): Promise<Job[]> {
  if (!fs.existsSync(WORK_DIR)) return [];

  const files = fs.readdirSync(WORK_DIR).filter((f) => f.endsWith('.md'));

  const jobs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(WORK_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent, matterOptions);
      const html = await markdownToHtml(content);

      return {
        id: slugify(file),
        company: data.title || '',
        role: data.role || '',
        period: data.period || '',
        location: data.location,
        description: data.description || `${data.role || 'Work experience'} at ${data.title || ''}`,
        tags: Array.isArray(data.taxonomies?.tags) ? data.taxonomies.tags : [],
        symbol: data.symbol,
        html,
      } as Job;
    })
  );

  return jobs.sort((a, b) => {
    const yearA = parseInt(a.period.match(/\d{4}/)?.[0] || '0');
    const yearB = parseInt(b.period.match(/\d{4}/)?.[0] || '0');
    return yearB - yearA;
  });
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await getAllJobs();
  return jobs.find((j) => j.id === id);
}

export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));

  const projects = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(PROJECTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent, matterOptions);
      const html = await markdownToHtml(content);

      return {
        id: slugify(file),
        title: data.title || '',
        description: data.description || data.title || '',
        tags: Array.isArray(data.taxonomies?.tags) ? data.taxonomies.tags : [],
        symbol: data.symbol,
        year: data.year,
        featured: data.featured || false,
        links:
          data.extra?.github || data.extra?.demo
            ? { github: data.extra?.github, demo: data.extra?.demo }
            : undefined,
        html,
      } as Project;
    })
  );

  return projects.sort((a, b) => (b.year || 0) - (a.year || 0));
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === id);
}

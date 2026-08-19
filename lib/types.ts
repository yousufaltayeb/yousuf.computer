export interface PostMeta {
  title: string;
  description: string;
  date: string;
  updated?: string;
  lang?: string;
  tags: string[];
  readingTimeMinutes: number;
  wordCount: number;
  slug: string;
}

export interface Post extends PostMeta {
  html: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  symbol?: string;
  year?: number;
  featured: boolean;
  links?: {
    github?: string;
    demo?: string;
  };
  html: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  tags: string[];
  symbol?: string;
  html: string;
}

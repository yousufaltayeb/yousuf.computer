export interface PostMeta {
  title: string;
  date: string;
  lang?: string;
  slug: string;
}

export interface Post extends PostMeta {
  html: string;
}

export interface Project {
  id: string;
  title: string;
  symbol?: string;
  year?: number;
  featured: boolean;
  links?: {
    github?: string;
  };
  html: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  period: string;
  symbol?: string;
  html: string;
}

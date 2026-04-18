import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export interface CodeProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  coverImage?: string;
  content: string;
}

export interface FashionArtwork {
  id: string;
  title: string;
  description?: string;
  image: string;
  video: string;
}

export interface FashionCollection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  artworks: FashionArtwork[];
}

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string;
}

export interface MusicData {
  tracks: MusicItem[];
  albums: MusicItem[];
}

// Code 專案讀取
export function getCodeProjects(): CodeProject[] {
  const codeDir = path.join(contentDir, 'code');
  if (!fs.existsSync(codeDir)) return [];
  
  const files = fs.readdirSync(codeDir).filter(f => f.endsWith('.mdx'));
  
  return files.map(filename => {
    const filePath = path.join(codeDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return {
      slug: filename.replace(/\.mdx$/, ''),
      title: data.title || '',
      description: data.description || '',
      tags: data.tags || [],
      githubUrl: data.githubUrl || '',
      coverImage: data.coverImage || '',
      content: '' // 列表頁不需要完整 content，節省效能
    };
  });
}

// 取得單個專案詳細資料
export function getCodeProjectBySlug(slug: string): CodeProject | null {
  const filePath = path.join(contentDir, 'code', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    tags: data.tags || [],
    githubUrl: data.githubUrl || '',
    coverImage: data.coverImage || '',
    content
  };
}

// Fashion 專案讀取 (可基於 JSON 或是圖片路徑)
export function getFashionCollections(): FashionCollection[] {
  const filePath = path.join(contentDir, 'fashion', 'data.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

// Music 音樂排行讀取
export function getMusicCharts(): MusicData {
  const filePath = path.join(contentDir, 'music', 'charts.json');
  if (!fs.existsSync(filePath)) return { tracks: [], albums: [] };
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

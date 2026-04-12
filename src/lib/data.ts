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
  const filePath = path.join(contentDir, 'code', 'data.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
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

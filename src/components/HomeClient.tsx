"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutContainer from '@/components/LayoutContainer';
import ProfileHeader from '@/components/ProfileHeader';
import StickyTabs from '@/components/StickyTabs';
import { CodeProject, FashionCollection, MusicData } from '@/lib/data';

interface HomeClientProps {
  codeProjects: CodeProject[];
  fashionCollections: FashionCollection[];
  musicCharts: MusicData;
}

export default function HomeClient({ codeProjects, fashionCollections, musicCharts }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState('code');

  return (
    <LayoutContainer>
      <header className="w-full">
        <ProfileHeader />
      </header>
      
      <StickyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <section className="max-w-5xl mx-auto py-16 px-6 min-h-[60vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="font-serif text-3xl mb-8 tracking-wide">程式專案 (Code)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {codeProjects.map(project => (
                  <div key={project.slug} className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded hover:shadow-xl dark:hover:shadow-stone-800/30 transition-all duration-300 group">
                    <h3 className="font-serif text-2xl font-semibold mb-2 text-stone-900 dark:text-stone-100">{project.title}</h3>
                    <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium tracking-wide text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide border-b border-stone-300 dark:border-stone-600 hover:border-stone-900 dark:hover:border-stone-200 pb-1 transition-colors"
                      >
                        VIEW ON GITHUB
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'fashion' && (
            <motion.div
              key="fashion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="font-serif text-3xl mb-8 tracking-wide">服裝設計 (Fashion)</h2>
              <div className="flex flex-col gap-16">
                {fashionCollections.map(collection => (
                  <div key={collection.id} className="flex flex-col md:flex-row gap-8 items-center border border-stone-100 dark:border-stone-800 p-4 bg-white dark:bg-stone-900 rounded shadow-sm">
                    {/* 左右分欄: 左側圖片/說明, 右側影片 */}
                    <div className="flex-1 space-y-4 w-full">
                      <h3 className="font-serif text-2xl font-bold">{collection.title}</h3>
                      <p className="text-stone-500 dark:text-stone-400 text-sm">{collection.description}</p>
                      {/* Image Preview */}
                      {collection.images[0] && (
                        <div className="aspect-[4/5] bg-stone-100 dark:bg-stone-800 overflow-hidden rounded relative">
                          <img src={collection.images[0]} alt={collection.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full flex items-center justify-center bg-stone-50 dark:bg-stone-950 rounded overflow-hidden aspect-[4/5]">
                      {collection.video ? (
                        <video 
                          src={collection.video} 
                          className="w-full h-full object-cover"
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                        />
                      ) : (
                        <div className="text-stone-300 dark:text-stone-700 tracking-wider text-sm font-medium">NO VIDEO</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'music' && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h2 className="font-serif text-3xl mb-8 tracking-wide">音樂推薦 (Music)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    Top Tracks 單曲排行
                  </h3>
                  <div className="flex flex-col gap-4">
                    {musicCharts.tracks.map((track, idx) => (
                      <div key={track.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded flex gap-4 items-center shadow-sm hover:shadow-md dark:shadow-stone-900 transition-shadow">
                        <div className="w-6 font-serif italic text-xl text-stone-300 dark:text-stone-600 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="w-12 h-12 shrink-0 bg-stone-200 dark:bg-stone-800 overflow-hidden rounded border border-stone-200 dark:border-stone-700 shadow-sm">
                          <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate">{track.title}</h4>
                          <p className="text-stone-500 dark:text-stone-400 text-sm truncate">{track.artist}</p>
                        </div>
                        <a 
                          href={track.spotifyUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors shrink-0"
                          title="Listen on Spotify"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.299 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.2-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.539-1.56.299z"/></svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                    Top Albums 專輯排行
                  </h3>
                  <div className="flex flex-col gap-4">
                    {musicCharts.albums.map((album, idx) => (
                      <div key={album.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded flex gap-4 items-center shadow-sm hover:shadow-md dark:shadow-stone-900 transition-shadow">
                        <div className="w-6 font-serif italic text-xl text-stone-300 dark:text-stone-600 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="w-12 h-12 shrink-0 bg-stone-200 dark:bg-stone-800 overflow-hidden rounded border border-stone-200 dark:border-stone-700 shadow-sm">
                          <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate">{album.title}</h4>
                          <p className="text-stone-500 dark:text-stone-400 text-sm truncate">{album.artist}</p>
                        </div>
                        <a 
                          href={album.spotifyUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors shrink-0"
                          title="View on Spotify"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.299 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.2-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.539-1.56.299z"/></svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </LayoutContainer>
  );
}

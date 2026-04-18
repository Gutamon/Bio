"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LayoutContainer from '@/components/LayoutContainer';
import ProfileHeader from '@/components/ProfileHeader';
import StickyTabs from '@/components/StickyTabs';
import InteractiveVideo from '@/components/InteractiveVideo';
import { CodeProject, FashionCollection, MusicData } from '@/lib/data';

interface HomeClientProps {
  codeProjects: CodeProject[];
  fashionCollections: FashionCollection[];
  musicCharts: MusicData;
}

export default function HomeClient({ codeProjects, fashionCollections, musicCharts }: HomeClientProps) {
  const [activeTab, setActiveTabState] = useState('code');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState({
    weekly: true,
    top: true
  });

  const toggleSection = (section: 'weekly' | 'top') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const weeklyRecaps = musicCharts.weeklyRecaps && musicCharts.weeklyRecaps.length > 0
    ? musicCharts.weeklyRecaps
    : [
        {
          id: 'week-3',
          week: 'Week 3, April',
          title: 'Spring Vibes & Current Works',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', 
          date: '2026-04-15'
        }
      ];

  const allTags = Array.from(new Set(codeProjects.flatMap(p => p.tags)));
  const filteredProjects = selectedTag 
    ? codeProjects.filter(p => p.tags.includes(selectedTag))
    : codeProjects;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'code' || hash === 'fashion' || hash === 'music') {
      setActiveTabState(hash);
    }
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

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
              <h2 className="font-mono text-3xl mb-8 tracking-wide">程式專案 (Code)</h2>
              
              <div className="flex flex-wrap gap-2 mb-8">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedTag ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                >
                  All
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredProjects.map(project => (
                  <div 
                    key={project.slug} 
                    className="relative block group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded overflow-hidden hover:shadow-xl dark:hover:shadow-stone-800/30 transition-all duration-500 flex flex-col"
                  >
                    {project.coverImage && (
                      <div className="w-full h-48 overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                        <img 
                          src={project.coverImage} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow relative z-20">
                      <h3 className="font-serif text-2xl font-semibold mb-3 text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">{project.title}</h3>
                      <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm leading-relaxed flex-grow">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs font-medium tracking-wide text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 -mx-6 -mb-6 px-6 py-4 border-t border-stone-100 dark:border-stone-800">
                        <Link 
                          href={`/code/${project.slug}`}
                          className="text-sm font-medium tracking-wide text-stone-900 dark:text-stone-100 uppercase flex items-center gap-2 group-hover:gap-3 hover:text-amber-600 dark:hover:text-amber-500 transition-all"
                        >
                          READ MORE <span className="text-lg">→</span>
                        </Link>
                      </div>
                    </div>
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
              <h2 className="font-mono text-3xl mb-8 tracking-wide">服裝設計專題<br></br>(Fashion Projects)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {fashionCollections.map((collection, index) => (
                  <Link 
                    key={collection.id} 
                    href={`/fashion/${index}`} 
                    className="group block relative aspect-square bg-stone-100 dark:bg-stone-800 rounded overflow-hidden shadow-sm hover:shadow-xl dark:shadow-stone-900/50 transition-all"
                  >
                    <img src={collection.coverImage} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="font-serif text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{collection.title}</h3>
                      <p className="text-stone-200 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                  </Link>
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
              <div className="flex flex-col gap-6">
                
                {/* WEEKLY RECAP Section */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden shadow-sm">
                  <button 
                    onClick={() => toggleSection('weekly')}
                    className="w-full px-6 py-5 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <h2 className="font-mono text-2xl tracking-wide m-0 font-bold dark:text-stone-100">WEEKLY RECAP</h2>
                    <motion.div
                      animate={{ rotate: openSections.weekly ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-stone-500"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSections.weekly && (
                      <motion.div
                        key="weekly-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="p-6 border-t border-stone-200 dark:border-stone-800">
                          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {weeklyRecaps.map(recap => {
                              return (
                              <div key={recap.id} className="w-[75vw] sm:w-[320px] shrink-0 snap-center bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-xl dark:shadow-stone-900/50 transition-all border border-stone-200 dark:border-stone-700">
                                <div className="relative aspect-[9/16] overflow-hidden">
                                  <InteractiveVideo src={recap.videoUrl} />
                                </div>
                                <div className="p-5 flex flex-col gap-1.5 bg-white dark:bg-stone-900 flex-1 border-t border-stone-100 dark:border-stone-800">
                                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em]">{recap.week}</span>
                                  <h3 className="font-serif text-lg font-bold dark:text-white leading-tight">{recap.title}</h3>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-auto pt-2">{recap.date}</p>
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2026 TOP UPDATE Section */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden shadow-sm">
                  <button 
                    onClick={() => toggleSection('top')}
                    className="w-full px-6 py-5 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    <h2 className="font-mono text-2xl tracking-wide m-0 font-bold dark:text-stone-100">2026 TOP UPDATE</h2>
                    <motion.div
                      animate={{ rotate: openSections.top ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-stone-500"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSections.top && (
                      <motion.div
                        key="top-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="p-6 border-t border-stone-200 dark:border-stone-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                              <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                                Top Tracks 單曲排行
                              </h3>
                              <div className="flex flex-col gap-4">
                                {musicCharts.tracks.map((track, idx) => {
                                  const isSpotifyLink = track.spotifyUrl.includes('/track/');
                                  const embedUrl = isSpotifyLink ? track.spotifyUrl.replace('/track/', '/embed/track/').split('?')[0] : '';
                                  
                                  return (
                                  <div key={track.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded flex gap-4 items-center shadow-sm hover:shadow-md dark:shadow-stone-900 transition-shadow">
                                    <div className="w-6 font-sans font-medium italic text-xl text-stone-300 dark:text-stone-600 flex items-center justify-center shrink-0 lining-nums">
                                      {idx + 1}
                                    </div>
                                    <div className="w-[64px] h-[64px] shrink-0 bg-stone-200 dark:bg-stone-800 overflow-hidden rounded-md border border-stone-200 dark:border-stone-700 shadow-sm relative pointer-events-none">
                                      {embedUrl ? (
                                        <iframe 
                                          src={embedUrl} 
                                          width="300" 
                                          height="80" 
                                          frameBorder="0" 
                                          allow="encrypted-media"
                                          className="absolute -left-2 -top-2"
                                        ></iframe>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 text-center p-1 leading-tight">需要 Track URL</div>
                                      )}
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
                                  );
                                })}
                              </div>
                            </div>
            
                            <div>
                              <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                                Top Albums 專輯排行
                              </h3>
                              <div className="flex flex-col gap-4">
                                {musicCharts.albums.map((album, idx) => {
                                  const isSpotifyLink = album.spotifyUrl.includes('/album/');
                                  const embedUrl = isSpotifyLink ? album.spotifyUrl.replace('/album/', '/embed/album/').split('?')[0] : '';
            
                                  return (
                                  <div key={album.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded flex gap-4 items-center shadow-sm hover:shadow-md dark:shadow-stone-900 transition-shadow">
                                    <div className="w-6 font-sans font-medium italic text-xl text-stone-300 dark:text-stone-600 flex items-center justify-center shrink-0 lining-nums">
                                      {idx + 1}
                                    </div>
                                    <div className="w-[64px] h-[64px] shrink-0 bg-stone-200 dark:bg-stone-800 overflow-hidden rounded-md border border-stone-200 dark:border-stone-700 shadow-sm relative pointer-events-none">
                                      {embedUrl ? (
                                        <iframe 
                                          src={embedUrl} 
                                          width="300" 
                                          height="80" 
                                          frameBorder="0" 
                                          allow="encrypted-media"
                                          className="absolute -left-2 -top-2"
                                        ></iframe>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 text-center p-1 leading-tight">需要 Album URL</div>
                                      )}
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
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </LayoutContainer>
  );
}

"use client"

import { useState, useEffect, useRef } from 'react';

// 1. 簡易的全域靜音狀態
let globalIsMuted = false;
const muteListeners = new Set<(muted: boolean) => void>();

function setGlobalMuted(muted: boolean) {
  globalIsMuted = muted;
  muteListeners.forEach(listener => listener(muted));
}

function useGlobalMute() {
  const [isMuted, setIsMuted] = useState(globalIsMuted);

  useEffect(() => {
    setIsMuted(globalIsMuted);
    muteListeners.add(setIsMuted);
    return () => { muteListeners.delete(setIsMuted); };
  }, []);

  return [isMuted, setGlobalMuted] as const;
}

// 2. 全域 IntersectionObserver，用來判斷「目前畫面正中央/最顯眼」的影片
const visibleVideos = new Map<HTMLVideoElement, number>();

function evaluatePlayingVideo() {
  let bestVideo: HTMLVideoElement | null = null;
  let bestScore = -Infinity;
  
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;

  visibleVideos.forEach((ratio, video) => {
    const rect = video.getBoundingClientRect();
    const videoCenterX = rect.left + rect.width / 2;
    const videoCenterY = rect.top + rect.height / 2;
    
    // 計算與畫面中心的距離（水平+垂直）並做正規化
    const distX = Math.abs(videoCenterX - viewportCenterX) / window.innerWidth;
    const distY = Math.abs(videoCenterY - viewportCenterY) / window.innerHeight;
    
    // 分數 = 可見比例 - 偏離中心的懲罰值
    const score = ratio - (distX + distY);
    
    if (score > bestScore) {
      bestScore = score;
      bestVideo = video;
    }
  });

  // 播放最高分的，其餘暫停
  visibleVideos.forEach((_, video) => {
    if (video === bestVideo) {
      video.play().catch(() => {});
    } else {
      if (!video.paused) video.pause();
    }
  });
}

// 建立全域 Observer
let videoObserver: IntersectionObserver | null = null;
if (typeof window !== 'undefined') {
  videoObserver = new IntersectionObserver(
    (entries) => {
      let changed = false;
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          visibleVideos.set(video, entry.intersectionRatio);
        } else {
          visibleVideos.delete(video);
          if (!video.paused) video.pause();
        }
        changed = true;
      });

      if (changed) {
        evaluatePlayingVideo();
      }
    },
    { threshold: [0.1, 0.3, 0.5, 0.7, 0.9, 1.0] } // 多重閾值以精確追蹤比例變化
  );
  
  // 當發生滾動時，更新中心距離評價（因為 ratio 可能沒變，但距離變了）
  window.addEventListener('scroll', () => {
    if (visibleVideos.size > 1) {
      evaluatePlayingVideo();
    }
  }, { capture: true, passive: true });
}

export default function InteractiveVideo({ src }: { src: string }) {
  const [isMuted, setIsGlobalMuted] = useGlobalMute();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDriveLink = src.includes('drive.google.com');
  const isDriveView = isDriveLink && src.includes('/view');
  const embedUrl = isDriveView ? src.replace('/view', '/preview').split('?')[0] : src;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGlobalMuted(!isMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoObserver) return;

    videoObserver.observe(video);

    return () => {
      videoObserver?.unobserve(video);
      visibleVideos.delete(video);
      evaluatePlayingVideo(); // 當這支影片被卸載，重新評估剩下的影片
    };
  }, []);

  if (isDriveLink) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black/5 dark:bg-black/40">
        <iframe 
          src={embedUrl} 
          className="w-full h-full border-0 absolute top-0 left-0"
          allow="autoplay; encrypted-media" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden group/video cursor-pointer bg-black/5 dark:bg-black/40" onClick={toggleMute}>
      <video 
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button 
        onClick={toggleMute}
        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 hover:bg-black/60 shadow-lg border border-white/10"
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
        )}
      </button>
    </div>
  );
}

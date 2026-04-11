import { getFashionCollections } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  const collections = getFashionCollections();
  return collections.map((_, index) => ({
    id: String(index),
  }));
}

export default async function FashionProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collections = getFashionCollections();
  const index = parseInt(id, 10);
  const project = collections[index];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-12 uppercase">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>
        
        <header className="mb-20">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight text-stone-900 dark:text-stone-50">{project.title}</h1>
          <p className="text-xl md:text-2xl text-stone-500 dark:text-stone-400 max-w-3xl leading-relaxed">{project.description}</p>
        </header>

        <div className="space-y-32 mb-20">
          {project.artworks.map((artwork, artworkIndex) => (
            <section key={artwork.id} className="flex flex-col space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-sans font-medium text-4xl text-stone-300 dark:text-stone-700 lining-nums">{String(artworkIndex + 1).padStart(2, '0')}</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">{artwork.title}</h2>
              </div>
              
              <div className={`flex flex-col md:flex-row gap-8 ${artworkIndex % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full bg-stone-100 dark:bg-stone-900 rounded-sm overflow-hidden shadow-lg aspect-[9/16]">
                  <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 w-full bg-stone-100 dark:bg-stone-900 rounded-sm overflow-hidden shadow-lg aspect-[9/16]">
                  {artwork.video ? (
                    artwork.video.includes('drive.google.com') ? (
                      <iframe 
                        src={artwork.video.replace(/\/view.*$/, '/preview')} 
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                      ></iframe>
                    ) : (
                      <video 
                        src={artwork.video} 
                        className="w-full h-full object-cover"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                      />
                    )
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm tracking-wider">NO VIDEO SOURCE</div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

import { getFashionCollections } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import InteractiveVideo from '@/components/InteractiveVideo';

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
        <Link href="/#fashion" className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-12 uppercase">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>
        
        <header className="mb-20">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight text-stone-900 dark:text-stone-50">{project.title}</h1>
          <p className="text-xl md:text-2xl text-stone-500 dark:text-stone-400 max-w-3xl leading-relaxed">{project.description}</p>
        </header>

        <div className="space-y-32 mb-20">
          {project.artworks.map((artwork, artworkIndex) => (
            <section key={artwork.id} className="flex flex-col items-center space-y-6 md:space-y-8 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-6 md:p-12 rounded shadow-sm w-full">
              <header className="flex flex-col items-center text-center gap-1.5 w-full">
                <span className="font-sans font-medium text-lg tracking-wider text-stone-400 dark:text-stone-500 lining-nums">LOOK {String(artworkIndex + 1).padStart(2, '0')}</span>
                <h2 className="font-serif text-xl md:text-2xl font-normal">{artwork.title}</h2>
              </header>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-center items-center">
                <div className="h-[45vh] md:h-[60vh] aspect-[9/16] bg-stone-100 dark:bg-stone-800 rounded overflow-hidden shadow-md shrink-0">
                  {artwork.video ? (
                    <InteractiveVideo src={artwork.video} />
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

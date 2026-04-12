import { ThemeToggle } from "./ThemeToggle";

export default function ProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 py-12 px-6 md:px-0 max-w-3xl mx-auto relative">
      <div className="absolute top-0 right-0 md:top-4 md:-right-12">
        <ThemeToggle />
      </div>

      {/* Avatar Placeholder */}
      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-200 dark:bg-stone-800 shrink-0">
        <div className="w-full h-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 font-serif">
          <img src="/Bio/intro/profile.jpg" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bio Details */}
      <div className="flex flex-col text-center md:text-left">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">Frank Sun</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium tracking-wide text-sm uppercase">Creative Developer & Designer</p>

        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed text-sm md:text-base">
          Crafting digital experiences at the intersection of design and engineering. Exploring code, fashion, and curated soundscapes.
        </p>

        <div className="flex gap-5 mt-6 justify-center md:justify-start text-stone-400 dark:text-stone-500">
          <a href="https://github.com/Gutamon" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.3-.4-4 1.4a13.9 13.9 0 0 0-7 0C6.3 2.8 5 3.2 5 3.2a5.4 5.4 0 0 0-.1 3.8A5.4 5.4 0 0 0 3 10.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" /><path d="M9 18c-4.5 1.5-5-2.5-7-3" /></svg>
          </a>
          <a href="https://www.instagram.com/starfall_frank/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

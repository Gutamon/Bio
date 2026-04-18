import { getCodeProjectBySlug, getCodeProjects } from '@/lib/data';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const projects = getCodeProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function CodeProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = getCodeProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex justify-center pb-20">
      <main className="max-w-3xl w-full px-6 pt-24">
        <Link
          href="/#code"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors mb-12 font-medium"
        >
          <span className="text-xl">↤</span> BACK
        </Link>
        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs font-medium tracking-wide text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-800 px-3 py-1 rounded-full uppercase">
                  {tag}
                </span>
              ))}
            </div>
            {/* {project.coverImage && (
              <div className="w-full h-[400px] overflow-hidden rounded-xl mb-8">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )} */}
          </header>

          <div className="prose prose-stone dark:prose-invert prose-lg max-w-none">
            <MDXRemote source={project.content} />
          </div>
        </article>
      </main>
    </div>
  );
}

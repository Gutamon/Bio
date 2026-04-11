import HomeClient from '@/components/HomeClient';
import { getCodeProjects, getFashionCollections, getMusicCharts } from '@/lib/data';

export default function Home() {
  // Fetch data at build time inside Server Component
  const codeProjects = getCodeProjects();
  const fashionCollections = getFashionCollections();
  const musicCharts = getMusicCharts();

  return (
    <HomeClient 
      codeProjects={codeProjects}
      fashionCollections={fashionCollections}
      musicCharts={musicCharts}
    />
  );
}

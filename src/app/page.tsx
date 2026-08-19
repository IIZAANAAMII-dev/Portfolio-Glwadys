import ActIntroHero from '@/components/ActIntroHero';
import ActStoryPhone from '@/components/ActStoryPhone';
import Grain from '@/components/Grain';

export default function Home() {
  return (
    <main className="relative">
      <Grain />
      <ActIntroHero />
      <ActStoryPhone />
    </main>
  );
}

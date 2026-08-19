import Opening from '@/components/Opening';
import HeroSequence from '@/components/HeroSequence';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  return (
    <main className="relative">
      <div className="grain" aria-hidden="true" />
      <Opening />
      <HeroSequence />
      <BottomNav />
    </main>
  );
}

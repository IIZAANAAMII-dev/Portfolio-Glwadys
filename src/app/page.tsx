import ActIntroHero from '@/components/ActIntroHero';

export default function Home() {
  return (
    <main className="relative">
      <div className="grain" aria-hidden="true" />
      <ActIntroHero />
      <section className="h-screen w-full bg-ivory text-obsidian flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest">Next act placeholder</p>
      </section>
    </main>
  );
}

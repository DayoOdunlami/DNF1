'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to game - everyone joins the same room
    router.push('/game/main');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="max-w-2xl w-full text-center">
        <header className="mb-12">
          <h1 className="font-orbitron text-5xl md:text-6xl font-black uppercase tracking-wider mb-4 bg-gradient-to-r from-neon-red to-neon-yellow bg-clip-text text-transparent animate-glow">
            🏎️ Date Night Grand Prix
          </h1>
          <p className="text-xl text-gray-400 font-rajdhani tracking-wider">
            Lights out and away we go!
          </p>
        </header>

        <div className="bg-dark-card rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-red mx-auto mb-4"></div>
            <p className="text-gray-400 font-rajdhani">
              Joining game...
            </p>
            <p className="text-gray-500 text-sm font-rajdhani">
              First person becomes Host, second becomes Guest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



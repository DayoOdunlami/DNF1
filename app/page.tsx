'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoomCode } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateGame = () => {
    const code = generateRoomCode();
    router.push(`/game/${code}?role=host`);
  };

  const handleJoinGame = () => {
    if (roomCode.trim()) {
      router.push(`/game/${roomCode.toUpperCase()}?role=guest`);
    }
  };

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
            <button
              onClick={handleCreateGame}
              className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform shadow-lg hover:shadow-neon-red/50"
            >
              Create Game 🏁
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-card text-gray-400 font-rajdhani uppercase tracking-wider">
                  Or Join Existing Game
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code (e.g., TURBO-7X2K)"
                className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 font-rajdhani text-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors text-center"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
              />
              <button
                onClick={handleJoinGame}
                disabled={!roomCode.trim()}
                className="w-full bg-transparent border-2 border-neon-blue rounded-full py-4 px-8 font-rajdhani text-lg font-semibold text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Game 🔵
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-gray-500 text-sm font-rajdhani">
          Share the room code with your partner to play together!
        </p>
      </div>
    </div>
  );
}


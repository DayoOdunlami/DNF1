'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoomCode } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinRoom = () => {
    const code = roomCode.trim().toUpperCase() || generateRoomCode();
    // Role will be determined automatically by who joins first
    router.push(`/game/${code}`);
  };

  const handleGenerateCode = () => {
    setRoomCode(generateRoomCode());
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
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter or generate room code"
                  className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 font-rajdhani text-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors text-center"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
                <button
                  onClick={handleGenerateCode}
                  className="px-4 bg-white/10 border-2 border-white/20 rounded-xl font-rajdhani text-sm text-white hover:bg-white/20 transition-colors"
                  title="Generate random room code"
                >
                  🎲
                </button>
              </div>
              <button
                onClick={handleJoinRoom}
                className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform shadow-lg hover:shadow-neon-red/50"
              >
                Join Room 🏁
              </button>
            </div>

            <p className="text-gray-400 text-sm font-rajdhani">
              First person to join becomes Host, second becomes Guest
            </p>
          </div>
        </div>

        <p className="mt-8 text-gray-500 text-sm font-rajdhani">
          Share the room code with your partner to play together!
        </p>
      </div>
    </div>
  );
}



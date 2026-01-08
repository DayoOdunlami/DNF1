'use client';

import type { GameRoom } from '@/lib/types';

interface ScoreboardProps {
  gameState: GameRoom;
}

export default function Scoreboard({ gameState }: ScoreboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 items-center">
      <div className="bg-dark-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-red to-neon-yellow"></div>
        <div className="text-center">
          <div className="font-orbitron text-xl font-bold mb-2 text-neon-red">
            {gameState.players.host.name || 'Host'}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-3xl font-bold font-orbitron">{gameState.players.host.coins}</span>
          </div>
        </div>
      </div>

      <div className="hidden md:block text-center">
        <div className="font-orbitron text-2xl font-black text-gray-500">VS</div>
      </div>

      <div className="bg-dark-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue to-neon-green"></div>
        <div className="text-center">
          <div className="font-orbitron text-xl font-bold mb-2 text-neon-blue">
            {gameState.players.guest.name || 'Guest'}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-3xl font-bold font-orbitron">{gameState.players.guest.coins}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


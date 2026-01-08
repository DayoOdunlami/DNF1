'use client';

import { useState, useEffect } from 'react';
import type { GameRoom } from '@/lib/types';
import Confetti from '@/components/ui/Confetti';
import { playSound, playBeep } from '@/components/utils/sounds';

interface ResultsProps {
  gameState: GameRoom;
}

export default function Results({ gameState }: ResultsProps) {
  const hostCoins = gameState.players.host.coins;
  const guestCoins = gameState.players.guest.coins;
  const winner = hostCoins > guestCoins ? 'host' : guestCoins > hostCoins ? 'guest' : 'tie';
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    try {
      playSound('win');
    } catch {
      if (winner !== 'tie') {
        playBeep(600, 300);
      } else {
        playBeep(500, 200);
      }
    }
  }, [winner]);

  return (
    <>
      <Confetti trigger={showConfetti} type={winner !== 'tie' ? 'win' : 'celebration'} />
      <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <div className="bg-dark-card rounded-3xl p-12 border border-white/10">
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-neon-red to-neon-yellow bg-clip-text text-transparent">
            🏁 Race Complete! 🏁
          </h2>

          {winner === 'tie' ? (
            <div className="text-5xl font-orbitron text-neon-yellow mb-8 animate-glow">
              It's a Draw!
            </div>
          ) : (
            <div className="text-5xl font-orbitron text-neon-yellow mb-8 animate-glow">
              {gameState.players[winner].name} Wins!
            </div>
          )}

          <div className="flex justify-center gap-12 mb-8">
            <div className={`text-center ${winner === 'host' ? 'scale-110' : ''}`}>
              <div className="text-lg text-gray-400 mb-2 font-rajdhani">
                {gameState.players.host.name}
              </div>
              <div className={`text-5xl font-orbitron font-black ${winner === 'host' ? 'text-neon-yellow' : 'text-white'}`}>
                🪙 {hostCoins}
              </div>
            </div>
            <div className={`text-center ${winner === 'guest' ? 'scale-110' : ''}`}>
              <div className="text-lg text-gray-400 mb-2 font-rajdhani">
                {gameState.players.guest.name}
              </div>
              <div className={`text-5xl font-orbitron font-black ${winner === 'guest' ? 'text-neon-yellow' : 'text-white'}`}>
                🪙 {guestCoins}
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-8 font-rajdhani text-lg">
            {winner === 'tie'
              ? 'A rare dead heat! You both owe each other breakfast.'
              : `${gameState.players[winner === 'host' ? 'guest' : 'host'].name} owes ${gameState.players[winner].name} breakfast! 🍳`}
          </p>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-12 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
          >
            Race Again? 🔄
          </button>
        </div>
      </div>
    </div>
    </>
  );
}


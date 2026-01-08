'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { GameRoom } from '@/lib/types';

interface AnimatedScoreboardProps {
  gameState: GameRoom;
}

export default function AnimatedScoreboard({ gameState }: AnimatedScoreboardProps) {
  const prevHostCoins = useRef(gameState.players.host.coins);
  const prevGuestCoins = useRef(gameState.players.guest.coins);
  const [hostChange, setHostChange] = useState<number | null>(null);
  const [guestChange, setGuestChange] = useState<number | null>(null);

  useEffect(() => {
    const hostDiff = gameState.players.host.coins - prevHostCoins.current;
    const guestDiff = gameState.players.guest.coins - prevGuestCoins.current;

    if (hostDiff !== 0) {
      setHostChange(hostDiff);
      setTimeout(() => setHostChange(null), 2000);
    }
    if (guestDiff !== 0) {
      setGuestChange(guestDiff);
      setTimeout(() => setGuestChange(null), 2000);
    }

    prevHostCoins.current = gameState.players.host.coins;
    prevGuestCoins.current = gameState.players.guest.coins;
  }, [gameState.players.host.coins, gameState.players.guest.coins]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 items-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: hostChange ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-dark-card rounded-2xl p-5 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-red to-neon-yellow"></div>
        <div className="text-center">
          <div className="font-orbitron text-xl font-bold mb-2 text-neon-red">
            {gameState.players.host.name || 'Host'}
          </div>
          <div className="flex items-center justify-center gap-2 relative">
            <span className="text-2xl">🪙</span>
            <motion.span
              key={gameState.players.host.coins}
              initial={{ scale: 1.2, color: '#ff1744' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold font-orbitron"
            >
              {gameState.players.host.coins}
            </motion.span>
            {hostChange !== null && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute -top-6 text-lg font-bold font-orbitron ${
                  hostChange > 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {hostChange > 0 ? '+' : ''}{hostChange}
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>

      <div className="hidden md:block text-center">
        <div className="font-orbitron text-2xl font-black text-gray-500">VS</div>
      </div>

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: guestChange ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        className="bg-dark-card rounded-2xl p-5 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue to-neon-green"></div>
        <div className="text-center">
          <div className="font-orbitron text-xl font-bold mb-2 text-neon-blue">
            {gameState.players.guest.name || 'Guest'}
          </div>
          <div className="flex items-center justify-center gap-2 relative">
            <span className="text-2xl">🪙</span>
            <motion.span
              key={gameState.players.guest.coins}
              initial={{ scale: 1.2, color: '#00e5ff' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold font-orbitron"
            >
              {gameState.players.guest.coins}
            </motion.span>
            {guestChange !== null && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute -top-6 text-lg font-bold font-orbitron ${
                  guestChange > 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {guestChange > 0 ? '+' : ''}{guestChange}
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}


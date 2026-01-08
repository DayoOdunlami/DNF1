'use client';

import { useState } from 'react';
import type { GameRoom, GameMessage } from '@/lib/types';
import { rounds } from '@/lib/questions';

interface AdminPanelProps {
  gameState: GameRoom;
  sendMessage: (message: GameMessage) => void;
}

export default function AdminPanel({ gameState, sendMessage }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hostCoins, setHostCoins] = useState(gameState.players.host.coins);
  const [guestCoins, setGuestCoins] = useState(gameState.players.guest.coins);

  const currentRound = rounds[gameState.currentRound];
  const totalQuestions = currentRound?.questions.length || 0;

  const handleJumpRound = (round: number) => {
    sendMessage({ type: 'admin:jump-round', round });
  };

  const handleJumpQuestion = (question: number) => {
    sendMessage({ type: 'admin:jump-question', question });
  };

  const handleSetCoins = () => {
    sendMessage({
      type: 'admin:set-coins',
      host: hostCoins,
      guest: guestCoins,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-neon-yellow/20 border-2 border-neon-yellow rounded-full p-4 hover:bg-neon-yellow/30 transition-colors z-50"
        title="Host Controls"
      >
        <span className="text-2xl">🔧</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-dark-card border-2 border-neon-yellow rounded-2xl p-6 w-80 max-h-[80vh] overflow-y-auto z-50 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-orbitron text-lg text-neon-yellow">🔧 HOST CONTROLS</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-gray-400 mb-2 font-rajdhani">Jump to Round:</label>
          <div className="flex gap-2">
            {rounds.map((_, i) => (
              <button
                key={i}
                onClick={() => handleJumpRound(i)}
                className={`px-3 py-1 rounded border ${
                  gameState.currentRound === i
                    ? 'bg-neon-yellow text-dark-bg border-neon-yellow'
                    : 'border-white/20 hover:border-neon-yellow'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2 font-rajdhani">Jump to Question:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleJumpQuestion(Math.max(0, gameState.currentQuestion - 1))}
              className="px-3 py-1 rounded border border-white/20 hover:border-neon-yellow"
            >
              ◀
            </button>
            <span className="flex-1 text-center font-rajdhani">
              Q{gameState.currentQuestion + 1} of {totalQuestions}
            </span>
            <button
              onClick={() => handleJumpQuestion(Math.min(totalQuestions - 1, gameState.currentQuestion + 1))}
              className="px-3 py-1 rounded border border-white/20 hover:border-neon-yellow"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <label className="block text-gray-400 mb-2 font-rajdhani">Set Coins:</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-neon-red w-16 font-rajdhani">Host:</span>
              <input
                type="number"
                value={hostCoins}
                onChange={(e) => setHostCoins(Number(e.target.value))}
                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neon-blue w-16 font-rajdhani">Guest:</span>
              <input
                type="number"
                value={guestCoins}
                onChange={(e) => setGuestCoins(Number(e.target.value))}
                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            <button
              onClick={handleSetCoins}
              className="w-full py-2 bg-neon-blue/20 border border-neon-blue rounded hover:bg-neon-blue/30 transition-colors font-rajdhani"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <button
            onClick={() => sendMessage({ type: 'admin:reset-powerups' })}
            className="w-full py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors font-rajdhani"
          >
            Reset Power-ups
          </button>
          <button
            onClick={() => sendMessage({ type: 'admin:skip-question' })}
            className="w-full py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors font-rajdhani"
          >
            Skip Question
          </button>
          <button
            onClick={() => sendMessage({ type: 'admin:force-reveal' })}
            className="w-full py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-colors font-rajdhani"
          >
            Force Reveal
          </button>
          <button
            onClick={() => sendMessage({ type: 'admin:end-game' })}
            className="w-full py-2 bg-neon-red/20 border border-neon-red rounded hover:bg-neon-red/30 transition-colors font-rajdhani"
          >
            End Game
          </button>
        </div>

        <div className="border-t border-white/10 pt-4 text-xs text-gray-400 font-rajdhani">
          <p>Room: {gameState.id}</p>
          <p>Host: {gameState.players.host.connected ? '🟢' : '🔴'} Connected</p>
          <p>Guest: {gameState.players.guest.connected ? '🟢' : '🔴'} Connected</p>
        </div>
      </div>
    </div>
  );
}


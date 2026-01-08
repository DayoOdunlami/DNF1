'use client';

import { useState, useEffect } from 'react';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { rounds } from '@/lib/questions';
import Scoreboard from './Scoreboard';
import PowerupsPanel from './PowerupsPanel';
import AdminPanel from './AdminPanel';
import MrMrsRound from './rounds/MrMrsRound';
import ConfidenceRound from './rounds/ConfidenceRound';
import VideoRound from './rounds/VideoRound';

interface GameBoardProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
}

export default function GameBoard({ gameState, role, sendMessage }: GameBoardProps) {
  const [showRoundIntro, setShowRoundIntro] = useState(true);
  const currentRound = rounds[gameState.currentRound];
  const currentQuestion = currentRound?.questions[gameState.currentQuestion];

  useEffect(() => {
    // Show intro when round changes
    setShowRoundIntro(true);
  }, [gameState.currentRound]);

  if (showRoundIntro && currentRound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center">
          <div className="bg-dark-card rounded-3xl p-12 border border-white/10">
            <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-neon-red to-neon-yellow bg-clip-text text-transparent">
              Round {gameState.currentRound + 1}: {currentRound.name}
            </h2>
            <p className="text-xl text-gray-400 font-rajdhani mb-8">{currentRound.subtitle}</p>
            {role === 'host' && (
              <button
                onClick={() => setShowRoundIntro(false)}
                className="bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-12 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
              >
                Let's Go! 🚦
              </button>
            )}
            {role === 'guest' && (
              <p className="text-gray-400 font-rajdhani">Waiting for host to start...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentRound || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-orbitron text-3xl md:text-4xl font-black uppercase tracking-wider mb-2 bg-gradient-to-r from-neon-red to-neon-yellow bg-clip-text text-transparent">
            🏎️ Date Night Grand Prix
          </h1>
        </header>

        <Scoreboard gameState={gameState} />
        <PowerupsPanel gameState={gameState} role={role} sendMessage={sendMessage} />

        <div className="bg-dark-card rounded-3xl p-6 md:p-8 border border-white/10 mb-6">
          {currentRound.type === 'mr-mrs' && (
            <MrMrsRound
              gameState={gameState}
              role={role}
              sendMessage={sendMessage}
              question={currentQuestion as any}
            />
          )}
          {currentRound.type === 'confidence' && (
            <ConfidenceRound
              gameState={gameState}
              role={role}
              sendMessage={sendMessage}
              question={currentQuestion as any}
            />
          )}
          {currentRound.type === 'video' && (
            <VideoRound
              gameState={gameState}
              role={role}
              sendMessage={sendMessage}
              question={currentQuestion as any}
            />
          )}
        </div>

        {role === 'host' && <AdminPanel gameState={gameState} sendMessage={sendMessage} />}
      </div>
    </div>
  );
}


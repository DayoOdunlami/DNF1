'use client';

import { useState } from 'react';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';

interface LobbyProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
}

export default function Lobby({ gameState, role, sendMessage }: LobbyProps) {
  const [playerName, setPlayerName] = useState(gameState.players[role].name || '');

  const handleJoin = () => {
    if (playerName.trim()) {
      sendMessage({
        type: 'player:joined',
        player: role,
        name: playerName.trim(),
      });
    }
  };

  const handleStartGame = () => {
    if (gameState.players.host.connected && gameState.players.guest.connected) {
      sendMessage({ type: 'game:started' });
    }
  };

  const isHost = role === 'host';
  const hostReady = gameState.players.host.name && gameState.players.host.connected;
  const guestReady = gameState.players.guest.name && gameState.players.guest.connected;
  const bothReady = hostReady && guestReady;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <header className="text-center mb-8">
          <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase tracking-wider mb-4 bg-gradient-to-r from-neon-red to-neon-yellow bg-clip-text text-transparent">
            🏎️ Date Night Grand Prix
          </h1>
          <p className="text-gray-400 font-rajdhani">Room: {gameState.id}</p>
        </header>

        <div className="bg-dark-card rounded-3xl p-8 border border-white/10">
          {!gameState.players[role].name ? (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl text-neon-yellow text-center mb-6">
                ⚡ Enter the Grid
              </h2>
              <div className="space-y-4">
                <label className="block text-sm text-gray-400 uppercase tracking-wider font-rajdhani">
                  {isHost ? '🔴' : '🔵'} Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 font-rajdhani text-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors text-center"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                />
                <button
                  onClick={handleJoin}
                  disabled={!playerName.trim()}
                  className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Race 🏁
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl text-neon-yellow text-center mb-6">
                Waiting Room
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${hostReady ? 'bg-neon-green' : 'bg-gray-500'}`}></div>
                    <span className="font-rajdhani text-lg text-neon-red">
                      {gameState.players.host.name || 'Host'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {hostReady ? 'Ready' : 'Waiting...'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${guestReady ? 'bg-neon-green' : 'bg-gray-500'}`}></div>
                    <span className="font-rajdhani text-lg text-neon-blue">
                      {gameState.players.guest.name || 'Guest'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {guestReady ? 'Ready' : 'Waiting...'}
                  </span>
                </div>
              </div>

              {isHost && (
                <div className="pt-6 border-t border-white/10">
                  {bothReady ? (
                    <button
                      onClick={handleStartGame}
                      className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                      Start Race! 🚦
                    </button>
                  ) : (
                    <p className="text-center text-gray-400 font-rajdhani">
                      Waiting for both players to join...
                    </p>
                  )}
                </div>
              )}

              {!isHost && !bothReady && (
                <p className="text-center text-gray-400 font-rajdhani">
                  Waiting for host to start the game...
                </p>
              )}

              {isHost && (
                <div className="mt-6 p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl">
                  <p className="text-sm text-neon-blue font-rajdhani text-center">
                    📋 Share this link: {typeof window !== 'undefined' && window.location.href.split('?')[0]}?role=guest
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


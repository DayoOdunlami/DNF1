'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { SimpleGameSync } from '@/lib/gameSync';
import Lobby from '@/components/game/Lobby';
import GameBoard from '@/components/game/GameBoard';
import Results from '@/components/game/Results';

export default function GamePage() {
  const params = useParams();
  const roomId = params.roomId as string;
  
  const [gameState, setGameState] = useState<GameRoom | null>(null);
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [sync, setSync] = useState<SimpleGameSync | null>(null);

  useEffect(() => {
    // Create sync instance
    const gameSync = new SimpleGameSync(roomId);
    setSync(gameSync);

    // Subscribe to state updates
    const unsubscribe = gameSync.onStateUpdate((state) => {
      setGameState(state);
      const currentRole = gameSync.getRole();
      if (currentRole) {
        setRole(currentRole);
      }
    });

    return () => {
      unsubscribe();
      gameSync.disconnect();
    };
  }, [roomId]);

  const sendMessage = (message: GameMessage) => {
    if (sync) {
      sync.sendMessage(message);
    }
  };

  if (!gameState || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-red mx-auto mb-4"></div>
          <p className="text-gray-400 font-rajdhani">Connecting to game room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {gameState.status === 'lobby' && (
        <Lobby gameState={gameState} role={role} sendMessage={sendMessage} />
      )}
      {gameState.status === 'playing' && (
        <GameBoard gameState={gameState} role={role} sendMessage={sendMessage} />
      )}
      {gameState.status === 'finished' && (
        <Results gameState={gameState} />
      )}
    </div>
  );
}


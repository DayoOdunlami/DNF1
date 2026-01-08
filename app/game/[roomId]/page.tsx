'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PartySocket from 'partysocket';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { createInitialGameRoom } from '@/lib/gameState';
import Lobby from '@/components/game/Lobby';
import GameBoard from '@/components/game/GameBoard';
import Results from '@/components/game/Results';

const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'localhost:1999';

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const role = (searchParams.get('role') || 'guest') as PlayerRole;
  
  const [gameState, setGameState] = useState<GameRoom | null>(null);
  const [socket, setSocket] = useState<PartySocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const protocol = PARTYKIT_HOST.includes('localhost') ? 'ws' : 'wss';
    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
      protocol,
    });

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to room:', roomId);
      
      // Request initial state
      ws.send(JSON.stringify({ type: 'state:request' } as any));
      
      // If we're the host and no state exists, create it
      if (role === 'host') {
        setTimeout(() => {
          ws.send(JSON.stringify({ type: 'state:request' } as any));
        }, 100);
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: GameMessage = JSON.parse(event.data);
        
        if (message.type === 'state:update') {
          setGameState(message.state as GameRoom);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('Disconnected from room');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [roomId]);

  const sendMessage = (message: GameMessage) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    }
  };

  if (!gameState) {
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


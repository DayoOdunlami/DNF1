'use client';

import { useParams } from 'next/navigation';
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
  const roomId = params.roomId as string;
  
  const [gameState, setGameState] = useState<GameRoom | null>(null);
  const [socket, setSocket] = useState<PartySocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState<PlayerRole | null>(null);

  useEffect(() => {
    const protocol = PARTYKIT_HOST.includes('localhost') ? 'ws' : 'wss';
    const ws = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
      protocol,
    });

    let determinedRole: PlayerRole | null = null;

    ws.onopen = () => {
      setConnected(true);
      console.log('Connected to room:', roomId);
      
      // Request initial state (server will create it if it doesn't exist)
      ws.send(JSON.stringify({ type: 'state:request' } as any));
    };

    ws.onmessage = (event) => {
      try {
        const message: GameMessage = JSON.parse(event.data);
        
        if (message.type === 'state:update') {
          const state = message.state as GameRoom;
          setGameState(state);
          
          // Automatically determine role based on who's connected
          // First person becomes host, second becomes guest
          if (!determinedRole) {
            if (!state.players.host.connected) {
              // No host connected yet, this person becomes host
              determinedRole = 'host';
              setRole('host');
            } else if (!state.players.guest.connected) {
              // Host exists but no guest, this person becomes guest
              determinedRole = 'guest';
              setRole('guest');
            } else {
              // Both slots taken, default to guest (room is full)
              determinedRole = 'guest';
              setRole('guest');
            }
          }
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


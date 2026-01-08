import type { GameRoom, Player, PowerupState } from './types';

export function createInitialGameRoom(roomId: string, hostId: string): GameRoom {
  const initialPowerups: PowerupState = {
    drs: true,
    'safety-car': true,
    'red-flag': true,
    'hard-tyres': true,
    undercut: true,
    'team-radio': true,
  };

  const initialPlayer: Player = {
    name: '',
    coins: 100,
    powerups: { ...initialPowerups },
    connected: false,
  };

  return {
    id: roomId,
    hostId,
    status: 'lobby',
    players: {
      host: { ...initialPlayer },
      guest: { ...initialPlayer },
    },
    currentRound: 0,
    currentQuestion: 0,
    roundPhase: 'betting',
    bets: { host: 10, guest: 10 },
    answers: { host: null, guest: null },
    activePowerups: { host: null, guest: null },
    buzzedPlayer: null,
    tyreSelection: 'medium',
  };
}


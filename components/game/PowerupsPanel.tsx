'use client';

import type { GameRoom, GameMessage, PlayerRole, PowerupType } from '@/lib/types';

interface PowerupsPanelProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
}

const powerupConfig: Record<PowerupType, { emoji: string; color: string }> = {
  'drs': { emoji: '🟢', color: 'border-neon-green hover:bg-neon-green/20' },
  'safety-car': { emoji: '🟡', color: 'border-neon-yellow hover:bg-neon-yellow/20' },
  'red-flag': { emoji: '🔴', color: 'border-neon-red hover:bg-neon-red/20' },
  'hard-tyres': { emoji: '⚫', color: 'border-gray-500 hover:bg-gray-500/20' },
  'undercut': { emoji: '🟣', color: 'border-neon-purple hover:bg-neon-purple/20' },
  'team-radio': { emoji: '🔵', color: 'border-neon-blue hover:bg-neon-blue/20' },
};

export default function PowerupsPanel({ gameState, role, sendMessage }: PowerupsPanelProps) {
  const playerPowerups = gameState.players[role].powerups;
  const activePowerup = gameState.activePowerups[role];

  const handleActivatePowerup = (powerup: PowerupType) => {
    if (playerPowerups[powerup] && !activePowerup) {
      sendMessage({
        type: 'powerup:activated',
        player: role,
        powerup,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-dark-card rounded-xl p-4 border border-white/10">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-rajdhani">
          {gameState.players.host.name}'s Power-ups
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(powerupConfig) as PowerupType[]).map((powerup) => {
            const config = powerupConfig[powerup];
            const available = gameState.players.host.powerups[powerup];
            const isActive = gameState.activePowerups.host === powerup;
            
            return (
              <button
                key={powerup}
                disabled={!available || role !== 'host'}
                className={`px-3 py-2 rounded-lg border text-sm font-rajdhani font-semibold transition-all ${
                  config.color
                } ${available ? 'opacity-100' : 'opacity-30'} ${
                  isActive ? 'animate-pulse' : ''
                } disabled:cursor-not-allowed`}
                onClick={() => role === 'host' && handleActivatePowerup(powerup)}
              >
                {config.emoji} {powerup.replace('-', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-dark-card rounded-xl p-4 border border-white/10">
        <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-rajdhani">
          {gameState.players.guest.name}'s Power-ups
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(powerupConfig) as PowerupType[]).map((powerup) => {
            const config = powerupConfig[powerup];
            const available = gameState.players.guest.powerups[powerup];
            const isActive = gameState.activePowerups.guest === powerup;
            
            return (
              <button
                key={powerup}
                disabled={!available || role !== 'guest'}
                className={`px-3 py-2 rounded-lg border text-sm font-rajdhani font-semibold transition-all ${
                  config.color
                } ${available ? 'opacity-100' : 'opacity-30'} ${
                  isActive ? 'animate-pulse' : ''
                } disabled:cursor-not-allowed`}
                onClick={() => role === 'guest' && handleActivatePowerup(powerup)}
              >
                {config.emoji} {powerup.replace('-', ' ')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


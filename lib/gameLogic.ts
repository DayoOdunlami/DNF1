import type { GameRoom, PlayerRole, PowerupType, TyreType } from './types';
import { rounds } from './questions';

export function calculateMrMrsPoints(
  gameState: GameRoom,
  winner: 'both' | 'host' | 'guest' | 'none'
): { host: number; guest: number } {
  const betHost = gameState.bets.host;
  const betGuest = gameState.bets.guest;
  
  let hostChange = 0;
  let guestChange = 0;
  
  if (winner === 'both') {
    hostChange = betHost;
    guestChange = betGuest;
  } else if (winner === 'host') {
    hostChange = betHost;
    guestChange = -betGuest;
  } else if (winner === 'guest') {
    hostChange = -betHost;
    guestChange = betGuest;
  } else {
    hostChange = -betHost;
    guestChange = -betGuest;
  }
  
  // Apply DRS
  if (gameState.activePowerups.host === 'drs') hostChange *= 2;
  if (gameState.activePowerups.guest === 'drs') guestChange *= 2;
  
  // Apply Hard Tyres protection
  if (gameState.activePowerups.host === 'hard-tyres') {
    if (hostChange < 0) {
      hostChange = Math.floor(betHost * 0.5);
    } else {
      hostChange = Math.floor(hostChange * 0.75);
    }
  }
  if (gameState.activePowerups.guest === 'hard-tyres') {
    if (guestChange < 0) {
      guestChange = Math.floor(betGuest * 0.5);
    } else {
      guestChange = Math.floor(guestChange * 0.75);
    }
  }
  
  return { host: hostChange, guest: guestChange };
}

export function calculateConfidencePoints(
  gameState: GameRoom,
  hostGuess: number,
  guestGuess: number,
  hostTyre: TyreType,
  guestTyre: TyreType
): { host: number; guest: number } {
  const currentRound = rounds[gameState.currentRound];
  const question = currentRound?.questions[gameState.currentQuestion] as any;
  
  if (!question || question.type !== 'confidence') {
    return { host: 0, guest: 0 };
  }
  
  const answer = question.answer;
  const hostRange = question.ranges[hostTyre];
  const guestRange = question.ranges[guestTyre];
  const hostMultiplier = hostTyre === 'soft' ? 3 : hostTyre === 'medium' ? 2 : 1;
  const guestMultiplier = guestTyre === 'soft' ? 3 : guestTyre === 'medium' ? 2 : 1;
  
  const hostCorrect = Math.abs(hostGuess - answer) <= hostRange;
  const guestCorrect = Math.abs(guestGuess - answer) <= guestRange;
  
  let hostChange = hostCorrect ? gameState.bets.host * hostMultiplier : -gameState.bets.host;
  let guestChange = guestCorrect ? gameState.bets.guest * guestMultiplier : -gameState.bets.guest;
  
  // Apply DRS
  if (gameState.activePowerups.host === 'drs') hostChange *= 2;
  if (gameState.activePowerups.guest === 'drs') guestChange *= 2;
  
  // Apply Hard Tyres protection
  if (gameState.activePowerups.host === 'hard-tyres' && !hostCorrect) {
    hostChange = -Math.floor(gameState.bets.host * 0.5);
  }
  if (gameState.activePowerups.guest === 'hard-tyres' && !guestCorrect) {
    guestChange = -Math.floor(gameState.bets.guest * 0.5);
  }
  
  return { host: hostChange, guest: guestChange };
}

export function calculateVideoPoints(
  gameState: GameRoom,
  hostAnswer: number,
  guestAnswer: number,
  correctAnswer: number
): { host: number; guest: number } {
  const hostCorrect = hostAnswer === correctAnswer;
  const guestCorrect = guestAnswer === correctAnswer;
  const buzzedPlayer = gameState.buzzedPlayer;
  
  let hostChange = 0;
  let guestChange = 0;
  
  if (hostCorrect && guestCorrect) {
    // Both correct
    if (buzzedPlayer === 'host') {
      hostChange = Math.floor(gameState.bets.host * 1.5);
      guestChange = gameState.bets.guest;
    } else if (buzzedPlayer === 'guest') {
      hostChange = gameState.bets.host;
      guestChange = Math.floor(gameState.bets.guest * 1.5);
    } else {
      hostChange = gameState.bets.host;
      guestChange = gameState.bets.guest;
    }
  } else if (hostCorrect) {
    // Only host correct
    if (buzzedPlayer === 'host') {
      hostChange = Math.floor(gameState.bets.host * 1.5);
      guestChange = -gameState.bets.guest;
    } else {
      hostChange = gameState.bets.host;
      guestChange = -gameState.bets.guest;
    }
  } else if (guestCorrect) {
    // Only guest correct
    if (buzzedPlayer === 'guest') {
      hostChange = -gameState.bets.host;
      guestChange = Math.floor(gameState.bets.guest * 1.5);
    } else {
      hostChange = -gameState.bets.host;
      guestChange = gameState.bets.guest;
    }
  } else {
    // Both wrong
    if (buzzedPlayer === 'host') {
      hostChange = -Math.floor(gameState.bets.host * 1.5);
      guestChange = -gameState.bets.guest;
    } else if (buzzedPlayer === 'guest') {
      hostChange = -gameState.bets.host;
      guestChange = -Math.floor(gameState.bets.guest * 1.5);
    } else {
      hostChange = -gameState.bets.host;
      guestChange = -gameState.bets.guest;
    }
  }
  
  // Apply DRS
  if (gameState.activePowerups.host === 'drs') hostChange *= 2;
  if (gameState.activePowerups.guest === 'drs') guestChange *= 2;
  
  return { host: hostChange, guest: guestChange };
}



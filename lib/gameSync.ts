/**
 * Simple game state synchronization without server
 * Uses localStorage + polling for state sync between players
 */

import type { GameRoom, GameMessage, PlayerRole } from './types';
import { createInitialGameRoom } from './gameState';
import { rounds } from './questions';

const STORAGE_KEY = 'dnf-game-state';
const POLL_INTERVAL = 500; // Poll every 500ms

export class SimpleGameSync {
  private roomId: string;
  private role: PlayerRole | null = null;
  private gameState: GameRoom | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(state: GameRoom) => void> = new Set();
  private messageListeners: Set<(message: GameMessage) => void> = new Set();

  constructor(roomId: string) {
    this.roomId = roomId;
    this.startPolling();
  }

  private startPolling() {
    // Initialize or load state
    this.loadState();
    
    // Start polling for updates
    this.pollInterval = setInterval(() => {
      this.loadState();
    }, POLL_INTERVAL);

    // Also listen for storage events (works across tabs)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
  }

  private handleStorageEvent(e: StorageEvent) {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const state = JSON.parse(e.newValue) as GameRoom;
        if (state.id === this.roomId) {
          this.updateState(state);
        }
      } catch (error) {
        console.error('Error parsing storage event:', error);
      }
    }
  }

  private loadState() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored) as GameRoom;
        if (state.id === this.roomId) {
          this.updateState(state);
        }
      } else {
        // No state exists - check if we should create it
        this.initializeState();
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  private initializeState() {
    // Check if another player already created state
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.loadState();
      return;
    }

    // Determine role based on who's already in the room
    // First person becomes host, second becomes guest
    const existingState = this.gameState;
    
    if (!existingState) {
      // Create initial state - first person is host
      const newState = createInitialGameRoom(this.roomId, 'host-1');
      newState.players.host.connected = true;
      this.role = 'host';
      this.saveState(newState);
    }
  }

  private updateState(newState: GameRoom) {
    const oldState = this.gameState;
    this.gameState = newState;

    // Determine role if not set - use a unique identifier per browser tab
    if (!this.role) {
      const playerId = this.getPlayerId();
      
      // Check if we're already assigned in state (stored in a custom field)
      // For now, determine based on connection status
      if (!newState.players.host.connected) {
        // No host - we become host
        this.role = 'host';
        newState.players.host.connected = true;
        this.saveState(newState);
      } else if (!newState.players.guest.connected && newState.players.host.connected) {
        // Host exists but no guest - we become guest
        this.role = 'guest';
        newState.players.guest.connected = true;
        this.saveState(newState);
      } else {
        // Both connected - we need to check which tab we are
        // Use a simple heuristic: if we just loaded and host is connected, we're guest
        // This isn't perfect but works for same-device scenarios
        this.role = 'guest';
      }
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(newState));
  }

  private getPlayerId(): string {
    // Generate a unique ID for this browser tab
    if (typeof window === 'undefined') return 'unknown';
    
    let playerId = sessionStorage.getItem('dnf-player-id');
    if (!playerId) {
      playerId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('dnf-player-id', playerId);
    }
    return playerId;
  }

  private saveState(state: GameRoom) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(state),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  onStateUpdate(callback: (state: GameRoom) => void) {
    this.listeners.add(callback);
    if (this.gameState) {
      callback(this.gameState);
    }
    return () => this.listeners.delete(callback);
  }

  getState(): GameRoom | null {
    return this.gameState;
  }

  getRole(): PlayerRole | null {
    return this.role;
  }

  sendMessage(message: GameMessage) {
    if (!this.gameState || !this.role) return;

    const newState = { ...this.gameState };

    // Handle different message types
    switch (message.type) {
      case 'player:joined':
        if (message.player === this.role) {
          newState.players[this.role].name = message.name;
          newState.players[this.role].connected = true;
        }
        break;

      case 'player:disconnected':
        if (message.player === this.role) {
          newState.players[this.role].connected = false;
        }
        break;

      case 'game:started':
        if (this.role === 'host') {
          newState.status = 'playing';
          newState.currentRound = 0;
          newState.currentQuestion = 0;
          newState.roundPhase = 'betting';
        }
        break;

      case 'bet:placed':
        if (message.player === this.role) {
          newState.bets[this.role] = message.amount;
        }
        break;

      case 'answer:submitted':
        if (message.player === this.role) {
          newState.answers[this.role] = message.answer;
        }
        break;

      case 'powerup:activated':
        if (message.player === this.role) {
          newState.activePowerups[this.role] = message.powerup;
          newState.players[this.role].powerups[message.powerup] = false;
        }
        break;

      case 'buzzer:pressed':
        if (!newState.buzzedPlayer) {
          newState.buzzedPlayer = message.player;
        }
        break;

      case 'question:revealed':
        if (this.role === 'host') {
          newState.roundPhase = 'reveal';
        }
        break;

      case 'round:advanced':
        if (this.role === 'host') {
          newState.currentQuestion += 1;
          const currentRound = rounds[newState.currentRound];
          if (currentRound?.questions && newState.currentQuestion >= currentRound.questions.length) {
            newState.currentRound += 1;
            newState.currentQuestion = 0;
            if (newState.currentRound >= rounds.length) {
              newState.status = 'finished';
            }
          }
          newState.roundPhase = 'betting';
          newState.bets = { host: 10, guest: 10 };
          newState.answers = { host: null, guest: null };
          newState.buzzedPlayer = null;
          newState.activePowerups = { host: null, guest: null };
        }
        break;

      case 'admin:jump-round':
        if (this.role === 'host') {
          newState.currentRound = message.round;
          newState.currentQuestion = 0;
          newState.roundPhase = 'betting';
        }
        break;

      case 'admin:jump-question':
        if (this.role === 'host') {
          newState.currentQuestion = message.question;
          newState.roundPhase = 'betting';
        }
        break;

      case 'admin:set-coins':
        if (this.role === 'host') {
          newState.players.host.coins = message.host;
          newState.players.guest.coins = message.guest;
        }
        break;

      case 'admin:reset-powerups':
        if (this.role === 'host') {
          const initialPowerups = {
            drs: true,
            'safety-car': true,
            'red-flag': true,
            'hard-tyres': true,
            undercut: true,
            'team-radio': true,
          };
          newState.players.host.powerups = { ...initialPowerups };
          newState.players.guest.powerups = { ...initialPowerups };
        }
        break;

      case 'admin:skip-question':
        if (this.role === 'host') {
          newState.currentQuestion += 1;
          newState.roundPhase = 'betting';
        }
        break;

      case 'admin:force-reveal':
        if (this.role === 'host') {
          newState.roundPhase = 'reveal';
        }
        break;

      case 'admin:end-game':
        if (this.role === 'host') {
          newState.status = 'finished';
        }
        break;
    }

    this.saveState(newState);
    this.updateState(newState);
  }

  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    }

    // Mark as disconnected
    if (this.gameState && this.role) {
      const newState = { ...this.gameState };
      newState.players[this.role].connected = false;
      this.saveState(newState);
    }
  }
}


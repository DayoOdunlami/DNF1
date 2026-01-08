import type { Party, Connection } from "partykit/server";
import type { GameMessage, GameRoom, PlayerRole } from "../lib/types";
import { createInitialGameRoom } from "../lib/gameState";

export default class GameRoomServer implements Party {
  private gameState: GameRoom | undefined;
  private hostConnectionId: string | undefined;
  private connections: Set<string> = new Set();
  
  constructor(readonly party: Party) {}

  onConnect(conn: Connection) {
    console.log(`Connection: ${conn.id} to room: ${this.party.id}`);
    this.connections.add(conn.id);
    
    // If no state exists and this is the first connection, make them host
    if (!this.gameState && this.connections.size === 1) {
      this.hostConnectionId = conn.id;
      const roomId = this.party.id;
      this.gameState = createInitialGameRoom(roomId, conn.id);
      // Broadcast initial state
      this.broadcast({ type: 'state:update', state: this.gameState });
    }
  }

  onClose(conn: Connection) {
    console.log(`Disconnection: ${conn.id} from room: ${this.party.id}`);
    this.connections.delete(conn.id);
    
    // If host disconnects, mark them as disconnected
    if (this.gameState && conn.id === this.gameState.hostId) {
      this.gameState.players.host.connected = false;
      this.broadcast({ type: 'state:update', state: this.gameState });
    } else if (this.gameState) {
      // Guest disconnected
      this.gameState.players.guest.connected = false;
      this.broadcast({ type: 'state:update', state: this.gameState });
    }
  }

  onMessage(message: string, sender: Connection) {
    try {
      const msg: GameMessage = JSON.parse(message);
      const roomId = this.party.id;
      
      // Handle state request
      if (msg.type === 'state:request') {
        let assignedRole: PlayerRole | null = null;
        
        if (this.gameState) {
          // State exists - determine role based on connections
          if (!this.gameState.players.host.connected) {
            // No host yet, this person becomes host
            this.hostConnectionId = sender.id;
            this.gameState.hostId = sender.id;
            this.gameState.players.host.connected = true;
            assignedRole = 'host';
            this.broadcast({ type: 'state:update', state: this.gameState });
          } else if (!this.gameState.players.guest.connected) {
            // Host exists, this person becomes guest
            this.gameState.players.guest.connected = true;
            assignedRole = 'guest';
            this.broadcast({ type: 'state:update', state: this.gameState });
          } else {
            // Both slots taken - assign based on connection ID
            if (sender.id === this.gameState.hostId) {
              assignedRole = 'host';
              this.gameState.players.host.connected = true;
            } else {
              assignedRole = 'guest';
              this.gameState.players.guest.connected = true;
            }
            this.broadcast({ type: 'state:update', state: this.gameState });
          }
          // Send current state to requester with their assigned role
          sender.send(JSON.stringify({ 
            type: 'state:update', 
            state: this.gameState,
            yourRole: assignedRole 
          }));
        } else {
          // No state exists yet - create initial state with this connection as host
          if (!this.hostConnectionId) {
            this.hostConnectionId = sender.id;
          }
          const newState = createInitialGameRoom(roomId, this.hostConnectionId);
          newState.players.host.connected = true;
          this.gameState = newState;
          assignedRole = 'host';
          this.broadcast({ type: 'state:update', state: newState });
          // Send state with role assignment
          sender.send(JSON.stringify({ 
            type: 'state:update', 
            state: newState,
            yourRole: 'host'
          }));
        }
        return;
      }
      
      // Get current state from memory or create new
      let currentState = this.gameState;
      
      let newState: GameRoom;
      
      if (!currentState) {
        // Fallback: if player:joined arrives before state:request (shouldn't happen with new flow)
        if (msg.type === 'player:joined' && msg.player === 'host') {
          this.hostConnectionId = sender.id;
          newState = createInitialGameRoom(roomId, sender.id);
          newState.players.host.name = msg.name;
          newState.players.host.connected = true;
          this.gameState = newState;
          this.broadcast({ type: 'state:update', state: newState });
        } else if (msg.type === 'player:joined' && msg.player === 'guest') {
          // Guest joined but no room exists - create one with guest as placeholder
          if (!this.hostConnectionId) {
            this.hostConnectionId = 'pending-host';
          }
          newState = createInitialGameRoom(roomId, this.hostConnectionId);
          newState.players.guest.name = msg.name;
          newState.players.guest.connected = true;
          this.gameState = newState;
          this.broadcast({ type: 'state:update', state: newState });
        }
        return;
      }
      
      newState = { ...currentState };
      
      switch (msg.type) {
        case 'player:joined':
          if (msg.player === 'host') {
            // If hostId matches or this is first host connection
            if (sender.id === currentState.hostId || !currentState.players.host.connected) {
              if (sender.id !== currentState.hostId) {
                newState.hostId = sender.id;
                this.hostConnectionId = sender.id;
              }
              newState.players.host.name = msg.name;
              newState.players.host.connected = true;
            }
          } else if (msg.player === 'guest') {
            newState.players.guest.name = msg.name;
            newState.players.guest.connected = true;
          }
          break;
          
        case 'player:disconnected':
          if (msg.player === 'host') {
            newState.players.host.connected = false;
          } else {
            newState.players.guest.connected = false;
          }
          break;
          
        case 'game:started':
          if (sender.id === currentState.hostId) {
            newState.status = 'playing';
            newState.currentRound = 0;
            newState.currentQuestion = 0;
            newState.roundPhase = 'betting';
          }
          break;
          
        case 'bet:placed':
          if (msg.player === 'host') {
            newState.bets.host = msg.amount;
          } else {
            newState.bets.guest = msg.amount;
          }
          break;
          
        case 'answer:submitted':
          if (msg.player === 'host') {
            newState.answers.host = msg.answer;
          } else {
            newState.answers.guest = msg.answer;
          }
          break;
          
        case 'powerup:activated':
          if (msg.player === 'host') {
            newState.activePowerups.host = msg.powerup;
            newState.players.host.powerups[msg.powerup] = false;
          } else {
            newState.activePowerups.guest = msg.powerup;
            newState.players.guest.powerups[msg.powerup] = false;
          }
          break;
          
        case 'buzzer:pressed':
          if (!newState.buzzedPlayer) {
            newState.buzzedPlayer = msg.player;
          }
          break;
          
        case 'question:revealed':
          if (sender.id === currentState.hostId) {
            newState.roundPhase = 'reveal';
          }
          break;
          
        case 'round:advanced':
          if (sender.id === currentState.hostId) {
            newState.currentQuestion += 1;
            
            // Check if we need to move to next round
            const currentRound = require('../lib/questions').rounds[newState.currentRound];
            if (newState.currentQuestion >= currentRound.questions.length) {
              newState.currentRound += 1;
              newState.currentQuestion = 0;
              
              // Check if game is finished
              if (newState.currentRound >= require('../lib/questions').rounds.length) {
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
          if (sender.id === currentState.hostId) {
            newState.currentRound = msg.round;
            newState.currentQuestion = 0;
            newState.roundPhase = 'betting';
          }
          break;
          
        case 'admin:jump-question':
          if (sender.id === currentState.hostId) {
            newState.currentQuestion = msg.question;
            newState.roundPhase = 'betting';
          }
          break;
          
        case 'admin:set-coins':
          if (sender.id === currentState.hostId) {
            newState.players.host.coins = msg.host;
            newState.players.guest.coins = msg.guest;
          }
          break;
          
        case 'admin:reset-powerups':
          if (sender.id === currentState.hostId) {
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
          if (sender.id === currentState.hostId) {
            newState.currentQuestion += 1;
            newState.roundPhase = 'betting';
          }
          break;
          
        case 'admin:force-reveal':
          if (sender.id === currentState.hostId) {
            newState.roundPhase = 'reveal';
          }
          break;
          
        case 'admin:end-game':
          if (sender.id === currentState.hostId) {
            newState.status = 'finished';
          }
          break;
      }
      
      // Save state and broadcast
      this.gameState = newState;
      this.broadcast({ type: 'state:update', state: newState });
      
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
  
  broadcast(message: GameMessage) {
    const messageStr = JSON.stringify(message);
    this.party.broadcast(messageStr);
  }
}


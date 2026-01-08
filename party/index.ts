import type { Party, Connection } from "partykit/server";
import type { GameMessage, GameRoom, PlayerRole } from "../lib/types";
import { createInitialGameRoom } from "../lib/gameState";

export default class GameRoomServer implements Party {
  private gameState: GameRoom | undefined;
  
  constructor(readonly party: Party) {}

  onConnect(conn: Connection) {
    console.log(`Connection: ${conn.id} to room: ${this.party.id}`);
  }

  onMessage(message: string, sender: Connection) {
    try {
      const msg: GameMessage = JSON.parse(message);
      const roomId = this.party.id;
      
      // Handle state request
      if (msg.type === 'state:request') {
        if (this.gameState) {
          sender.send(JSON.stringify({ type: 'state:update', state: this.gameState }));
        }
        return;
      }
      
      // Get current state from memory or create new
      let currentState = this.gameState;
      
      let newState: GameRoom;
      
      if (!currentState) {
        // First connection - host creates the room
        if (msg.type === 'player:joined' && msg.player === 'host') {
          newState = createInitialGameRoom(roomId, sender.id);
          newState.players.host.name = msg.name;
          newState.players.host.connected = true;
          this.gameState = newState;
          this.broadcast({ type: 'state:update', state: newState });
        } else if (msg.type === 'player:joined' && msg.player === 'guest') {
          // Guest joined but no room exists - create one with guest as placeholder
          newState = createInitialGameRoom(roomId, 'pending-host');
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


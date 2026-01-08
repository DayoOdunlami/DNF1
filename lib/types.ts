export type PlayerRole = 'host' | 'guest';

export type GameStatus = 'lobby' | 'playing' | 'finished';

export type RoundType = 'mr-mrs' | 'confidence' | 'video' | 'race';

export type RoundPhase = 'betting' | 'answering' | 'reveal' | 'results';

export type TyreType = 'soft' | 'medium' | 'hard';

export type PowerupType = 'drs' | 'safety-car' | 'red-flag' | 'hard-tyres' | 'undercut' | 'team-radio';

export interface PowerupState {
  drs: boolean;
  'safety-car': boolean;
  'red-flag': boolean;
  'hard-tyres': boolean;
  undercut: boolean;
  'team-radio': boolean;
}

export interface Player {
  name: string;
  coins: number;
  powerups: PowerupState;
  connected: boolean;
}

export interface GameRoom {
  id: string;
  hostId: string;
  status: GameStatus;
  players: {
    host: Player;
    guest: Player;
  };
  currentRound: number;
  currentQuestion: number;
  roundPhase: RoundPhase;
  bets: { host: number; guest: number };
  answers: { host: any; guest: any };
  activePowerups: { host: PowerupType | null; guest: PowerupType | null };
  buzzedPlayer: 'host' | 'guest' | null;
  tyreSelection: TyreType;
}

export interface MrMrsQuestion {
  question: string;
  forPlayer: 'both';
}

export interface ConfidenceQuestion {
  question: string;
  answer: number;
  hint: string;
  ranges: { soft: number; medium: number; hard: number };
}

export interface VideoQuestion {
  title: string;
  description: string;
  videoId: string;
  startTime: number;
  pauseTime: number;
  options: string[];
  correct: number;
  hint: string;
}

export interface Round {
  name: string;
  subtitle: string;
  type: RoundType;
  questions: MrMrsQuestion[] | ConfidenceQuestion[] | VideoQuestion[] | [];
}

export type GameMessage =
  | { type: 'player:joined'; player: PlayerRole; name: string }
  | { type: 'player:disconnected'; player: PlayerRole }
  | { type: 'player:reconnected'; player: PlayerRole }
  | { type: 'game:started' }
  | { type: 'bet:placed'; player: PlayerRole; amount: number }
  | { type: 'answer:submitted'; player: PlayerRole; answer: any }
  | { type: 'powerup:activated'; player: PlayerRole; powerup: PowerupType }
  | { type: 'buzzer:pressed'; player: PlayerRole }
  | { type: 'question:revealed' }
  | { type: 'round:advanced' }
  | { type: 'game:ended' }
  | { type: 'state:request' }
  | { type: 'state:update'; state: Partial<GameRoom> | GameRoom }
  | { type: 'admin:jump-round'; round: number }
  | { type: 'admin:jump-question'; question: number }
  | { type: 'admin:set-coins'; host: number; guest: number }
  | { type: 'admin:reset-powerups' }
  | { type: 'admin:skip-question' }
  | { type: 'admin:force-reveal' }
  | { type: 'admin:end-game' };


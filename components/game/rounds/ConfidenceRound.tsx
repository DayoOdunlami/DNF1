'use client';

import { useState } from 'react';
import type { GameRoom, GameMessage, PlayerRole, TyreType } from '@/lib/types';
import { rounds } from '@/lib/questions';

interface ConfidenceRoundProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
  question: { question: string; answer: number; hint: string; ranges: { soft: number; medium: number; hard: number } };
}

export default function ConfidenceRound({ gameState, role, sendMessage, question }: ConfidenceRoundProps) {
  const [betAmount, setBetAmount] = useState(gameState.bets[role]);
  const [guess, setGuess] = useState<number | ''>('');
  const [tyreSelection, setTyreSelection] = useState<TyreType>(gameState.tyreSelection);
  const currentRound = rounds[gameState.currentRound];
  const totalQuestions = currentRound?.questions.length || 0;

  const handleBetChange = (delta: number) => {
    const newBet = Math.max(5, Math.min(gameState.players[role].coins, betAmount + delta));
    setBetAmount(newBet);
    sendMessage({ type: 'bet:placed', player: role, amount: newBet });
  };

  const handleSubmit = () => {
    if (guess !== '') {
      sendMessage({ type: 'answer:submitted', player: role, answer: { guess, tyre: tyreSelection } });
    }
  };

  const range = question.ranges[tyreSelection];
  const multiplier = tyreSelection === 'soft' ? 3 : tyreSelection === 'medium' ? 2 : 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < gameState.currentQuestion ? 'bg-neon-green' : 
              i === gameState.currentQuestion ? 'bg-neon-red' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">Confidence Trivia</h3>
        <p className="text-gray-400 font-rajdhani">Question {gameState.currentQuestion + 1} of {totalQuestions}</p>
      </div>

      <div className="text-2xl text-center mb-8 font-rajdhani font-medium">{question.question}</div>

      {gameState.activePowerups.host === 'team-radio' || gameState.activePowerups.guest === 'team-radio' ? (
        <div className="bg-neon-blue/10 border border-neon-blue rounded-xl p-4 mb-6">
          <div className="text-xs text-neon-blue mb-2 font-rajdhani uppercase">📻 Team Radio Hint</div>
          <div className="text-sm font-rajdhani">{question.hint}</div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
        <button
          onClick={() => setTyreSelection('soft')}
          className={`px-6 py-3 rounded-full border-2 font-rajdhani font-semibold uppercase transition-all ${
            tyreSelection === 'soft'
              ? 'bg-neon-red border-neon-red text-white shadow-lg shadow-neon-red/50'
              : 'border-neon-red text-neon-red hover:bg-neon-red/20'
          }`}
        >
          🔴 Soft (±{question.ranges.soft}) 3x
        </button>
        <button
          onClick={() => setTyreSelection('medium')}
          className={`px-6 py-3 rounded-full border-2 font-rajdhani font-semibold uppercase transition-all ${
            tyreSelection === 'medium'
              ? 'bg-neon-yellow border-neon-yellow text-dark-bg shadow-lg shadow-neon-yellow/50'
              : 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20'
          }`}
        >
          🟡 Medium (±{question.ranges.medium}) 2x
        </button>
        <button
          onClick={() => setTyreSelection('hard')}
          className={`px-6 py-3 rounded-full border-2 font-rajdhani font-semibold uppercase transition-all ${
            tyreSelection === 'hard'
              ? 'bg-gray-500 border-gray-500 text-white shadow-lg'
              : 'border-gray-500 text-gray-400 hover:bg-gray-500/20'
          }`}
        >
          ⚪ Hard (±{question.ranges.hard}) 1x
        </button>
      </div>
      <p className="text-center text-sm text-gray-400 font-rajdhani mb-6">
        Narrower range = Higher risk = More points!
      </p>

      <div className="bg-black/30 rounded-xl p-6 mb-6">
        <div className="text-sm text-gray-400 mb-4 text-center font-rajdhani uppercase">
          Set your bet
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => handleBetChange(-5)}
            className="w-10 h-10 rounded-full border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-colors font-rajdhani text-xl"
          >
            −
          </button>
          <div className="text-3xl font-bold font-orbitron min-w-[100px] text-center">
            {betAmount}
          </div>
          <button
            onClick={() => handleBetChange(5)}
            className="w-10 h-10 rounded-full border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-dark-bg transition-colors font-rajdhani text-xl"
          >
            +
          </button>
        </div>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Your guess"
          className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-4 py-3 font-orbitron text-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors text-center"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={guess === ''}
        className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Lock In Answer 🔒
      </button>
    </div>
  );
}



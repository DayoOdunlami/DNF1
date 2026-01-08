'use client';

import { useState } from 'react';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { rounds } from '@/lib/questions';

interface MrMrsRoundProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
  question: { question: string; forPlayer: 'both' };
}

export default function MrMrsRound({ gameState, role, sendMessage, question }: MrMrsRoundProps) {
  const [myAnswer, setMyAnswer] = useState('');
  const [betAmount, setBetAmount] = useState(gameState.bets[role]);
  const currentRound = rounds[gameState.currentRound];
  const totalQuestions = currentRound?.questions?.length || 0;

  const handleBetChange = (delta: number) => {
    const newBet = Math.max(5, Math.min(gameState.players[role].coins, betAmount + delta));
    setBetAmount(newBet);
    sendMessage({ type: 'bet:placed', player: role, amount: newBet });
  };

  const handleReveal = () => {
    if (role === 'host') {
      sendMessage({ type: 'question:revealed' });
    }
  };

  const handleAwardPoints = (winner: 'both' | 'host' | 'guest' | 'none') => {
    if (role === 'host') {
      // Calculate and apply points
      const { calculateMrMrsPoints } = require('@/lib/gameLogic');
      const points = calculateMrMrsPoints(gameState, winner);
      
      // Update coins via admin command (simplified - in production this would be server-side)
      sendMessage({
        type: 'admin:set-coins',
        host: gameState.players.host.coins + points.host,
        guest: gameState.players.guest.coins + points.guest,
      });
      
      // Advance to next question after a short delay
      setTimeout(() => {
        sendMessage({ type: 'round:advanced' });
      }, 1500);
    }
  };

  if (gameState.roundPhase === 'reveal') {
    const hostAnswer = gameState.answers.host || '(no answer)';
    const guestAnswer = gameState.answers.guest || '(no answer)';

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
          <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">Mr & Mrs</h3>
          <p className="text-gray-400 font-rajdhani">Question {gameState.currentQuestion + 1} of {totalQuestions}</p>
        </div>

        <div className="text-2xl text-center mb-8 font-rajdhani font-medium">{question.question}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-sm text-gray-400 mb-3 text-center font-rajdhani uppercase">
              {gameState.players.host.name} said:
            </h4>
            <div className="text-xl font-semibold text-center text-neon-red font-rajdhani">
              {hostAnswer}
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-sm text-gray-400 mb-3 text-center font-rajdhani uppercase">
              {gameState.players.guest.name} said:
            </h4>
            <div className="text-xl font-semibold text-center text-neon-blue font-rajdhani">
              {guestAnswer}
            </div>
          </div>
        </div>

        {role === 'host' && (
          <div className="text-center space-y-4">
            <p className="text-gray-400 font-rajdhani">Did the answers match?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleAwardPoints('both')}
                className="px-6 py-3 bg-transparent border-2 border-neon-blue rounded-full font-rajdhani font-semibold text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-colors"
              >
                ✅ Both Match!
              </button>
              <button
                onClick={() => handleAwardPoints('host')}
                className="px-6 py-3 bg-transparent border-2 border-neon-blue rounded-full font-rajdhani font-semibold text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-colors"
              >
                {gameState.players.host.name} Gets It
              </button>
              <button
                onClick={() => handleAwardPoints('guest')}
                className="px-6 py-3 bg-transparent border-2 border-neon-blue rounded-full font-rajdhani font-semibold text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-colors"
              >
                {gameState.players.guest.name} Gets It
              </button>
              <button
                onClick={() => handleAwardPoints('none')}
                className="px-6 py-3 bg-transparent border-2 border-neon-blue rounded-full font-rajdhani font-semibold text-neon-blue hover:bg-neon-blue hover:text-dark-bg transition-colors"
              >
                ❌ Neither
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

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
        <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">Mr & Mrs</h3>
        <p className="text-gray-400 font-rajdhani">Question {gameState.currentQuestion + 1} of {totalQuestions}</p>
      </div>

      <div className="text-2xl text-center mb-8 font-rajdhani font-medium">{question.question}</div>

      <div className="bg-black/30 rounded-xl p-6 mb-6">
        <div className="text-sm text-gray-400 mb-4 text-center font-rajdhani uppercase">
          How many coins are you betting?
        </div>
        <div className="flex items-center justify-center gap-4">
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
      </div>

      <div className="bg-black/30 rounded-xl p-6">
        <h4 className="text-sm text-gray-400 mb-4 text-center font-rajdhani uppercase">
          {gameState.players[role].name}'s Answer
        </h4>
        <input
          type="text"
          value={myAnswer}
          onChange={(e) => setMyAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-4 py-3 font-rajdhani text-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors text-center"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && myAnswer.trim()) {
              sendMessage({ type: 'answer:submitted', player: role, answer: myAnswer });
            }
          }}
        />
        <button
          onClick={() => {
            if (myAnswer.trim()) {
              sendMessage({ type: 'answer:submitted', player: role, answer: myAnswer });
            }
          }}
          disabled={!myAnswer.trim()}
          className="mt-4 w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-3 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lock In Answer 🔒
        </button>
      </div>

      {role === 'host' && gameState.answers.host && gameState.answers.guest && (
        <button
          onClick={handleReveal}
          className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
        >
          Reveal Answers 👀
        </button>
      )}
    </div>
  );
}


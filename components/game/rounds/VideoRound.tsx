'use client';

import { useState } from 'react';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { rounds } from '@/lib/questions';

interface VideoRoundProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
  question: {
    title: string;
    description: string;
    videoId: string;
    startTime: number;
    pauseTime: number;
    options: string[];
    correct: number;
    hint: string;
  };
}

export default function VideoRound({ gameState, role, sendMessage, question }: VideoRoundProps) {
  const [betAmount, setBetAmount] = useState(gameState.bets[role]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const currentRound = rounds[gameState.currentRound];
  const totalQuestions = currentRound?.questions.length || 0;

  const handleBetChange = (delta: number) => {
    const newBet = Math.max(5, Math.min(gameState.players[role].coins, betAmount + delta));
    setBetAmount(newBet);
    sendMessage({ type: 'bet:placed', player: role, amount: newBet });
  };

  const handleBuzzer = () => {
    sendMessage({ type: 'buzzer:pressed', player: role });
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    sendMessage({ type: 'answer:submitted', player: role, answer: index });
  };

  const handleReveal = () => {
    if (role === 'host') {
      sendMessage({ type: 'question:revealed' });
    }
  };

  const isBuzzed = gameState.buzzedPlayer === role;
  const canReveal = role === 'host' && gameState.answers.host !== null && gameState.answers.guest !== null;

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
        <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">What Happened Next?</h3>
        <p className="text-gray-400 font-rajdhani">{question.title}</p>
      </div>

      <div className="text-xl text-center mb-6 font-rajdhani">{question.description}</div>

      {gameState.activePowerups.host === 'team-radio' || gameState.activePowerups.guest === 'team-radio' ? (
        <div className="bg-neon-blue/10 border border-neon-blue rounded-xl p-4 mb-6">
          <div className="text-xs text-neon-blue mb-2 font-rajdhani uppercase">📻 Team Radio Hint</div>
          <div className="text-sm font-rajdhani">{question.hint}</div>
        </div>
      ) : null}

      <div className="relative w-full pb-[56.25%] mb-6 rounded-xl overflow-hidden bg-black">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${question.videoId}?start=${question.startTime}&enablejsapi=1&rel=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-center text-gray-400 font-rajdhani mb-6">
        Watch the clip, then pause when you're ready to guess!
      </p>

      <div className="bg-black/30 rounded-xl p-6 mb-6">
        <div className="text-sm text-gray-400 mb-4 text-center font-rajdhani uppercase">
          Place your bet before answering
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

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            className={`w-full text-left bg-white/5 border-2 rounded-xl p-4 font-rajdhani text-lg transition-all ${
              selectedAnswer === index
                ? 'border-neon-blue bg-neon-blue/20'
                : 'border-white/20 hover:border-neon-blue hover:bg-neon-blue/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
        <button
          onClick={handleBuzzer}
          disabled={!!gameState.buzzedPlayer}
          className={`w-full md:w-auto px-8 py-6 rounded-full border-4 font-orbitron font-bold uppercase transition-all ${
            role === 'host'
              ? `border-neon-red ${isBuzzed ? 'bg-neon-red text-white animate-buzzed' : 'bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white'}`
              : `border-neon-blue ${isBuzzed ? 'bg-neon-blue text-white animate-buzzed' : 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-white'}`
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {gameState.players[role].name}<br />BUZZ!
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 font-rajdhani mb-6">
        First to buzz gets 1.5x bonus if correct (but loses more if wrong!)
      </p>

      {canReveal && (
        <button
          onClick={handleReveal}
          className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
        >
          Reveal Answer 🎬
        </button>
      )}
    </div>
  );
}


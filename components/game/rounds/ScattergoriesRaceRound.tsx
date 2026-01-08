'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';
import { Haptics } from '@/components/utils/haptics';
import { playSound, playBeep } from '@/components/utils/sounds';

interface ScattergoriesRaceRoundProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
}

interface Category {
  letter: string;
  category: string;
}

const racingCategories: Category[] = [
  { letter: 'F', category: 'F1 Driver Names' },
  { letter: 'T', category: 'F1 Tracks' },
  { letter: 'C', category: 'Car Parts' },
  { letter: 'R', category: 'Racing Terms' },
  { letter: 'S', category: 'Speed Related Words' },
  { letter: 'P', category: 'Pit Stop Items' },
  { letter: 'W', category: 'Winners (F1 Champions)' },
  { letter: 'E', category: 'Engine Components' },
  { letter: 'L', category: 'Lap Related Words' },
  { letter: 'G', category: 'Grand Prix Locations' },
];

export default function ScattergoriesRaceRound({ gameState, role, sendMessage }: ScattergoriesRaceRoundProps) {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({ host: [] as string[], guest: [] as string[] });
  const [votingPhase, setVotingPhase] = useState(false);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState({ host: 0, guest: 0 });
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Get current category from game state or generate new one
  useEffect(() => {
    if (gameState.currentQuestion < racingCategories.length) {
      setCurrentCategory(racingCategories[gameState.currentQuestion]);
    }
  }, [gameState.currentQuestion]);

  // Timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeLeft]);

  // Sync submitted answers from game state
  useEffect(() => {
    if (gameState.answers.host && Array.isArray(gameState.answers.host)) {
      setSubmittedAnswers({
        host: gameState.answers.host,
        guest: (gameState.answers.guest as string[]) || [],
      });
    }
  }, [gameState.answers]);

  const handleStart = () => {
    if (role === 'host') {
      setIsPlaying(true);
      setTimeLeft(120);
      setAnswers([]);
      setCurrentInput('');
      setVotingPhase(false);
      setVotes({});
      setTypingSpeed(0);
      setWordsTyped(0);
      startTimeRef.current = Date.now();
      sendMessage({ type: 'game:started' });
      Haptics.race();
      try {
        playSound('race-start');
      } catch {
        playBeep(600, 200);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    // Submit answers
    const finalAnswers = [...answers];
    sendMessage({ type: 'answer:submitted', player: role, answer: finalAnswers });
    
    // Move to voting phase if both submitted
    if (role === 'host') {
      setTimeout(() => {
        setVotingPhase(true);
      }, 2000);
    }
  };

  const handleAddAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      const trimmed = currentInput.trim().toLowerCase();
      
      // Check for duplicates
      if (answers.some(a => a.toLowerCase() === trimmed)) {
        Haptics.error();
        return;
      }

      // Check if starts with correct letter
      if (!trimmed.startsWith(currentCategory?.letter.toLowerCase() || '')) {
        Haptics.error();
        playBeep(300, 100);
        return;
      }

      setAnswers([...answers, currentInput.trim()]);
      setWordsTyped(wordsTyped + 1);
      setCurrentInput('');
      Haptics.light();
      try {
        playSound('click');
      } catch {
        playBeep(400, 50);
      }
      
      // Calculate typing speed (words per minute)
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
        setTypingSpeed(Math.round((wordsTyped + 1) / elapsed));
      }
    }
  };

  const handleVote = (answer: string, player: PlayerRole, isValid: boolean) => {
    if (role === player) return; // Can't vote on own answers
    
    const voteKey = `${player}-${answer}`;
    setVotes({ ...votes, [voteKey]: isValid });
    
    // Send vote to server
    sendMessage({ 
      type: 'answer:submitted', 
      player: role, 
      answer: { type: 'vote', answer, player, isValid } 
    });
    
    Haptics.medium();
  };

  // Calculate progress based on valid answers
  useEffect(() => {
    if (votingPhase) {
      const hostValid = Object.entries(votes)
        .filter(([key, valid]) => key.startsWith('host-') && valid)
        .length;
      const guestValid = Object.entries(votes)
        .filter(([key, valid]) => key.startsWith('guest-') && valid)
        .length;

      setProgress({ 
        host: (hostValid / Math.max(submittedAnswers.host.length, 1)) * 100,
        guest: (guestValid / Math.max(submittedAnswers.guest.length, 1)) * 100,
      });
    }
  }, [votes, votingPhase, submittedAnswers]);

  if (!currentCategory) {
    return <div className="text-center text-gray-400">Loading category...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">🏁 Scattergories Race</h3>
        <p className="text-gray-400 font-rajdhani">Type answers starting with the letter!</p>
      </div>

      {!isPlaying && !votingPhase && (
        <div className="text-center">
          {role === 'host' ? (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-12 font-orbitron text-lg font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Start Race! 🚦
            </button>
          ) : (
            <p className="text-gray-400 font-rajdhani">Waiting for host to start...</p>
          )}
        </div>
      )}

      {isPlaying && (
        <>
          <div className="bg-neon-yellow/10 border-2 border-neon-yellow rounded-xl p-6 text-center mb-6">
            <div className="text-4xl font-orbitron font-black text-neon-yellow mb-2">
              {currentCategory.letter}
            </div>
            <div className="text-xl font-rajdhani font-semibold text-white mb-4">
              {currentCategory.category}
            </div>
            <div className="text-3xl font-orbitron font-black text-neon-yellow mb-2">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            {typingSpeed > 0 && (
              <div className="text-sm font-rajdhani text-gray-300">
                Typing: {typingSpeed} answers/min
              </div>
            )}
          </div>

          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleAddAnswer}
              placeholder={`Type answer starting with "${currentCategory.letter}"...`}
              className="w-full bg-white/10 border-2 border-neon-blue rounded-xl px-6 py-4 font-rajdhani text-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-yellow transition-colors"
              autoFocus
            />

            <div className="bg-black/30 rounded-xl p-4 min-h-[200px]">
              <div className="text-sm text-gray-400 mb-2 font-rajdhani">Your Answers ({answers.length}):</div>
              <div className="flex flex-wrap gap-2">
                {answers.map((answer, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1 bg-neon-green/20 border border-neon-green rounded-lg font-rajdhani text-sm"
                  >
                    {answer}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {votingPhase && (
        <div className="space-y-6">
          <h4 className="font-orbitron text-xl text-neon-yellow text-center">
            Vote on Answers - Valid answers move the car forward!
          </h4>

          {/* Host Answers */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-sm text-neon-red mb-3 font-rajdhani font-semibold">
              {gameState.players.host.name}'s Answers:
            </div>
            <div className="space-y-2">
              {submittedAnswers.host.map((answer, idx) => {
                const voteKey = `host-${answer}`;
                const voted = voteKey in votes;
                const isValid = votes[voteKey];
                
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 font-rajdhani">{answer}</span>
                    {role === 'guest' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(answer, 'host', true)}
                          disabled={voted}
                          className={`px-3 py-1 rounded ${voted && isValid ? 'bg-neon-green text-white' : 'bg-white/10 text-gray-400'} font-rajdhani text-sm`}
                        >
                          ✓ Valid
                        </button>
                        <button
                          onClick={() => handleVote(answer, 'host', false)}
                          disabled={voted}
                          className={`px-3 py-1 rounded ${voted && !isValid ? 'bg-neon-red text-white' : 'bg-white/10 text-gray-400'} font-rajdhani text-sm`}
                        >
                          ✗ Invalid
                        </button>
                      </div>
                    )}
                    {role === 'host' && (
                      <span className="text-gray-500 font-rajdhani text-sm">
                        {voted ? (isValid ? '✓ Valid' : '✗ Invalid') : 'Waiting...'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guest Answers */}
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-sm text-neon-blue mb-3 font-rajdhani font-semibold">
              {gameState.players.guest.name}'s Answers:
            </div>
            <div className="space-y-2">
              {submittedAnswers.guest.map((answer, idx) => {
                const voteKey = `guest-${answer}`;
                const voted = voteKey in votes;
                const isValid = votes[voteKey];
                
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 font-rajdhani">{answer}</span>
                    {role === 'host' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(answer, 'guest', true)}
                          disabled={voted}
                          className={`px-3 py-1 rounded ${voted && isValid ? 'bg-neon-green text-white' : 'bg-white/10 text-gray-400'} font-rajdhani text-sm`}
                        >
                          ✓ Valid
                        </button>
                        <button
                          onClick={() => handleVote(answer, 'guest', false)}
                          disabled={voted}
                          className={`px-3 py-1 rounded ${voted && !isValid ? 'bg-neon-red text-white' : 'bg-white/10 text-gray-400'} font-rajdhani text-sm`}
                        >
                          ✗ Invalid
                        </button>
                      </div>
                    )}
                    {role === 'guest' && (
                      <span className="text-gray-500 font-rajdhani text-sm">
                        {voted ? (isValid ? '✓ Valid' : '✗ Invalid') : 'Waiting...'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Race Progress */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-rajdhani font-semibold text-neon-red">
                  {gameState.players.host.name}
                </span>
                <span className="font-rajdhani text-gray-400">
                  {Math.round(progress.host)}% Complete
                </span>
              </div>
              <div className="h-6 bg-black/30 rounded-full overflow-hidden border-2 border-neon-red/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.host}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-neon-red to-neon-yellow"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-rajdhani font-semibold text-neon-blue">
                  {gameState.players.guest.name}
                </span>
                <span className="font-rajdhani text-gray-400">
                  {Math.round(progress.guest)}% Complete
                </span>
              </div>
              <div className="h-6 bg-black/30 rounded-full overflow-hidden border-2 border-neon-blue/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.guest}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-green"
                />
              </div>
            </div>
          </div>

          {role === 'host' && Object.keys(votes).length >= (submittedAnswers.host.length + submittedAnswers.guest.length) && (
            <button
              onClick={() => {
                // Calculate winner and award points
                const hostPoints = Object.entries(votes)
                  .filter(([key, valid]) => key.startsWith('host-') && valid).length * 10;
                const guestPoints = Object.entries(votes)
                  .filter(([key, valid]) => key.startsWith('guest-') && valid).length * 10;
                
                sendMessage({
                  type: 'admin:set-coins',
                  host: gameState.players.host.coins + hostPoints,
                  guest: gameState.players.guest.coins + guestPoints,
                });
                
                setTimeout(() => {
                  sendMessage({ type: 'round:advanced' });
                }, 2000);
              }}
              className="w-full bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-4 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Next Round ➡️
            </button>
          )}
        </div>
      )}
    </div>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { GameRoom, GameMessage, PlayerRole } from '@/lib/types';

interface RaceRoundProps {
  gameState: GameRoom;
  role: PlayerRole;
  sendMessage: (message: GameMessage) => void;
}

export default function RaceRound({ gameState, role, sendMessage }: RaceRoundProps) {
  const [clicks, setClicks] = useState({ host: 0, guest: 0 });
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<'host' | 'guest' | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Sync clicks from game state if available
    if (gameState.answers.host !== null) {
      setClicks({ host: gameState.answers.host, guest: gameState.answers.guest || 0 });
    }
  }, [gameState.answers]);

  useEffect(() => {
    if (isRacing && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRacing(false);
            handleRaceEnd();
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
  }, [isRacing, timeLeft]);

  const handleStart = () => {
    if (role === 'host') {
      setIsRacing(true);
      setTimeLeft(10);
      setClicks({ host: 0, guest: 0 });
      setWinner(null);
      startTimeRef.current = Date.now();
      sendMessage({ type: 'game:started' });
    }
  };

  const handleClick = () => {
    if (!isRacing) return;

    const newClicks = {
      ...clicks,
      [role]: clicks[role] + 1,
    };
    setClicks(newClicks);
    sendMessage({ type: 'answer:submitted', player: role, answer: newClicks[role] });
  };

  const handleRaceEnd = () => {
    const finalClicks = {
      host: gameState.answers.host || clicks.host,
      guest: gameState.answers.guest || clicks.guest,
    };

    const raceWinner = finalClicks.host > finalClicks.guest ? 'host' : 
                      finalClicks.guest > finalClicks.host ? 'guest' : null;
    setWinner(raceWinner);

    // Calculate points (winner gets 50 coins, loser gets 0)
    if (raceWinner && role === 'host') {
      const points = { host: raceWinner === 'host' ? 50 : 0, guest: raceWinner === 'guest' ? 50 : 0 };
      sendMessage({
        type: 'admin:set-coins',
        host: gameState.players.host.coins + points.host,
        guest: gameState.players.guest.coins + points.guest,
      });
    }
  };

  const targetClicks = 50;
  const hostProgress = Math.min((clicks.host / targetClicks) * 100, 100);
  const guestProgress = Math.min((clicks.guest / targetClicks) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-orbitron text-2xl text-neon-yellow mb-2">🏁 Speed Race Challenge</h3>
        <p className="text-gray-400 font-rajdhani">First to 50 clicks wins!</p>
      </div>

      {!isRacing && !winner && (
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

      {isRacing && (
        <>
          <div className="text-center mb-6">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-6xl font-orbitron font-black text-neon-yellow"
            >
              {timeLeft}
            </motion.div>
            <p className="text-gray-400 font-rajdhani mt-2">Seconds remaining</p>
          </div>

          <div className="space-y-8">
            {/* Host Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-rajdhani font-semibold text-neon-red">
                  {gameState.players.host.name}: {clicks.host}
                </span>
                <span className="font-rajdhani text-gray-400">{targetClicks - clicks.host} to go</span>
              </div>
              <div className="h-8 bg-black/30 rounded-full overflow-hidden border-2 border-neon-red/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hostProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-neon-red to-neon-yellow"
                />
              </div>
            </div>

            {/* Guest Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-rajdhani font-semibold text-neon-blue">
                  {gameState.players.guest.name}: {clicks.guest}
                </span>
                <span className="font-rajdhani text-gray-400">{targetClicks - clicks.guest} to go</span>
              </div>
              <div className="h-8 bg-black/30 rounded-full overflow-hidden border-2 border-neon-blue/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${guestProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-green"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="w-full py-12 bg-gradient-to-r from-neon-red to-neon-yellow rounded-2xl font-orbitron text-3xl font-black text-white uppercase tracking-wider shadow-2xl hover:shadow-neon-yellow/50 transition-all"
          >
            🏎️ CLICK ME! 🏎️
          </motion.button>
        </>
      )}

      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h4 className="font-orbitron text-3xl text-neon-yellow">
            {gameState.players[winner].name} Wins! 🏆
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-2xl font-orbitron text-neon-red">{clicks.host}</div>
              <div className="text-sm text-gray-400 font-rajdhani">Host Clicks</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4">
              <div className="text-2xl font-orbitron text-neon-blue">{clicks.guest}</div>
              <div className="text-sm text-gray-400 font-rajdhani">Guest Clicks</div>
            </div>
          </div>
          {role === 'host' && (
            <button
              onClick={() => sendMessage({ type: 'round:advanced' })}
              className="mt-4 bg-gradient-to-r from-neon-red to-neon-yellow rounded-full py-3 px-8 font-orbitron font-bold text-white uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Next Round ➡️
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}


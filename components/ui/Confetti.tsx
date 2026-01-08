'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  type?: 'win' | 'celebration' | 'fireworks';
}

export default function Confetti({ trigger, type = 'celebration' }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      if (type === 'win') {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff1744', '#ffea00', '#00e5ff'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff1744', '#ffea00', '#00e5ff'],
        });
      } else if (type === 'fireworks') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff1744', '#ffea00', '#00e5ff', '#00e676', '#d500f9'],
        });
      } else {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }
    }, 250);
  }, [trigger, type]);

  return null;
}


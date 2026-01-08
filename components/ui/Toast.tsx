'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'border-neon-green bg-neon-green/20 text-neon-green',
    error: 'border-neon-red bg-neon-red/20 text-neon-red',
    info: 'border-neon-blue bg-neon-blue/20 text-neon-blue',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl border-2 ${colors[type]} backdrop-blur-sm shadow-2xl`}
        >
          <p className="font-rajdhani font-semibold text-lg">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Haptics } from '@/components/utils/haptics';
import Toast from './Toast';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = 'Copy Link', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowToast(true);
      Haptics.success();
      
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Date Night Grand Prix',
          text: 'Join me for a race!',
          url: text,
        });
        Haptics.success();
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          handleCopy(); // Fallback to copy
        }
      }
    } else {
      handleCopy(); // Fallback to copy
    }
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg font-rajdhani font-semibold text-white hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </motion.button>
        
        {navigator.share && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="px-4 py-2 bg-neon-blue/20 border border-neon-blue rounded-lg font-rajdhani font-semibold text-neon-blue hover:bg-neon-blue/30 transition-colors flex items-center gap-2"
          >
            📤 Share
          </motion.button>
        )}
      </div>
      
      {showToast && (
        <Toast
          message="Link copied! Send this to your co-driver 🏎️"
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}


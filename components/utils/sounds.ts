/**
 * Simple sound effects utility
 * Uses Web Audio API for lightweight sound playback
 */

type SoundType = 'click' | 'buzzer' | 'win' | 'lose' | 'race-start' | 'race-click';

const soundPaths: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  buzzer: '/sounds/buzzer.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  'race-start': '/sounds/race-start.mp3',
  'race-click': '/sounds/race-click.mp3',
};

const audioCache: Map<SoundType, HTMLAudioElement> = new Map();

function getAudio(type: SoundType): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCache.has(type)) {
    const audio = new Audio(soundPaths[type]);
    audio.volume = 0.3; // Keep it subtle
    audioCache.set(type, audio);
  }
  
  return audioCache.get(type) || null;
}

export function playSound(type: SoundType) {
  const audio = getAudio(type);
  if (audio) {
    audio.currentTime = 0; // Reset to start
    audio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  }
}

// Fallback: Generate simple beep sounds if audio files don't exist
export function playBeep(frequency = 800, duration = 100) {
  if (typeof window === 'undefined') return;
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}



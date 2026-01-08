/**
 * Simple haptic feedback utility
 * Works on mobile devices with vibration API
 */

export function vibrate(pattern: number | number[] = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export const Haptics = {
  // Light tap for normal actions
  light: () => vibrate(10),
  
  // Medium tap for important actions
  medium: () => vibrate(20),
  
  // Strong vibration for big events
  strong: () => vibrate([30, 40, 30]),
  
  // Success pattern
  success: () => vibrate([20, 30, 20, 30]),
  
  // Error pattern
  error: () => vibrate([50, 30, 50]),
  
  // Race/buzzer pattern
  race: () => vibrate([15, 10, 15, 10, 15]),
};


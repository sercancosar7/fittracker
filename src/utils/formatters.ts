/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format seconds into a human readable string like "1h 23m" or "45m"
 */
export function formatDurationShort(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format a weight value with unit
 */
export function formatWeight(kg: number, unit: 'kg' | 'lbs' = 'kg'): string {
  if (unit === 'lbs') {
    const lbs = kg * 2.20462;
    return `${Math.round(lbs * 10) / 10} lbs`;
  }
  // remove trailing zeros but keep one decimal if needed
  const formatted = kg % 1 === 0 ? kg.toString() : kg.toFixed(1);
  return `${formatted} kg`;
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Format a date relative to now
 * "Today", "Yesterday", "3 days ago", "Jan 15", etc.
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Format date as "Mon, Jan 15"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Calculate total volume (sets * reps * weight) for an array of exercise sets
 */
export function calculateVolume(sets: Array<{ reps: number; weight: number; completed: boolean }>): number {
  return sets.reduce((total, set) => {
    if (!set.completed) return total;
    return total + set.reps * set.weight;
  }, 0);
}

/**
 * Get a percentage and cap it at 100
 */
export function clampPercentage(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(Math.round((value / max) * 100), 100);
}

/**
 * Format calories with "kcal" suffix
 */
export function formatCalories(cal: number): string {
  return `${Math.round(cal)} kcal`;
}

/**
 * Mock API service - simulates Firebase/backend calls.
 * In production this would connect to Firebase Firestore or a REST API.
 *
 * For now everything is stored locally via AsyncStorage, but the interface
 * is designed so we can swap in real API calls later without changing
 * the hooks/screens.
 */

import { WorkoutLog, UserProfile, WeeklyStats } from '../types';
import * as storage from './storage';

// simulate network latency for realistic feel
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ─── Auth ────────────────────────────────────────────────────

// TODO: wire up firebase auth
export async function signIn(_email: string, _password: string): Promise<{ userId: string }> {
  await delay(800);
  // mock - always succeeds
  return { userId: 'user_001' };
}

export async function signOut(): Promise<void> {
  await delay(300);
  // mock
}

// ─── Workout Logs ────────────────────────────────────────────

export async function fetchWorkoutLogs(): Promise<WorkoutLog[]> {
  await delay(400);
  return storage.getWorkoutLogs();
}

export async function syncWorkoutLog(log: WorkoutLog): Promise<void> {
  await delay(500);
  // In production: upload to Firestore
  // For now just save locally
  await storage.saveWorkoutLog(log);
}

// ─── Profile ─────────────────────────────────────────────────

export async function fetchUserProfile(): Promise<UserProfile | null> {
  await delay(300);
  return storage.getUserProfile();
}

export async function updateUserProfile(profile: UserProfile): Promise<void> {
  await delay(400);
  await storage.saveUserProfile(profile);
}

// ─── Stats ───────────────────────────────────────────────────

/**
 * Calculate weekly stats from local workout logs.
 * In a real app this might be a server-side aggregation.
 */
export async function fetchWeeklyStats(weekOffset = 0): Promise<WeeklyStats> {
  await delay(200);

  const logs = await storage.getWorkoutLogs();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() - weekOffset * 7);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekLogs = logs.filter(log => {
    if (!log.completedAt) return false;
    const d = new Date(log.completedAt);
    return d >= weekStart && d < weekEnd;
  });

  const totalVolume = weekLogs.reduce((sum, log) => sum + log.totalVolume, 0);
  const totalDuration = weekLogs.reduce((sum, log) => sum + log.duration, 0);
  // rough calorie estimate: ~5 cal per minute of strength training
  const caloriesBurned = weekLogs.reduce((sum, log) => sum + (log.caloriesBurned ?? Math.round(log.duration / 60 * 5)), 0);

  return {
    weekStart: weekStart.toISOString(),
    workoutsCompleted: weekLogs.length,
    totalVolume,
    totalDuration,
    caloriesBurned,
    personalRecords: 0, // TODO: track PRs
  };
}

// ─── Leaderboard / Social ────────────────────────────────────
// TODO: implement social features in v2

export async function fetchLeaderboard(): Promise<Array<{ name: string; workouts: number }>> {
  await delay(600);
  // mock data
  return [
    { name: 'You', workouts: 12 },
    { name: 'Alex K.', workouts: 15 },
    { name: 'Sarah M.', workouts: 10 },
    { name: 'Mike R.', workouts: 8 },
  ];
}

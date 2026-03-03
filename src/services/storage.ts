import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  WORKOUT_LOGS: '@fittracker/workout_logs',
  USER_PROFILE: '@fittracker/user_profile',
  ACHIEVEMENTS: '@fittracker/achievements',
  STREAK: '@fittracker/streak',
  SETTINGS: '@fittracker/settings',
  CUSTOM_WORKOUTS: '@fittracker/custom_workouts',
} as const;

type StorageKey = (typeof KEYS)[keyof typeof KEYS];

async function getItem<T>(key: StorageKey): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    // TODO: proper error reporting (sentry or similar)
    console.warn(`Failed to read ${key} from storage`, err);
    return null;
  }
}

async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  try {
    const raw = JSON.stringify(value);
    await AsyncStorage.setItem(key, raw);
  } catch (err) {
    console.warn(`Failed to write ${key} to storage`, err);
  }
}

async function removeItem(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to remove ${key} from storage`, err);
  }
}

// ─── Workout Logs ────────────────────────────────────────────

import { WorkoutLog, UserProfile, DailyStreak, Achievement } from '../types';

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  const logs = await getItem<WorkoutLog[]>(KEYS.WORKOUT_LOGS);
  return logs ?? [];
}

export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  const existing = await getWorkoutLogs();
  const updated = [...existing, log];
  await setItem(KEYS.WORKOUT_LOGS, updated);
}

export async function updateWorkoutLog(log: WorkoutLog): Promise<void> {
  const existing = await getWorkoutLogs();
  const updated = existing.map(l => (l.id === log.id ? log : l));
  await setItem(KEYS.WORKOUT_LOGS, updated);
}

// ─── User Profile ────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile | null> {
  return getItem<UserProfile>(KEYS.USER_PROFILE);
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await setItem(KEYS.USER_PROFILE, profile);
}

// ─── Streak ──────────────────────────────────────────────────

export async function getStreak(): Promise<DailyStreak> {
  const streak = await getItem<DailyStreak>(KEYS.STREAK);
  return streak ?? { current: 0, longest: 0, lastWorkoutDate: '' };
}

export async function saveStreak(streak: DailyStreak): Promise<void> {
  await setItem(KEYS.STREAK, streak);
}

// ─── Achievements ────────────────────────────────────────────

export async function getAchievements(): Promise<Achievement[]> {
  const achievements = await getItem<Achievement[]>(KEYS.ACHIEVEMENTS);
  return achievements ?? [];
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  await setItem(KEYS.ACHIEVEMENTS, achievements);
}

// ─── Clear All (for dev/testing) ─────────────────────────────

export async function clearAllData(): Promise<void> {
  const allKeys = Object.values(KEYS);
  try {
    await AsyncStorage.multiRemove(allKeys);
  } catch (err) {
    console.warn('Failed to clear all data', err);
  }
}

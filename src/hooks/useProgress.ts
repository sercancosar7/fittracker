import { useState, useEffect, useCallback, useMemo } from 'react';
import { WeeklyStats, DailyStreak, Achievement } from '../types';
import * as api from '../services/api';
import * as storage from '../services/storage';
import { ACHIEVEMENTS } from '../utils/constants';

interface UseProgressReturn {
  currentWeek: WeeklyStats | null;
  previousWeeks: WeeklyStats[];
  streak: DailyStreak;
  achievements: Achievement[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useProgress(): UseProgressReturn {
  const [currentWeek, setCurrentWeek] = useState<WeeklyStats | null>(null);
  const [previousWeeks, setPreviousWeeks] = useState<WeeklyStats[]>([]);
  const [streak, setStreak] = useState<DailyStreak>({ current: 0, longest: 0, lastWorkoutDate: '' });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // fetch current week + last 4 weeks in parallel
      const [week0, week1, week2, week3, week4, streakData, savedAchievements] = await Promise.all([
        api.fetchWeeklyStats(0),
        api.fetchWeeklyStats(1),
        api.fetchWeeklyStats(2),
        api.fetchWeeklyStats(3),
        api.fetchWeeklyStats(4),
        storage.getStreak(),
        storage.getAchievements(),
      ]);

      setCurrentWeek(week0);
      setPreviousWeeks([week1, week2, week3, week4]);
      setStreak(streakData);

      // merge saved achievements with defaults
      const merged = ACHIEVEMENTS.map(def => {
        const saved = savedAchievements.find(a => a.id === def.id);
        return saved ? { ...def, ...saved } : def;
      });
      setAchievements(merged);
    } catch (err) {
      // TODO: error handling
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = useCallback(async () => {
    await loadData();
  }, []);

  return {
    currentWeek,
    previousWeeks,
    streak,
    achievements,
    isLoading,
    refresh,
  };
}

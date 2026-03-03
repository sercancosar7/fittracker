import { useState, useEffect, useCallback } from 'react';
import { WorkoutLog, Workout, WorkoutExercise, ExerciseSet } from '../types';
import * as api from '../services/api';
import * as storage from '../services/storage';
import { WORKOUT_PLANS } from '../utils/constants';

interface UseWorkoutsReturn {
  workouts: Workout[];
  logs: WorkoutLog[];
  isLoading: boolean;
  activeLog: WorkoutLog | null;
  startWorkout: (workout: Workout) => WorkoutLog;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSetWeight: (exerciseIndex: number, setIndex: number, weight: number) => void;
  updateSetReps: (exerciseIndex: number, setIndex: number, reps: number) => void;
  finishWorkout: () => Promise<void>;
  refreshLogs: () => Promise<void>;
}

export function useWorkouts(): UseWorkoutsReturn {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLog, setActiveLog] = useState<WorkoutLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const fetched = await api.fetchWorkoutLogs();
      setLogs(fetched);
    } catch (err) {
      // TODO: show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLogs = useCallback(async () => {
    await loadLogs();
  }, []);

  const startWorkout = useCallback((workout: Workout): WorkoutLog => {
    const log: WorkoutLog = {
      id: `log_${Date.now()}`,
      workoutId: workout.id,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(s => ({ ...s, completed: false })),
      })),
      totalVolume: 0,
      duration: 0,
    };
    setActiveLog(log);
    return log;
  }, []);

  const completeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setActiveLog(prev => {
      if (!prev) return prev;

      const updatedExercises = prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set, sIdx) => {
            if (sIdx !== setIndex) return set;
            return { ...set, completed: !set.completed };
          }),
        };
      });

      const totalVolume = calculateTotalVolume(updatedExercises);

      return {
        ...prev,
        exercises: updatedExercises,
        totalVolume,
      };
    });
  }, []);

  const updateSetWeight = useCallback((exerciseIndex: number, setIndex: number, weight: number) => {
    setActiveLog(prev => {
      if (!prev) return prev;
      const updatedExercises = prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set, sIdx) => {
            if (sIdx !== setIndex) return set;
            return { ...set, weight };
          }),
        };
      });
      return { ...prev, exercises: updatedExercises };
    });
  }, []);

  const updateSetReps = useCallback((exerciseIndex: number, setIndex: number, reps: number) => {
    setActiveLog(prev => {
      if (!prev) return prev;
      const updatedExercises = prev.exercises.map((ex, eIdx) => {
        if (eIdx !== exerciseIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set, sIdx) => {
            if (sIdx !== setIndex) return set;
            return { ...set, reps };
          }),
        };
      });
      return { ...prev, exercises: updatedExercises };
    });
  }, []);

  const finishWorkout = useCallback(async () => {
    if (!activeLog) return;

    const completedLog: WorkoutLog = {
      ...activeLog,
      completedAt: new Date().toISOString(),
      status: 'completed',
      duration: Math.floor((Date.now() - new Date(activeLog.startedAt).getTime()) / 1000),
      totalVolume: calculateTotalVolume(activeLog.exercises),
    };

    await api.syncWorkoutLog(completedLog);
    setLogs(prev => [...prev, completedLog]);
    setActiveLog(null);

    // update streak
    await updateStreak();
  }, [activeLog]);

  return {
    workouts: WORKOUT_PLANS,
    logs,
    isLoading,
    activeLog,
    startWorkout,
    completeSet,
    updateSetWeight,
    updateSetReps,
    finishWorkout,
    refreshLogs,
  };
}

// helpers

function calculateTotalVolume(exercises: WorkoutExercise[]): number {
  let total = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (set.completed) {
        total += set.reps * set.weight;
      }
    }
  }
  return total;
}

async function updateStreak(): Promise<void> {
  const streak = await storage.getStreak();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newCurrent = streak.current;

  if (streak.lastWorkoutDate === today) {
    // already worked out today, no change
    return;
  } else if (streak.lastWorkoutDate === yesterday) {
    newCurrent = streak.current + 1;
  } else {
    // streak broken
    newCurrent = 1;
  }

  const newStreak = {
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastWorkoutDate: today,
  };

  await storage.saveStreak(newStreak);
}

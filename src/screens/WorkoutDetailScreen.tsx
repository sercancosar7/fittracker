import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, WorkoutExercise } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { WORKOUT_PLANS, MUSCLE_GROUP_LABELS } from '../utils/constants';
import { formatWeight, formatDuration } from '../utils/formatters';
import { useWorkouts } from '../hooks/useWorkouts';
import { useTimer } from '../hooks/useTimer';
import ExerciseItem from '../components/ExerciseItem';
import Timer from '../components/Timer';

type DetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

export default function WorkoutDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { workoutId } = route.params;

  const workout = WORKOUT_PLANS.find(w => w.id === workoutId);
  const {
    activeLog,
    startWorkout,
    completeSet,
    updateSetWeight,
    updateSetReps,
    finishWorkout,
  } = useWorkouts();

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);

  const workoutTimer = useTimer();

  if (!workout) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const isInProgress = activeLog !== null;
  const currentExercise = isInProgress
    ? activeLog.exercises[currentExerciseIdx]
    : null;

  const handleStart = () => {
    startWorkout(workout);
    workoutTimer.start();
  };

  const handleFinish = () => {
    Alert.alert(
      'Finish Workout',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          style: 'default',
          onPress: async () => {
            workoutTimer.pause();
            await finishWorkout();
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleSetComplete = (setIdx: number) => {
    completeSet(currentExerciseIdx, setIdx);

    // check if all sets for this exercise are done
    if (currentExercise) {
      const updatedSets = currentExercise.sets.map((s, i) =>
        i === setIdx ? { ...s, completed: !s.completed } : s,
      );
      const allDone = updatedSets.every(s => s.completed);

      if (allDone && currentExerciseIdx < (activeLog?.exercises.length ?? 0) - 1) {
        // show rest timer before moving to next exercise
        setShowRestTimer(true);
      }
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    setCurrentExerciseIdx(prev => prev + 1);
  };

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = isInProgress
    ? activeLog.exercises.reduce(
        (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
        0,
      )
    : 0;
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Workout Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.description}>{workout.description}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="timer" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{workout.estimatedMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="fitness-center" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{workout.exercises.length} exercises</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="signal-cellular-alt" size={16} color={colors.textMuted} />
            <Text style={styles.metaText}>{workout.difficulty}</Text>
          </View>
        </View>

        {/* Muscle groups */}
        <View style={styles.muscleRow}>
          {workout.targetMuscles.map(m => (
            <View key={m} style={styles.muscleBadge}>
              <Text style={styles.muscleBadgeText}>{MUSCLE_GROUP_LABELS[m]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Progress bar (during workout) */}
      {isInProgress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressMetaText}>
              {completedSets}/{totalSets} sets
            </Text>
            <Text style={styles.progressMetaText}>
              {formatDuration(workoutTimer.seconds)}
            </Text>
          </View>
        </View>
      )}

      {/* Rest Timer Overlay */}
      {showRestTimer && currentExercise && (
        <View style={styles.restTimerSection}>
          <Timer
            countdownFrom={currentExercise.restSeconds}
            onComplete={handleRestComplete}
            label="REST TIME"
          />
          <TouchableOpacity style={styles.skipRestButton} onPress={handleRestComplete}>
            <Text style={styles.skipRestText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Exercise List */}
      <View style={styles.exerciseList}>
        <Text style={styles.sectionTitle}>EXERCISES</Text>
        {(isInProgress ? activeLog.exercises : workout.exercises).map((ex, idx) => (
          <ExerciseItem
            key={ex.exerciseId}
            item={ex}
            index={idx}
            isActive={isInProgress && idx === currentExerciseIdx}
            onPress={
              isInProgress
                ? () => setCurrentExerciseIdx(idx)
                : () => navigation.navigate('Exercise' as any, { exerciseId: ex.exerciseId })
            }
          />
        ))}
      </View>

      {/* Current Exercise Detail (during workout) */}
      {isInProgress && currentExercise && !showRestTimer && (
        <View style={styles.activeExerciseSection}>
          <Text style={styles.sectionTitle}>CURRENT EXERCISE</Text>
          <Text style={styles.activeExerciseName}>{currentExercise.exercise.name}</Text>

          {/* Sets table */}
          <View style={styles.setsTable}>
            <View style={styles.setsHeader}>
              <Text style={[styles.setsHeaderCell, styles.setCol]}>Set</Text>
              <Text style={[styles.setsHeaderCell, styles.repsCol]}>Reps</Text>
              <Text style={[styles.setsHeaderCell, styles.weightCol]}>Weight</Text>
              <Text style={[styles.setsHeaderCell, styles.doneCol]}></Text>
            </View>

            {currentExercise.sets.map((set, setIdx) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={[styles.setCell, styles.setCol]}>{setIdx + 1}</Text>
                <View style={styles.repsCol}>
                  <TextInput
                    style={styles.setInput}
                    value={String(set.reps)}
                    onChangeText={val => {
                      const n = parseInt(val, 10);
                      if (!isNaN(n)) updateSetReps(currentExerciseIdx, setIdx, n);
                    }}
                    keyboardType="number-pad"
                    selectTextOnFocus
                  />
                </View>
                <View style={styles.weightCol}>
                  <TextInput
                    style={styles.setInput}
                    value={String(set.weight)}
                    onChangeText={val => {
                      const n = parseFloat(val);
                      if (!isNaN(n)) updateSetWeight(currentExerciseIdx, setIdx, n);
                    }}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>
                <TouchableOpacity
                  style={[styles.doneCol, styles.doneButton, set.completed && styles.doneButtonActive]}
                  onPress={() => handleSetComplete(setIdx)}
                >
                  <Icon
                    name={set.completed ? 'check-circle' : 'radio-button-unchecked'}
                    size={24}
                    color={set.completed ? colors.success : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionArea}>
        {isInProgress ? (
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish} activeOpacity={0.8}>
            <Icon name="stop" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Finish Workout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
            <Icon name="play-arrow" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  muscleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  muscleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryMuted,
  },
  muscleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  // progress
  progressSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.caption,
  },
  progressPercent: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
    fontSize: 14,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressMetaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
  // rest timer
  restTimerSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  skipRestButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  skipRestText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // exercise list
  exerciseList: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  // active exercise
  activeExerciseSection: {
    marginBottom: spacing.xl,
  },
  activeExerciseName: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  setsTable: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceLight,
  },
  setsHeaderCell: {
    ...typography.caption,
    fontSize: 10,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  setCell: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  setCol: { width: 40 },
  repsCol: { width: 70 },
  weightCol: { flex: 1 },
  doneCol: { width: 40, alignItems: 'center' },
  setInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    width: 55,
    textAlign: 'center',
  },
  doneButton: {
    padding: 4,
  },
  doneButtonActive: {},
  // action area
  actionArea: {
    marginTop: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    fontSize: 16,
  },
});

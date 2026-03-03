import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Workout } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { MUSCLE_GROUP_LABELS } from '../utils/constants';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  lastCompleted?: string; // ISO date string
}

export default function WorkoutCard({ workout, onPress, lastCompleted }: WorkoutCardProps) {
  const difficultyColor = {
    beginner: colors.success,
    intermediate: colors.primary,
    advanced: colors.error,
  }[workout.difficulty];

  const muscleLabels = workout.targetMuscles
    .slice(0, 3) // don't show more than 3
    .map(m => MUSCLE_GROUP_LABELS[m])
    .join(' · ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {workout.name}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '22' }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {workout.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Icon name="timer" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{workout.estimatedMinutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="fitness-center" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{workout.exercises.length} exercises</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="whatshot" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{muscleLabels}</Text>
        </View>
      </View>

      {lastCompleted && (
        <View style={styles.lastDone}>
          <Icon name="check-circle" size={12} color={colors.success} />
          <Text style={styles.lastDoneText}>Last done {lastCompleted}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  lastDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  lastDoneText: {
    ...typography.bodySmall,
    color: colors.success,
    fontSize: 12,
  },
});

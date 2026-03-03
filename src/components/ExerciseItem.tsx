import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WorkoutExercise } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { MUSCLE_GROUP_LABELS } from '../utils/constants';
import { formatWeight } from '../utils/formatters';

interface ExerciseItemProps {
  item: WorkoutExercise;
  index: number;
  isActive?: boolean;
  onPress?: () => void;
}

export default function ExerciseItem({ item, index, isActive, onPress }: ExerciseItemProps) {
  const completedSets = item.sets.filter(s => s.completed).length;
  const totalSets = item.sets.length;
  const allDone = completedSets === totalSets && totalSets > 0;

  // grab the highest weight for summary display
  const maxWeight = Math.max(...item.sets.map(s => s.weight));

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.indexBadge, allDone && styles.indexBadgeDone]}>
        {allDone ? (
          <Icon name="check" size={14} color={colors.white} />
        ) : (
          <Text style={styles.indexText}>{index + 1}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.exercise.name}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {totalSets} sets · {item.sets[0]?.reps} reps
          </Text>
          {maxWeight > 0 && (
            <Text style={styles.detailText}> · {formatWeight(maxWeight)}</Text>
          )}
        </View>
        <Text style={styles.muscleGroup}>
          {MUSCLE_GROUP_LABELS[item.exercise.muscleGroup]}
        </Text>
      </View>

      <View style={styles.right}>
        {isActive ? (
          <View style={styles.progressRing}>
            <Text style={styles.progressText}>
              {completedSets}/{totalSets}
            </Text>
          </View>
        ) : (
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  indexBadgeDone: {
    backgroundColor: colors.success,
  },
  indexText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  detailText: {
    ...typography.bodySmall,
    fontSize: 13,
  },
  muscleGroup: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 10,
  },
  right: {
    marginLeft: spacing.sm,
  },
  progressRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});

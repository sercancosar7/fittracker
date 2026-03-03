import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { EXERCISES, MUSCLE_GROUP_LABELS } from '../utils/constants';

type ExerciseRouteProp = RouteProp<RootStackParamList, 'Exercise'>;

export default function ExerciseScreen() {
  const route = useRoute<ExerciseRouteProp>();
  const { exerciseId } = route.params;

  const exercise = useMemo(
    () => EXERCISES.find(e => e.id === exerciseId),
    [exerciseId],
  );

  if (!exercise) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.description}>{exercise.description}</Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          <View style={styles.tagPrimary}>
            <Text style={styles.tagPrimaryText}>
              {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
            </Text>
          </View>
          {exercise.secondaryMuscles.map(m => (
            <View key={m} style={styles.tagSecondary}>
              <Text style={styles.tagSecondaryText}>
                {MUSCLE_GROUP_LABELS[m]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Equipment */}
      {exercise.equipment.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EQUIPMENT</Text>
          <View style={styles.equipmentRow}>
            {exercise.equipment.map((eq, i) => (
              <View key={i} style={styles.equipmentItem}>
                <Icon name="fitness-center" size={16} color={colors.textSecondary} />
                <Text style={styles.equipmentText}>{eq}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HOW TO PERFORM</Text>
        <View style={styles.instructionsList}>
          {exercise.instructions.map((step, idx) => (
            <View key={idx} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TIPS</Text>
        <View style={styles.tipCard}>
          <Icon name="lightbulb" size={18} color={colors.warning} />
          <Text style={styles.tipText}>
            Focus on controlled movement. If you can't maintain proper form,
            reduce the weight. Quality reps beat heavy weight every time.
          </Text>
        </View>
      </View>

      {/* History placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR HISTORY</Text>
        <View style={styles.emptyHistory}>
          <Icon name="history" size={32} color={colors.textMuted} />
          <Text style={styles.emptyHistoryText}>
            No history yet for this exercise
          </Text>
          <Text style={styles.emptyHistorySubtext}>
            Complete a workout with this exercise to see your progress
          </Text>
        </View>
        {/* TODO: show actual history from workout logs */}
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
    paddingBottom: spacing.xxxl,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
  // header
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
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagPrimary: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryMuted,
  },
  tagPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  tagSecondary: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
  },
  tagSecondaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  // sections
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  // equipment
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipmentText: {
    ...typography.body,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  // instructions
  instructionsList: {
    gap: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  instructionText: {
    ...typography.body,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  // tips
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  // empty history
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyHistoryText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: '500',
  },
  emptyHistorySubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
});

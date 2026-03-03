import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DailyStreak } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface StreakBadgeProps {
  streak: DailyStreak;
  compact?: boolean;
}

export default function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  const isActive = streak.current > 0;
  const fireColor = isActive ? colors.primary : colors.textMuted;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Icon name="local-fire-department" size={16} color={fireColor} />
        <Text style={[styles.compactText, isActive && styles.compactTextActive]}>
          {streak.current}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconArea}>
        <Icon name="local-fire-department" size={32} color={fireColor} />
        <Text style={styles.streakNumber}>{streak.current}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>
          {isActive ? 'Day Streak' : 'No Active Streak'}
        </Text>
        <Text style={styles.longest}>
          Longest: {streak.longest} days
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconArea: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  streakNumber: {
    ...typography.number,
    fontSize: 24,
    marginTop: -4,
  },
  info: {
    flex: 1,
  },
  label: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 2,
  },
  longest: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  // compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  compactText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  compactTextActive: {
    color: colors.primary,
  },
});

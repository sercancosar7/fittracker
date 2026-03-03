import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeeklyStats } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ProgressChartProps {
  /** Weeks ordered from most recent [0] to oldest [n] */
  weeks: WeeklyStats[];
  metric: 'workoutsCompleted' | 'totalVolume' | 'totalDuration';
  title: string;
}

// simple bar chart - no external library needed for this
// TODO: consider using react-native-chart-kit for more advanced charts
export default function ProgressChart({ weeks, metric, title }: ProgressChartProps) {
  const reversedWeeks = [...weeks].reverse(); // oldest first for left-to-right display
  const values = reversedWeeks.map(w => w[metric]);
  const maxValue = Math.max(...values, 1); // prevent div by zero

  const dayLabels = ['4w', '3w', '2w', '1w', 'Now'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>
        {reversedWeeks.map((week, i) => {
          const val = week[metric];
          const heightPercent = (val / maxValue) * 100;
          const isLatest = i === reversedWeeks.length - 1;

          return (
            <View key={week.weekStart} style={styles.barColumn}>
              <Text style={styles.barValue}>
                {metric === 'totalVolume'
                  ? `${Math.round(val / 1000)}k`
                  : metric === 'totalDuration'
                    ? `${Math.round(val / 60)}m`
                    : val}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(heightPercent, 4)}%`,
                      backgroundColor: isLatest ? colors.primary : colors.surfaceLight,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, isLatest && styles.barLabelActive]}>
                {dayLabels[i] ?? ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    gap: spacing.sm,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barValue: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  barLabelActive: {
    color: colors.primary,
  },
});

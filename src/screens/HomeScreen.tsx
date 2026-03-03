import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, DailyStreak, WorkoutLog } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { WORKOUT_PLANS } from '../utils/constants';
import { formatDurationShort, formatRelativeDate, formatWeight } from '../utils/formatters';
import WorkoutCard from '../components/WorkoutCard';
import StatsCard from '../components/StatsCard';
import StreakBadge from '../components/StreakBadge';
import * as storage from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [streak, setStreak] = useState<DailyStreak>({ current: 0, longest: 0, lastWorkoutDate: '' });
  const [recentLogs, setRecentLogs] = useState<WorkoutLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [streakData, logs] = await Promise.all([
      storage.getStreak(),
      storage.getWorkoutLogs(),
    ]);
    setStreak(streakData);
    // just the last 3 completed
    setRecentLogs(
      logs
        .filter(l => l.status === 'completed')
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
        .slice(0, 3),
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // pick a suggested workout - simple rotation based on day of week
  const dayIndex = new Date().getDay();
  const suggestedWorkout = WORKOUT_PLANS[dayIndex % WORKOUT_PLANS.length];

  // quick stats from recent logs
  const thisWeekLogs = recentLogs.filter(l => {
    const d = new Date(l.completedAt!);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  });
  const weekVolume = thisWeekLogs.reduce((sum, l) => sum + l.totalVolume, 0);
  const weekDuration = thisWeekLogs.reduce((sum, l) => sum + l.duration, 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
          <Text style={styles.title}>Let's crush it today</Text>
        </View>
        <StreakBadge streak={streak} compact />
      </View>

      {/* Today's Suggestion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <WorkoutCard
          workout={suggestedWorkout}
          onPress={() => navigation.navigate('WorkoutDetail', { workoutId: suggestedWorkout.id })}
        />
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <StatsCard
              title="Workouts"
              value={String(thisWeekLogs.length)}
              icon="fitness-center"
              iconColor={colors.primary}
            />
          </View>
          <View style={styles.statsItem}>
            <StatsCard
              title="Volume"
              value={formatWeight(weekVolume)}
              icon="trending-up"
              iconColor={colors.info}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickActions}>
          {WORKOUT_PLANS.slice(0, 4).map(w => (
            <TouchableOpacity
              key={w.id}
              style={styles.quickAction}
              onPress={() => navigation.navigate('WorkoutDetail', { workoutId: w.id })}
              activeOpacity={0.7}
            >
              <Icon name="play-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.quickActionText} numberOfLines={1}>
                {w.name}
              </Text>
              <Text style={styles.quickActionSub}>{w.estimatedMinutes}m</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      {recentLogs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentLogs.map(log => {
            const workout = WORKOUT_PLANS.find(w => w.id === log.workoutId);
            return (
              <View key={log.id} style={styles.recentItem}>
                <View style={styles.recentDot} />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{workout?.name ?? 'Workout'}</Text>
                  <Text style={styles.recentMeta}>
                    {formatDurationShort(log.duration)} · {formatWeight(log.totalVolume)} volume
                  </Text>
                </View>
                <Text style={styles.recentDate}>
                  {formatRelativeDate(log.completedAt!)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.sm,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 2,
  },
  title: {
    ...typography.h1,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsItem: {
    flex: 1,
  },
  quickActions: {
    gap: spacing.sm,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  quickActionText: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  quickActionSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.md,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    ...typography.body,
    fontWeight: '500',
  },
  recentMeta: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
  recentDate: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
});

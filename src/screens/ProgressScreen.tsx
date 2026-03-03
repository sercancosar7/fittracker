import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';
import { useProgress } from '../hooks/useProgress';
import { formatNumber, formatDurationShort, formatCalories, formatWeight } from '../utils/formatters';
import StatsCard from '../components/StatsCard';
import ProgressChart from '../components/ProgressChart';
import StreakBadge from '../components/StreakBadge';

export default function ProgressScreen() {
  const { currentWeek, previousWeeks, streak, achievements, isLoading, refresh } = useProgress();

  const allWeeks = currentWeek
    ? [currentWeek, ...previousWeeks]
    : previousWeeks;

  // calculate trends vs last week
  const lastWeek = previousWeeks[0];
  const volumeTrend =
    currentWeek && lastWeek && lastWeek.totalVolume > 0
      ? Math.round(((currentWeek.totalVolume - lastWeek.totalVolume) / lastWeek.totalVolume) * 100)
      : 0;
  const durationTrend =
    currentWeek && lastWeek && lastWeek.totalDuration > 0
      ? Math.round(((currentWeek.totalDuration - lastWeek.totalDuration) / lastWeek.totalDuration) * 100)
      : 0;

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={colors.primary} />
      }
    >
      <Text style={styles.screenTitle}>Progress</Text>

      {/* Streak */}
      <View style={styles.section}>
        <StreakBadge streak={streak} />
      </View>

      {/* Weekly Overview */}
      {currentWeek && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THIS WEEK</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsGridItem}>
              <StatsCard
                title="Workouts"
                value={String(currentWeek.workoutsCompleted)}
                icon="fitness-center"
                iconColor={colors.primary}
                trend={currentWeek.workoutsCompleted > (lastWeek?.workoutsCompleted ?? 0) ? 'up' : 'neutral'}
              />
            </View>
            <View style={styles.statsGridItem}>
              <StatsCard
                title="Volume"
                value={formatWeight(currentWeek.totalVolume)}
                icon="trending-up"
                iconColor={colors.info}
                trend={volumeTrend > 0 ? 'up' : volumeTrend < 0 ? 'down' : 'neutral'}
                trendValue={volumeTrend !== 0 ? `${Math.abs(volumeTrend)}%` : undefined}
              />
            </View>
            <View style={styles.statsGridItem}>
              <StatsCard
                title="Duration"
                value={formatDurationShort(currentWeek.totalDuration)}
                icon="timer"
                iconColor={colors.success}
                trend={durationTrend > 0 ? 'up' : durationTrend < 0 ? 'down' : 'neutral'}
                trendValue={durationTrend !== 0 ? `${Math.abs(durationTrend)}%` : undefined}
              />
            </View>
            <View style={styles.statsGridItem}>
              <StatsCard
                title="Calories"
                value={formatCalories(currentWeek.caloriesBurned)}
                icon="local-fire-department"
                iconColor={colors.warning}
              />
            </View>
          </View>
        </View>
      )}

      {/* Charts */}
      {allWeeks.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRENDS</Text>
          <View style={styles.chartsStack}>
            <ProgressChart
              weeks={allWeeks}
              metric="workoutsCompleted"
              title="Workouts per Week"
            />
            <ProgressChart
              weeks={allWeeks}
              metric="totalVolume"
              title="Total Volume (kg)"
            />
            <ProgressChart
              weeks={allWeeks}
              metric="totalDuration"
              title="Training Duration"
            />
          </View>
        </View>
      )}

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ACHIEVEMENTS ({unlockedCount}/{achievements.length})
        </Text>
        <View style={styles.achievementsList}>
          {achievements.map(ach => {
            const isUnlocked = ach.unlockedAt != null;
            const progressPct = Math.min(Math.round((ach.progress / ach.requirement) * 100), 100);

            return (
              <View
                key={ach.id}
                style={[styles.achievementCard, isUnlocked && styles.achievementUnlocked]}
              >
                <View style={styles.achievementHeader}>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !isUnlocked && styles.achievementLocked,
                    ]}
                  >
                    {ach.title}
                  </Text>
                  {isUnlocked && (
                    <Text style={styles.achievementCheck}>Unlocked</Text>
                  )}
                </View>
                <Text style={styles.achievementDesc}>{ach.description}</Text>
                {!isUnlocked && (
                  <View style={styles.achievementProgress}>
                    <View style={styles.achievementTrack}>
                      <View
                        style={[styles.achievementFill, { width: `${progressPct}%` }]}
                      />
                    </View>
                    <Text style={styles.achievementPct}>
                      {ach.progress}/{ach.requirement}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
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
  screenTitle: {
    ...typography.h1,
    marginBottom: spacing.xxl,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statsGridItem: {
    width: '47%', // roughly half with gap
    // this isn't pixel-perfect, but works well enough on most devices
    // TODO: use Dimensions or useWindowDimensions for exact sizing
  },
  chartsStack: {
    gap: spacing.lg,
  },
  // achievements
  achievementsList: {
    gap: spacing.sm,
  },
  achievementCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementUnlocked: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  achievementTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  achievementLocked: {
    color: colors.textSecondary,
  },
  achievementCheck: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  achievementDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  achievementTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  achievementFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  achievementPct: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});

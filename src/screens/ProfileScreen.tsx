import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserProfile, FitnessGoal } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { formatWeight, formatNumber } from '../utils/formatters';
import * as storage from '../services/storage';
import * as notifications from '../services/notifications';

const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_weight: 'Lose Weight',
  build_muscle: 'Build Muscle',
  stay_fit: 'Stay Fit',
  gain_strength: 'Gain Strength',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const saved = await storage.getUserProfile();
    if (saved) {
      setProfile(saved);
    } else {
      // default profile for demo
      setProfile({
        id: 'user_001',
        name: 'Alex',
        height: 178,
        weight: 82,
        goal: 'build_muscle',
        weeklyTarget: 4,
        joinedAt: '2024-09-01T00:00:00Z',
      });
    }
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      const [hour, min] = reminderTime.split(':').map(Number);
      notifications.scheduleWorkoutReminder(hour, min);
    } else {
      notifications.cancelAllReminders();
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your workout history, achievements, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAllData();
            loadProfile();
          },
        },
      ],
    );
  };

  // calculate days since joining
  const daysSinceJoin = profile
    ? Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Profile</Text>

      {/* Avatar + Name */}
      {profile && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.memberSince}>
            Member for {daysSinceJoin} days
          </Text>
        </View>
      )}

      {/* Stats Row */}
      {profile && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.height}</Text>
            <Text style={styles.statLabel}>cm</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.weight}</Text>
            <Text style={styles.statLabel}>kg</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.weeklyTarget}</Text>
            <Text style={styles.statLabel}>workouts/wk</Text>
          </View>
        </View>
      )}

      {/* Goal */}
      {profile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FITNESS GOAL</Text>
          <View style={styles.goalRow}>
            {(Object.keys(GOAL_LABELS) as FitnessGoal[]).map(goal => {
              const isActive = profile.goal === goal;
              return (
                <TouchableOpacity
                  key={goal}
                  style={[styles.goalChip, isActive && styles.goalChipActive]}
                  onPress={() => {
                    const updated = { ...profile, goal };
                    setProfile(updated);
                    storage.saveUserProfile(updated);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.goalChipText, isActive && styles.goalChipTextActive]}>
                    {GOAL_LABELS[goal]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Workout Reminders</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.surfaceLight, true: colors.primaryMuted }}
            thumbColor={notificationsEnabled ? colors.primary : colors.textMuted}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="schedule" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Reminder Time</Text>
            </View>
            <Text style={styles.settingValue}>{reminderTime}</Text>
            {/* TODO: add time picker */}
          </View>
        )}

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="straighten" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Weight Unit</Text>
          </View>
          <Text style={styles.settingValue}>kg</Text>
          {/* TODO: add unit toggle */}
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="dark-mode" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={true}
            disabled
            trackColor={{ false: colors.surfaceLight, true: colors.primaryMuted }}
            thumbColor={colors.primary}
          />
          {/* only dark mode for now */}
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATA</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => {/* TODO: export data */}}>
          <View style={styles.settingInfo}>
            <Icon name="file-download" size={20} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Export Workout Data</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
          <View style={styles.settingInfo}>
            <Icon name="delete-outline" size={20} color={colors.error} />
            <Text style={[styles.settingLabel, { color: colors.error }]}>
              Clear All Data
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>FitTracker v1.2.0</Text>
        <Text style={styles.appInfoText}>Made with React Native</Text>
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
  // profile card
  profileCard: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    ...typography.h2,
    marginBottom: 4,
  },
  memberSince: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  // stats row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.numberSmall,
    fontSize: 22,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  // sections
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  // goal
  goalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  goalChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalChipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  goalChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  goalChipTextActive: {
    color: colors.primary,
  },
  // settings
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    ...typography.body,
  },
  settingValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  // app info
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  appInfoText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
});

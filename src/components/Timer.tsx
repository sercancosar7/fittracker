import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, borderRadius, typography } from '../theme';
import { formatDuration } from '../utils/formatters';
import { useTimer } from '../hooks/useTimer';

interface TimerProps {
  /** If set, shows a countdown timer instead of a stopwatch */
  countdownFrom?: number;
  onComplete?: () => void;
  label?: string;
}

export default function Timer({ countdownFrom, onComplete, label }: TimerProps) {
  const timer = useTimer(onComplete);

  const handleStartPause = () => {
    if (timer.isRunning) {
      timer.pause();
    } else if (countdownFrom && !timer.isCountdown) {
      timer.startCountdown(countdownFrom);
    } else {
      timer.start();
    }
  };

  const isFinished = timer.isCountdown && timer.seconds === 0 && !timer.isRunning;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Text style={[styles.time, isFinished && styles.timeFinished]}>
        {formatDuration(timer.seconds)}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, timer.isRunning && styles.buttonPause]}
          onPress={handleStartPause}
          activeOpacity={0.7}
        >
          <Icon
            name={timer.isRunning ? 'pause' : 'play-arrow'}
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={timer.reset}
          activeOpacity={0.7}
        >
          <Icon name="replay" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
  timeFinished: {
    color: colors.success,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPause: {
    backgroundColor: colors.primaryDark,
  },
  buttonSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

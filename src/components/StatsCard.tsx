import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = colors.primary,
  trend,
  trendValue,
}: StatsCardProps) {
  const trendColor = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textMuted;
  const trendIcon = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: iconColor + '18' }]}>
          <Icon name={icon} size={18} color={iconColor} />
        </View>
        {trend && trendValue && (
          <View style={styles.trendBadge}>
            <Icon name={trendIcon} size={12} color={trendColor} />
            <Text style={[styles.trendText, { color: trendColor }]}>{trendValue}</Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  value: {
    ...typography.numberSmall,
    marginBottom: 2,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontSize: 10,
  },
});

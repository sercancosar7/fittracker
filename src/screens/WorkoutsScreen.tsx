import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, Workout, WorkoutCategory, Difficulty } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { WORKOUT_PLANS } from '../utils/constants';
import WorkoutCard from '../components/WorkoutCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterOption = WorkoutCategory | 'all';

const FILTER_OPTIONS: Array<{ label: string; value: FilterOption }> = [
  { label: 'All', value: 'all' },
  { label: 'Strength', value: 'strength' },
  { label: 'HIIT', value: 'hiit' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Flexibility', value: 'flexibility' },
];

export default function WorkoutsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredWorkouts = useMemo(() => {
    let results = WORKOUT_PLANS;

    // filter by category
    if (activeFilter !== 'all') {
      results = results.filter(w => w.category === activeFilter);
    }

    // filter by search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        w =>
          w.name.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.targetMuscles.some(m => m.includes(q)),
      );
    }

    return results;
  }, [search, activeFilter]);

  const renderItem = ({ item }: { item: Workout }) => (
    <WorkoutCard
      workout={item}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
    />
  );

  return (
    <View style={styles.screen}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="close" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map(opt => {
          const isActive = opt.value === activeFilter;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''}
      </Text>

      {/* List */}
      <FlatList
        data={filteredWorkouts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="search-off" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No workouts found</Text>
            <Text style={styles.emptySubtext}>Try a different search or filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  resultsCount: {
    ...typography.bodySmall,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontSize: 12,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

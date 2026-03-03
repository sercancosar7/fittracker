export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes'
  | 'calves'
  | 'forearms'
  | 'full_body'
  | 'cardio';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  description: string;
  instructions: string[];
  equipment: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  restSeconds: number;
  notes?: string;
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number; // in kg
  completed: boolean;
  rpe?: number; // rate of perceived exertion 1-10
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  targetMuscles: MuscleGroup[];
  createdAt: string;
  category: WorkoutCategory;
}

export type WorkoutCategory = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'custom';

export interface WorkoutLog {
  id: string;
  workoutId: string;
  startedAt: string;
  completedAt?: string;
  status: WorkoutStatus;
  exercises: WorkoutExercise[];
  totalVolume: number; // total kg lifted
  duration: number; // in seconds
  caloriesBurned?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  height: number; // cm
  weight: number; // kg
  goal: FitnessGoal;
  weeklyTarget: number; // workouts per week
  joinedAt: string;
}

export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'stay_fit' | 'gain_strength';

export interface WeeklyStats {
  weekStart: string;
  workoutsCompleted: number;
  totalVolume: number;
  totalDuration: number; // seconds
  caloriesBurned: number;
  personalRecords: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  progress: number;
}

export interface DailyStreak {
  current: number;
  longest: number;
  lastWorkoutDate: string;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  WorkoutDetail: { workoutId: string };
  Exercise: { exerciseId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

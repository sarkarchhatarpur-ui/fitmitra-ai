export type FitnessGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'strength'
  | 'general_fitness'
  | 'maintenance';

export type BiologicalSex = 'female' | 'male' | 'unspecified';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'home' | 'gym';

export type DietPreference =
  | 'vegetarian'
  | 'vegan'
  | 'egg_inclusive'
  | 'non_vegetarian';

export type BudgetLevel = 'budget_friendly' | 'moderate' | 'flexible';

export type EquipmentItem =
  | 'bodyweight'
  | 'resistance_bands'
  | 'dumbbells'
  | 'kettlebell'
  | 'pullup_bar'
  | 'full_gym';

export type InjuryLimitation =
  | 'knee_discomfort'
  | 'lower_back_sensitivity'
  | 'shoulder_impingement'
  | 'wrist_sensitivity'
  | 'ankle_mobility';

export type AllergenItem =
  | 'dairy'
  | 'gluten'
  | 'soy'
  | 'nuts'
  | 'eggs'
  | 'seafood';

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: FitnessGoal;
  sex: BiologicalSex;
  activityLevel: ActivityLevel;
  experience: ExperienceLevel;
  workoutLocation: WorkoutLocation;
  daysPerWeek: number;
  sessionDurationMin: number;
  dietPreference: DietPreference;
  allergies: AllergenItem[];
  dietaryRestrictionsNote: string;
  budget: BudgetLevel;
  mealFrequency: 3 | 4 | 5;
  equipment: EquipmentItem[];
  injuries: InjuryLimitation[];
  injuryNotes: string;
  safeBeginnerMode: boolean;
  isDemoAccount?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnergyAndMacroTargets {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
  assumptions: string[];
  safetyNotice?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: 'Chest & Push' | 'Back & Pull' | 'Legs & Glutes' | 'Shoulders' | 'Core & Stability' | 'Full Body Conditioning';
  equipmentRequired: EquipmentItem[];
  location: ('home' | 'gym')[];
  difficulty: ExperienceLevel;
  sets: number;
  reps: string;
  restSeconds: number;
  beginnerSets: number;
  beginnerReps: string;
  beginnerRestSeconds: number;
  instructions: string[];
  warmupTip: string;
  cooldownTip: string;
  easierAlternative: string;
  progressionTip: string;
  contraindicatedInjuries: InjuryLimitation[];
  injuryModificationNote?: string;
  illustrationType: 'squat' | 'pushup' | 'row' | 'plank' | 'lunge' | 'overhead_press' | 'glute_bridge' | 'deadlift';
  referenceTitle: string;
  referenceUrl: string;
}

export interface WorkoutDayPlan {
  dayIndex: number; // 0 = Monday ... 6 = Sunday
  dayName: string;
  shortName: string;
  title: string;
  focus: string;
  isRestDay: boolean;
  estimatedMinutes: number;
  warmupRoutine: string[];
  cooldownRoutine: string[];
  exercises: ExerciseItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  hindiAlias?: string;
  category: 'breakfast' | 'lunch_dinner' | 'snack' | 'protein_side';
  servingDescription: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  allowedDiets: DietPreference[];
  allergens: AllergenItem[];
  budgetTier: BudgetLevel[];
  prepInstructions: string;
  affordableAlternative: string;
  sourceCitation: string;
}

export interface PlannedMealSlot {
  slotId: string;
  slotName: string;
  timeSuggestion: string;
  foodId: string;
  servingsMultiplier: number; // e.g., 1, 1.25, 1.5, 0.75
}

export interface ProgressLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  waterGlasses: number; // 1 glass = 250ml
  activeMinutes: number;
  workoutCompleted: boolean;
  notes?: string;
}

export interface CompletedSetsMap {
  // key: `${date}_${dayIndex}_${exerciseId}` -> boolean[] of completed sets
  [key: string]: boolean[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode: 'live' | 'demo';
}

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'workouts'
  | 'diet'
  | 'chat'
  | 'progress'
  | 'settings';

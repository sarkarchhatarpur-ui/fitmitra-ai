import React, { useState } from 'react';
import {
  UserProfile,
  EnergyAndMacroTargets,
  WorkoutDayPlan,
  PlannedMealSlot,
  ProgressLogEntry,
  AppView,
} from '../types/fitness';
import { NUTRITION_DATABASE } from '../data/fitnessData';
import { ProgressRing } from './VisualAssets';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Droplets,
  Flame,
  Dumbbell,
  Utensils,
  TrendingUp,
  Info,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { WeeklyConsistencyModal } from './WeeklyConsistencyModal';

interface DashboardViewProps {
  profile: UserProfile;
  targets: EnergyAndMacroTargets;
  weeklyPlan: WorkoutDayPlan[];
  mealSlots: PlannedMealSlot[];
  progressLogs: ProgressLogEntry[];
  todayLog: ProgressLogEntry;
  onUpdateTodayLog: (patch: Partial<ProgressLogEntry>) => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  targets,
  weeklyPlan,
  mealSlots,
  progressLogs,
  todayLog,
  onUpdateTodayLog,
  onNavigate,
}) => {
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showConsistencyModal, setShowConsistencyModal] = useState(false);

  // Determine today's workout (Monday = 0 ... Sunday = 6)
  const jsDay = new Date().getDay();
  const todayDayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const todaysWorkout = weeklyPlan[todayDayIndex] || weeklyPlan[0];

  // Calculate planned meal totals
  const mealDetails = mealSlots.map((slot) => {
    const food =
      NUTRITION_DATABASE.find((f) => f.id === slot.foodId) || NUTRITION_DATABASE[0];
    return {
      ...slot,
      food,
      calories: Math.round(food.calories * slot.servingsMultiplier),
      protein: Math.round(food.protein * slot.servingsMultiplier * 10) / 10,
    };
  });

  const totalMealCalories = mealDetails.reduce((acc, m) => acc + m.calories, 0);
  const totalMealProtein = Math.round(mealDetails.reduce((acc, m) => acc + m.protein, 0));
  const calorieAdherencePct = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (1 - Math.abs(totalMealCalories - targets.targetCalories) / Math.max(1, targets.targetCalories)) *
          100
      )
    )
  );

  // Calculate streak & completed workouts
  const completedWorkoutsCount = progressLogs.filter((l) => l.workoutCompleted).length;
  let currentStreak = 0;
  const sortedDesc = [...progressLogs].sort((a, b) => b.date.localeCompare(a.date));
  const recent7Workouts = sortedDesc.slice(0, 7).filter((l) => l.workoutCompleted).length;
  for (const log of sortedDesc) {
    if (log.workoutCompleted || log.activeMinutes >= 20 || log.waterGlasses >= 6) {
      currentStreak++;
    } else {
      break;
    }
  }

  const targetWaterGlasses = Math.round((targets.waterLiters * 1000) / 250);
  const waterPercentage = Math.round((todayLog.waterGlasses / Math.max(1, targetWaterGlasses)) * 100);
  const activePercentage = Math.round(
    (todayLog.activeMinutes / Math.max(20, profile.sessionDurationMin)) * 100
  );

  const chartData = [...progressLogs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map((entry) => ({
      date: entry.date.slice(5), // MM-DD
      weight: entry.weightKg,
      activeMin: entry.activeMinutes,
    }));

  const weightDelta = Number((todayLog.weightKg - profile.targetWeightKg).toFixed(1));

  return (
    <div className="space-y-8">
      {/* Welcome & Top Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Goal: {profile.goal.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.workoutLocation === 'home' ? 'Home Training' : 'Gym Training'}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.dietPreference.replace('_', ' ')} diet</span>
            {profile.isDemoAccount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-amber-800">Sample Demo Profile Active</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Namaste, {profile.name.replace(' (Demo Account)', '')}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Here is your personalized daily training, nutrition, and recovery snapshot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConsistencyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-950 bg-lime-200/70 border border-lime-400/60 rounded-lg hover:bg-lime-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-900" />
            <span>Weekly Consistency &amp; Calorie Report</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('workouts')}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-900 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Today&apos;s Workout
          </button>
          <button
            type="button"
            onClick={() => onNavigate('diet')}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-lg hover:bg-neutral-200/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Customize Meal Plan
          </button>
        </div>
      </div>

      {/* Inline Weekly Consistency & Calorie Adherence Summary Bar */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <div>
            <span className="text-neutral-500">7-Day Workouts: </span>
            <span className="font-mono font-bold text-neutral-900 tabular-nums">
              {recent7Workouts}/{profile.daysPerWeek} sessions
            </span>
          </div>
          <span className="text-neutral-300 hidden sm:inline" aria-hidden="true">|</span>
          <div>
            <span className="text-neutral-500">Calorie Adherence: </span>
            <span className="font-mono font-bold text-emerald-900 tabular-nums">
              {calorieAdherencePct}% ({totalMealCalories} / {targets.targetCalories} kcal)
            </span>
          </div>
          <span className="text-neutral-300 hidden sm:inline" aria-hidden="true">|</span>
          <div>
            <span className="text-neutral-500">Planned Protein: </span>
            <span className="font-mono font-bold text-neutral-900 tabular-nums">
              {totalMealProtein}g / {targets.proteinGrams}g
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowConsistencyModal(true)}
          className="text-xs font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <span>View Detailed Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <WeeklyConsistencyModal
        isOpen={showConsistencyModal}
        onClose={() => setShowConsistencyModal(false)}
        profile={profile}
        targets={targets}
        mealSlots={mealSlots}
        progressLogs={progressLogs}
        onNavigate={onNavigate}
      />

      {/* Primary KPI Strip (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Current vs Target Weight */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Current vs Target Weight</span>
              <TrendingUp className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                {todayLog.weightKg} kg
              </span>
              <span className="text-xs text-neutral-500 font-mono tabular-nums">
                → Target {profile.targetWeightKg} kg
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-600">
              {Math.abs(weightDelta) < 0.2
                ? 'At target weight!'
                : weightDelta > 0
                ? `${weightDelta} kg to fat-loss goal`
                : `${Math.abs(weightDelta)} kg to muscle-gain goal`}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              Log Weight
            </button>
          </div>
        </div>

        {/* Card 2: BMI & Limitations */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Body Mass Index (BMI)</span>
              <Info className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                {targets.bmi}
              </span>
              <span className="text-xs text-neutral-600 truncate">{targets.bmiCategory}</span>
            </div>
          </div>
          <p className="mt-3 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-snug">
            <strong>Limitation note:</strong> BMI only compares height and total weight—it cannot
            distinguish skeletal muscle from body fat. Track waist size and strength alongside BMI.
          </p>
        </div>

        {/* Card 3: Estimated Calorie & Protein Needs */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Daily Energy &amp; Protein Target</span>
              <Flame className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                {targets.targetCalories} kcal
              </span>
              <span className="text-sm font-semibold font-mono tabular-nums text-emerald-800">
                · {targets.proteinGrams}g Protein
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-mono tabular-nums">
              TDEE: {targets.tdee} kcal · BMR: {targets.bmr}
            </span>
            <button
              type="button"
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              {showAssumptions ? 'Hide Math' : 'Assumptions'}
            </button>
          </div>
        </div>

        {/* Card 4: Streak & Completed Workouts */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span>Consistency &amp; Streak</span>
              <Calendar className="w-4 h-4 text-emerald-800" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-950">
                {currentStreak} Day Streak
              </span>
              <span className="text-xs text-neutral-500 font-mono tabular-nums">
                · {completedWorkoutsCount} Workouts Logged
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-600">
              Today: {todayLog.workoutCompleted ? 'Workout Completed' : 'Workout Pending'}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateTodayLog({ workoutCompleted: !todayLog.workoutCompleted })
              }
              className="font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              {todayLog.workoutCompleted ? 'Undo' : 'Mark Done'}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Calculation Assumptions Box */}
      {showAssumptions && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-xs text-neutral-700 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-neutral-900">
              How Your Calorie &amp; Protein Estimates Are Calculated
            </h2>
            <button
              type="button"
              onClick={() => setShowAssumptions(false)}
              className="text-neutral-500 hover:text-neutral-900 font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {targets.assumptions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {targets.safetyNotice && (
            <p className="text-amber-900 font-medium pt-1">{targets.safetyNotice}</p>
          )}
          <p className="text-neutral-500 pt-1">
            Note: All energy expenditure and food nutrition figures are approximate estimates. Adjust
            intake by ±150 kcal based on your actual 2–3 week weight trend.
          </p>
        </div>
      )}

      {/* Middle Split: Water & Activity Rings + Weekly Weight Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Hydration & Daily Activity Tracker */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              Today&apos;s Hydration &amp; Movement
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              Log your glasses of water (250 ml each) and active movement minutes.
            </p>

            <div className="grid grid-cols-2 gap-6 py-2">
              {/* Hydration Ring & Controls */}
              <div className="flex flex-col items-center text-center">
                <ProgressRing
                  percentage={waterPercentage}
                  size={112}
                  strokeWidth={9}
                  label={`${todayLog.waterGlasses}/${targetWaterGlasses}`}
                  sublabel={`glasses (${(todayLog.waterGlasses * 0.25).toFixed(2)}L)`}
                  colorClass="text-emerald-700"
                />
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    aria-label="Decrease water glasses"
                    onClick={() =>
                      onUpdateTodayLog({
                        waterGlasses: Math.max(0, todayLog.waterGlasses - 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-neutral-800 inline-flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                    Water
                  </span>
                  <button
                    type="button"
                    aria-label="Increase water glasses"
                    onClick={() =>
                      onUpdateTodayLog({
                        waterGlasses: Math.min(24, todayLog.waterGlasses + 1),
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Minutes Ring & Controls */}
              <div className="flex flex-col items-center text-center">
                <ProgressRing
                  percentage={activePercentage}
                  size={112}
                  strokeWidth={9}
                  label={`${todayLog.activeMinutes}m`}
                  sublabel={`goal ${profile.sessionDurationMin}m`}
                  colorClass="text-lime-600"
                />
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    aria-label="Decrease active minutes by 5"
                    onClick={() =>
                      onUpdateTodayLog({
                        activeMinutes: Math.max(0, todayLog.activeMinutes - 5),
                      })
                    }
                    className="w-8 h-8 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-neutral-800">Active Min</span>
                  <button
                    type="button"
                    aria-label="Increase active minutes by 10"
                    onClick={() =>
                      onUpdateTodayLog({
                        activeMinutes: Math.min(300, todayLog.activeMinutes + 10),
                      })
                    }
                    className="w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Target Hydration: {targets.waterLiters} Liters/day</span>
            <span>1 glass = 250 ml</span>
          </div>
        </div>

        {/* Right: Weekly Weight Trend Chart */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Weekly Weight Progress</h2>
              <p className="text-xs text-neutral-500">
                Last 7 logged check-ins (aim for a gentle 0.25–0.75 kg weekly trend)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              Full Progress Tracker →
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#065f46" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#065f46" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#737373' }} />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 11, fill: '#737373' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e5e5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#064e3b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Split: Today's Workout & Today's Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workout Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">
                    Today&apos;s Scheduled Plan ({todaysWorkout.dayName})
                  </p>
                  <h2 className="text-base font-bold text-neutral-900">{todaysWorkout.title}</h2>
                </div>
              </div>
              <span className="font-mono text-xs text-neutral-600 tabular-nums">
                ~{todaysWorkout.estimatedMinutes} min
              </span>
            </div>

            {todaysWorkout.isRestDay ? (
              <div className="bg-neutral-50 rounded-xl p-4 text-sm text-neutral-700 space-y-2">
                <p className="font-semibold text-neutral-900">Active Recovery Day</p>
                <p className="text-xs text-neutral-600">{todaysWorkout.focus}</p>
                <ul className="list-disc pl-5 text-xs text-neutral-600 space-y-1">
                  {todaysWorkout.cooldownRoutine.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {todaysWorkout.exercises.map((ex) => (
                  <div key={ex.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{ex.name}</p>
                      <p className="text-xs text-neutral-500">{ex.muscleGroup}</p>
                    </div>
                    <span className="font-mono text-xs font-medium text-neutral-700 tabular-nums shrink-0">
                      {ex.sets} × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onUpdateTodayLog({ workoutCompleted: !todayLog.workoutCompleted })
              }
              className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                todayLog.workoutCompleted ? 'text-emerald-800' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {todayLog.workoutCompleted ? 'Marked Complete Today' : 'Mark Today Complete'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('workouts')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              <span>Open Workout &amp; Timer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Meals Summary Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Today&apos;s Nutrition Plan</p>
                  <h2 className="text-base font-bold text-neutral-900">
                    {mealDetails.length} Planned Meals ({profile.dietPreference.replace('_', ' ')})
                  </h2>
                </div>
              </div>
              <span className="font-mono text-xs text-emerald-900 font-semibold tabular-nums">
                {totalMealCalories} kcal · {totalMealProtein}g P
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {mealDetails.map((slot) => (
                <div key={slot.slotId} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">
                      {slot.slotName} · {slot.timeSuggestion}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {slot.food.name}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-neutral-700 tabular-nums shrink-0">
                    <div>{slot.calories} kcal</div>
                    <div className="text-emerald-800">{slot.protein}g P</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Target: {targets.targetCalories} kcal · {targets.proteinGrams}g Protein
            </span>
            <button
              type="button"
              onClick={() => onNavigate('diet')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
            >
              <span>Swap Foods or Edit Portions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

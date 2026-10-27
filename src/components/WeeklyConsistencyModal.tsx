import React, { useEffect } from 'react';
import {
  UserProfile,
  EnergyAndMacroTargets,
  PlannedMealSlot,
  ProgressLogEntry,
  AppView,
} from '../types/fitness';
import { NUTRITION_DATABASE } from '../data/fitnessData';
import { ProgressRing } from './VisualAssets';
import {
  X,
  CheckCircle2,
  Flame,
  Dumbbell,
  Droplets,
  Calendar,
  ArrowRight,
  Info,
} from 'lucide-react';

interface WeeklyConsistencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  targets: EnergyAndMacroTargets;
  mealSlots: PlannedMealSlot[];
  progressLogs: ProgressLogEntry[];
  onNavigate?: (view: AppView) => void;
}

export const WeeklyConsistencyModal: React.FC<WeeklyConsistencyModalProps> = ({
  isOpen,
  onClose,
  profile,
  targets,
  mealSlots,
  progressLogs,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Compute 7-day logs window from progressLogs
  const sortedDesc = [...progressLogs].sort((a, b) => b.date.localeCompare(a.date));
  const last7Logs = sortedDesc.slice(0, 7);
  const daysLoggedCount = Math.max(1, last7Logs.length);

  const workoutsCompleted7d = last7Logs.filter((l) => l.workoutCompleted).length;
  const workoutConsistencyPct = Math.min(
    100,
    Math.round((workoutsCompleted7d / Math.max(1, profile.daysPerWeek)) * 100)
  );

  const avgActiveMinutes = Math.round(
    last7Logs.reduce((acc, l) => acc + l.activeMinutes, 0) / daysLoggedCount
  );
  const activeConsistencyPct = Math.min(
    100,
    Math.round((avgActiveMinutes / Math.max(20, profile.sessionDurationMin)) * 100)
  );

  const avgWaterGlasses =
    Math.round(
      (last7Logs.reduce((acc, l) => acc + l.waterGlasses, 0) / daysLoggedCount) * 10
    ) / 10;
  const avgWaterLiters = Number((avgWaterGlasses * 0.25).toFixed(2));
  const targetWaterGlasses = Math.round((targets.waterLiters * 1000) / 250);
  const hydrationAdherencePct = Math.min(
    100,
    Math.round((avgWaterLiters / Math.max(1, targets.waterLiters)) * 100)
  );

  // 2. Compute Calorie & Macro Adherence from mealSlots
  const mealBreakdown = mealSlots.map((slot) => {
    const food =
      NUTRITION_DATABASE.find((f) => f.id === slot.foodId) || NUTRITION_DATABASE[0];
    const mult = slot.servingsMultiplier;
    return {
      slotId: slot.slotId,
      slotName: slot.slotName,
      foodName: food.name,
      servingsMultiplier: mult,
      calories: Math.round(food.calories * mult),
      protein: Number((food.protein * mult).toFixed(1)),
      carbs: Math.round(food.carbs * mult),
      fats: Number((food.fats * mult).toFixed(1)),
    };
  });

  const plannedDailyCalories = mealBreakdown.reduce((sum, m) => sum + m.calories, 0);
  const plannedDailyProtein = Math.round(
    mealBreakdown.reduce((sum, m) => sum + m.protein, 0)
  );
  const plannedDailyCarbs = mealBreakdown.reduce((sum, m) => sum + m.carbs, 0);
  const plannedDailyFats = Math.round(
    mealBreakdown.reduce((sum, m) => sum + m.fats, 0)
  );

  // Calorie adherence score: 100% when planned calories match targetCalories, tapering off by deviation
  const calorieDelta = plannedDailyCalories - targets.targetCalories;
  const calorieDeviationRatio =
    Math.abs(calorieDelta) / Math.max(1, targets.targetCalories);
  const calorieAdherencePct = Math.max(
    0,
    Math.min(100, Math.round((1 - calorieDeviationRatio) * 100))
  );

  const proteinAdherencePct = Math.min(
    100,
    Math.round((plannedDailyProtein / Math.max(1, targets.proteinGrams)) * 100)
  );

  // Overall Weekly Consistency Composite Score
  const overallWeeklyScore = Math.round(
    workoutConsistencyPct * 0.35 +
      calorieAdherencePct * 0.3 +
      proteinAdherencePct * 0.2 +
      hydrationAdherencePct * 0.15
  );

  // Weight delta across the 7-day window
  const newestWeight = last7Logs[0]?.weightKg ?? profile.weightKg;
  const oldestWeight =
    last7Logs[last7Logs.length - 1]?.weightKg ?? profile.weightKg;
  const weeklyWeightDelta = Number((newestWeight - oldestWeight).toFixed(1));

  // Generate tailored coaching insights from the data
  const insights: string[] = [];
  if (workoutsCompleted7d >= profile.daysPerWeek) {
    insights.push(
      `You hit 100% of your weekly workout target (${workoutsCompleted7d}/${profile.daysPerWeek} sessions). Great training discipline.`
    );
  } else {
    insights.push(
      `You logged ${workoutsCompleted7d} of your ${profile.daysPerWeek} planned workouts in the last ${last7Logs.length} logged days. Scheduling a 25-minute home session can help close the gap.`
    );
  }

  if (Math.abs(calorieDelta) <= 120) {
    insights.push(
      `Your meal plan averages ${plannedDailyCalories} kcal/day, which is within ${Math.abs(
        calorieDelta
      )} kcal of your ${targets.targetCalories} kcal target (${calorieAdherencePct}% adherence).`
    );
  } else if (calorieDelta < -120) {
    insights.push(
      `Your current meal plan (${plannedDailyCalories} kcal) is ${Math.abs(
        calorieDelta
      )} kcal below your ${targets.targetCalories} kcal target. Consider increasing portion multipliers slightly in the Diet Planner to sustain energy.`
    );
  } else {
    insights.push(
      `Your current meal plan (${plannedDailyCalories} kcal) is +${calorieDelta} kcal above your ${targets.targetCalories} kcal target. Adjusting 1 meal portion by -0.25× will align your intake.`
    );
  }

  if (plannedDailyProtein < targets.proteinGrams - 10) {
    insights.push(
      `Planned daily protein is ${plannedDailyProtein}g vs your ${targets.proteinGrams}g target. Adding soya chunks, paneer, curd, or boiled eggs to one meal will improve recovery.`
    );
  } else {
    insights.push(
      `Protein adherence is strong at ${plannedDailyProtein}g/day (${proteinAdherencePct}% of your ${targets.proteinGrams}g target).`
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-consistency-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-neutral-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Last {last7Logs.length} Logged Days</span>
              <span aria-hidden="true">·</span>
              <span>{mealSlots.length} Daily Meal Slots</span>
              <span aria-hidden="true">·</span>
              <span>Goal: {profile.goal.replace('_', ' ')}</span>
            </div>
            <h2
              id="weekly-consistency-modal-title"
              className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight"
            >
              Weekly Consistency &amp; Calorie Adherence Report
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close weekly summary modal"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Progress Rings Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 border border-neutral-200 rounded-xl p-5">
          <div className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={overallWeeklyScore}
              size={96}
              strokeWidth={8}
              label={`${overallWeeklyScore}%`}
              sublabel="composite"
              colorClass="text-emerald-900"
            />
            <span className="text-xs font-bold text-neutral-900 mt-2">
              Overall Consistency
            </span>
            <span className="text-[11px] text-neutral-500">
              Workouts + Nutrition + Water
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={workoutConsistencyPct}
              size={96}
              strokeWidth={8}
              label={`${workoutsCompleted7d}/${profile.daysPerWeek}`}
              sublabel="sessions"
              colorClass="text-emerald-700"
            />
            <span className="text-xs font-bold text-neutral-900 mt-2">
              Workout Adherence
            </span>
            <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
              Avg {avgActiveMinutes}m / day
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={calorieAdherencePct}
              size={96}
              strokeWidth={8}
              label={`${calorieAdherencePct}%`}
              sublabel={`${plannedDailyCalories} kcal`}
              colorClass="text-lime-600"
            />
            <span className="text-xs font-bold text-neutral-900 mt-2">
              Calorie Adherence
            </span>
            <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
              Target {targets.targetCalories} kcal
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <ProgressRing
              percentage={proteinAdherencePct}
              size={96}
              strokeWidth={8}
              label={`${plannedDailyProtein}g`}
              sublabel={`of ${targets.proteinGrams}g`}
              colorClass="text-emerald-800"
            />
            <span className="text-xs font-bold text-neutral-900 mt-2">
              Protein Adherence
            </span>
            <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
              {proteinAdherencePct}% of daily goal
            </span>
          </div>
        </div>

        {/* Two-Column Breakdown: Meal Slot Calorie Adherence & 7-Day Habit Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Calorie & Macro Adherence from mealSlots */}
          <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-800" />
                  <span>Planned Meal Adherence Breakdown</span>
                </h3>
                <span className="font-mono text-xs text-neutral-600 tabular-nums">
                  {calorieDelta === 0
                    ? 'Exact Match'
                    : calorieDelta > 0
                    ? `+${calorieDelta} kcal vs target`
                    : `${calorieDelta} kcal vs target`}
                </span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {mealBreakdown.map((item) => {
                  const sharePct = Math.round(
                    (item.calories / Math.max(1, plannedDailyCalories)) * 100
                  );
                  return (
                    <div
                      key={item.slotId}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {item.slotName}: {item.foodName}
                        </p>
                        <p className="text-neutral-500 font-mono tabular-nums">
                          Portion {item.servingsMultiplier}× · {sharePct}% of daily kcal
                        </p>
                      </div>
                      <div className="text-right font-mono tabular-nums shrink-0">
                        <div className="font-bold text-neutral-900">{item.calories} kcal</div>
                        <div className="text-emerald-800">{item.protein}g P</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono tabular-nums">
              <span className="text-neutral-600">
                Macros: {plannedDailyProtein}g P · {plannedDailyCarbs}g C · {plannedDailyFats}g F
              </span>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('diet');
                  }}
                  className="font-sans font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Adjust Meals</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right: 7-Day Activity, Hydration & Weight Summary + Coaching Takeaways */}
          <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-3">
                <Dumbbell className="w-4 h-4 text-emerald-800" />
                <span>7-Day Logged Habit Averages</span>
              </h3>

              <div className="grid grid-cols-3 gap-2.5 text-xs mb-4">
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3">
                  <div className="text-neutral-500 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Avg Water</span>
                  </div>
                  <div className="text-base font-bold font-mono tabular-nums text-neutral-950 mt-1">
                    {avgWaterLiters}L
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    {avgWaterGlasses}/{targetWaterGlasses} glasses
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3">
                  <div className="text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Avg Active</span>
                  </div>
                  <div className="text-base font-bold font-mono tabular-nums text-neutral-950 mt-1">
                    {avgActiveMinutes} min
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    {activeConsistencyPct}% of {profile.sessionDurationMin}m
                  </div>
                </div>

                <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3">
                  <div className="text-neutral-500">7d Weight Δ</div>
                  <div className="text-base font-bold font-mono tabular-nums text-neutral-950 mt-1">
                    {weeklyWeightDelta > 0
                      ? `+${weeklyWeightDelta}`
                      : weeklyWeightDelta}{' '}
                    kg
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    Now {newestWeight} kg
                  </div>
                </div>
              </div>

              {/* Actionable Weekly Insights */}
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 space-y-2">
                <p className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Coach Observations</span>
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                  {insights.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                  Based on {last7Logs.length} recent log entries
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate('progress');
                  }}
                  className="font-semibold text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Log Today&apos;s Check-In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Day-by-Day Recent Logs Table */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-900">
              Recent Daily Consistency Log (Last {last7Logs.length} Entries)
            </span>
            <span className="font-mono text-neutral-500 tabular-nums">
              Target: {profile.daysPerWeek} workouts/wk · {targets.waterLiters}L water/day
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 bg-white">
                  <th className="py-2.5 px-4 font-semibold">Date</th>
                  <th className="py-2.5 px-4 font-semibold">Workout Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Active Min</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Hydration</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Weight (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {last7Logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/70">
                    <td className="py-2.5 px-4 font-mono tabular-nums text-neutral-900">
                      {log.date}
                    </td>
                    <td className="py-2.5 px-4">
                      {log.workoutCompleted ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500">Rest / Not Logged</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-right text-neutral-700">
                      {log.activeMinutes} min
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-right text-neutral-700">
                      {log.waterGlasses} gl ({(log.waterGlasses * 0.25).toFixed(2)}L)
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-right font-semibold text-neutral-900">
                      {log.weightKg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
          <p className="text-[11px] text-neutral-500">
            Calorie adherence reflects your customized daily meal plan relative to your estimated
            TDEE goal.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

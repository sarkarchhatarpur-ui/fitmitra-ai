import React, { useState } from 'react';
import {
  UserProfile,
  EnergyAndMacroTargets,
  PlannedMealSlot,
  FoodItem,
} from '../types/fitness';
import {
  NUTRITION_DATABASE,
  getCompatibleFoods,
} from '../data/fitnessData';
import {
  Utensils,
  RotateCcw,
  ShieldAlert,
  ArrowLeftRight,
  Plus,
  Minus,
  Info,
} from 'lucide-react';

interface DietPlannerProps {
  profile: UserProfile;
  targets: EnergyAndMacroTargets;
  mealSlots: PlannedMealSlot[];
  onUpdateSlot: (slotId: string, patch: Partial<PlannedMealSlot>) => void;
  onResetMealPlan: () => void;
}

export const DietPlanner: React.FC<DietPlannerProps> = ({
  profile,
  targets,
  mealSlots,
  onUpdateSlot,
  onResetMealPlan,
}) => {
  const [swappingSlotId, setSwappingSlotId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | FoodItem['category']>('all');

  const compatibleFoods = getCompatibleFoods(profile);
  const availableSwapPool =
    compatibleFoods.length > 0
      ? compatibleFoods
      : NUTRITION_DATABASE.filter((f) => f.allowedDiets.includes(profile.dietPreference));

  const enrichedSlots = mealSlots.map((slot) => {
    const food =
      NUTRITION_DATABASE.find((f) => f.id === slot.foodId) ||
      availableSwapPool[0] ||
      NUTRITION_DATABASE[0];
    const mult = slot.servingsMultiplier;
    return {
      ...slot,
      food,
      grams: Math.round(food.servingGrams * mult),
      calories: Math.round(food.calories * mult),
      protein: Number((food.protein * mult).toFixed(1)),
      carbs: Math.round(food.carbs * mult),
      fats: Number((food.fats * mult).toFixed(1)),
      fiber: Number((food.fiber * mult).toFixed(1)),
    };
  });

  const totals = enrichedSlots.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: Math.round((acc.protein + item.protein) * 10) / 10,
      carbs: acc.carbs + item.carbs,
      fats: Math.round((acc.fats + item.fats) * 10) / 10,
      fiber: Math.round((acc.fiber + item.fiber) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  const adjustPortion = (slotId: string, currentMult: number, delta: number) => {
    const next = Math.min(2.5, Math.max(0.5, Math.round((currentMult + delta) * 4) / 4));
    onUpdateSlot(slotId, { servingsMultiplier: next });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Diet: {profile.dietPreference.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Budget: {profile.budget.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.mealFrequency} Meals/Day</span>
            {profile.allergies.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-medium">
                  Excluded Allergens: {profile.allergies.join(', ')}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Personalized Indian &amp; Global Diet Planner
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Whole-food meals with gram weights, household katori/roti measures, preparation steps,
            and budget-friendly ingredient swaps.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetMealPlan}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Default Meal Plan</span>
        </button>
      </div>

      {/* Daily Macro Summary Strip */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-bold text-neutral-900">
            Total Daily Planned Macros vs Estimated Target
          </h2>
          <span className="text-xs text-neutral-500">
            Source: IFCT 2017 (NIN India) &amp; USDA FoodData Central approximate values
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <span className="text-xs text-neutral-500">Total Calories</span>
            <div className="text-xl font-bold font-mono tabular-nums text-neutral-950 mt-1">
              {totals.calories} kcal
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Target ~{targets.targetCalories} kcal
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <span className="text-xs text-neutral-500">Protein</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-900 mt-1">
              {totals.protein} g
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Target ~{targets.proteinGrams} g
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <span className="text-xs text-neutral-500">Carbohydrates</span>
            <div className="text-xl font-bold font-mono tabular-nums text-neutral-950 mt-1">
              {totals.carbs} g
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Target ~{targets.carbsGrams} g
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <span className="text-xs text-neutral-500">Dietary Fats</span>
            <div className="text-xl font-bold font-mono tabular-nums text-neutral-950 mt-1">
              {totals.fats} g
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Target ~{targets.fatsGrams} g
            </span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-4 col-span-2 sm:col-span-1">
            <span className="text-xs text-neutral-500">Dietary Fiber</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
              {totals.fiber} g
            </div>
            <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
              Recommended 28–35g
            </span>
          </div>
        </div>
      </div>

      {/* Meal Cards List */}
      <div className="space-y-5">
        {enrichedSlots.map((slot) => {
          const isSwapping = swappingSlotId === slot.slotId;

          return (
            <div
              key={slot.slotId}
              className="bg-white border border-neutral-200 rounded-2xl p-6 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span className="font-bold text-emerald-900">{slot.slotName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{slot.timeSuggestion}</span>
                    {slot.food.hindiAlias && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{slot.food.hindiAlias}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-950">
                    {slot.food.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-700 font-medium">
                    Serving Size:{' '}
                    <span className="font-mono font-semibold text-emerald-950">
                      {slot.servingsMultiplier}×
                    </span>{' '}
                    ({slot.food.servingDescription} — approx.{' '}
                    <span className="font-mono">{slot.grams}g</span> cooked weight)
                  </p>

                  {/* Preparation & Affordable Swap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/70 text-xs text-neutral-700">
                      <p className="font-bold text-neutral-900 mb-1">
                        Meal Preparation Instructions:
                      </p>
                      <p className="leading-relaxed">{slot.food.prepInstructions}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/70 text-xs text-neutral-700">
                      <p className="font-bold text-emerald-950 mb-1">
                        Affordable Ingredient Alternative:
                      </p>
                      <p className="leading-relaxed">{slot.food.affordableAlternative}</p>
                    </div>
                  </div>
                </div>

                {/* Right Macros & Interactive Controls */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between bg-neutral-50 border border-neutral-200/90 rounded-xl p-4 space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between border-b border-neutral-200 pb-2 mb-3">
                      <span className="text-xs text-neutral-500">Meal Energy</span>
                      <span className="text-lg font-bold font-mono tabular-nums text-neutral-950">
                        {slot.calories} kcal
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs tabular-nums">
                      <div className="bg-white rounded-lg p-2 border border-neutral-200/70">
                        <div className="text-neutral-500 text-[10px]">Protein</div>
                        <div className="font-bold text-emerald-900">{slot.protein}g</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-neutral-200/70">
                        <div className="text-neutral-500 text-[10px]">Carbs</div>
                        <div className="font-bold text-neutral-900">{slot.carbs}g</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-neutral-200/70">
                        <div className="text-neutral-500 text-[10px]">Fats</div>
                        <div className="font-bold text-neutral-900">{slot.fats}g</div>
                      </div>
                    </div>
                  </div>

                  {/* Portion Multiplier Control */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                    <span className="text-xs font-semibold text-neutral-700">Portion Size:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease portion size"
                        onClick={() =>
                          adjustPortion(slot.slotId, slot.servingsMultiplier, -0.25)
                        }
                        className="w-7 h-7 rounded-md bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold w-12 text-center tabular-nums">
                        {slot.servingsMultiplier}×
                      </span>
                      <button
                        type="button"
                        aria-label="Increase portion size"
                        onClick={() =>
                          adjustPortion(slot.slotId, slot.servingsMultiplier, 0.25)
                        }
                        className="w-7 h-7 rounded-md bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Substitute / Swap Food Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setSwappingSlotId(isSwapping ? null : slot.slotId)
                    }
                    className="w-full py-2 px-3 rounded-lg bg-white border border-neutral-300 text-xs font-semibold text-emerald-950 hover:bg-neutral-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{isSwapping ? 'Close Food Picker' : 'Substitute Meal Item'}</span>
                  </button>
                </div>
              </div>

              {/* Food Substitution Drawer */}
              {isSwapping && (
                <div className="mt-5 pt-5 border-t border-neutral-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-emerald-800" />
                      <span>
                        Select a {profile.dietPreference.replace('_', ' ')} Replacement for{' '}
                        {slot.slotName}
                      </span>
                    </h4>

                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                      {(
                        [
                          { id: 'all', label: 'All Compatible' },
                          { id: 'breakfast', label: 'Breakfasts' },
                          { id: 'lunch_dinner', label: 'Dal / Roti / Rice Mains' },
                          { id: 'snack', label: 'High-Protein Snacks' },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCategoryFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                            categoryFilter === tab.id
                              ? 'bg-white text-neutral-950 shadow-xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSwapPool
                      .filter(
                        (f) => categoryFilter === 'all' || f.category === categoryFilter
                      )
                      .map((item) => {
                        const isCurrent = item.id === slot.food.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onUpdateSlot(slot.slotId, { foodId: item.id });
                              setSwappingSlotId(null);
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-950 text-white border-emerald-950'
                                : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:border-emerald-800'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold leading-snug">{item.name}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  isCurrent ? 'text-emerald-200' : 'text-neutral-500'
                                }`}
                              >
                                {item.servingDescription}
                              </div>
                            </div>
                            <div
                              className={`mt-3 pt-2 border-t flex items-center justify-between font-mono text-xs tabular-nums ${
                                isCurrent
                                  ? 'border-emerald-800 text-lime-300'
                                  : 'border-neutral-200 text-emerald-900'
                              }`}
                            >
                              <span>{item.calories} kcal</span>
                              <span>
                                {item.protein}g P · {item.carbs}g C · {item.fats}g F
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nutrition Transparency & Anti-Crash-Diet Notice */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-600 leading-relaxed space-y-1">
          <p className="font-semibold text-neutral-900">
            Transparent Nutrition Dataset &amp; Safe Dieting Policy
          </p>
          <p>
            Calorie, protein, carbohydrate, and fat values are approximate estimates derived from
            the Indian Food Composition Tables (IFCT 2017, National Institute of Nutrition) and USDA
            FoodData Central for standard home-cooked recipes. Actual values vary based on cooking
            oil, grain variety, and moisture content.
          </p>
          <p className="flex items-center gap-1.5 text-emerald-950 font-medium pt-1">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              FitMitra AI strictly prohibits crash diets, extreme calorie restriction, dehydration
              tactics, and unregulated fat-burner supplements.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

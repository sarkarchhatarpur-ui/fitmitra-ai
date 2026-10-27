import React, { useState } from 'react';
import {
  UserProfile,
  FitnessGoal,
  BiologicalSex,
  ActivityLevel,
  ExperienceLevel,
  WorkoutLocation,
  DietPreference,
  BudgetLevel,
  EquipmentItem,
  InjuryLimitation,
  AllergenItem,
} from '../types/fitness';
import {
  Save,
  Trash2,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onLoadDemoAccount: () => void;
  onDeleteAllData: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onSaveProfile,
  onLoadDemoAccount,
  onDeleteAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [targetWeightKg, setTargetWeightKg] = useState(String(profile.targetWeightKg));
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [sex, setSex] = useState<BiologicalSex>(profile.sex);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [experience, setExperience] = useState<ExperienceLevel>(profile.experience);
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>(profile.workoutLocation);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(profile.daysPerWeek);
  const [sessionDurationMin, setSessionDurationMin] = useState<number>(profile.sessionDurationMin);
  const [dietPreference, setDietPreference] = useState<DietPreference>(profile.dietPreference);
  const [budget, setBudget] = useState<BudgetLevel>(profile.budget);
  const [mealFrequency, setMealFrequency] = useState<3 | 4 | 5>(profile.mealFrequency);
  const [allergies, setAllergies] = useState<AllergenItem[]>(profile.allergies);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(profile.equipment);
  const [injuries, setInjuries] = useState<InjuryLimitation[]>(profile.injuries);
  const [safeBeginnerMode, setSafeBeginnerMode] = useState<boolean>(profile.safeBeginnerMode);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  const toggleItem = <T extends string>(list: T[], item: T, setter: (val: T[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter a valid name (at least 2 characters).');
      return;
    }
    const ageNum = Number(age);
    const hNum = Number(heightCm);
    const wNum = Number(weightKg);
    const twNum = Number(targetWeightKg);

    if (!Number.isFinite(ageNum) || ageNum < 14 || ageNum > 95) {
      setErrorMessage('Age must be between 14 and 95 years.');
      return;
    }
    if (!Number.isFinite(hNum) || hNum < 110 || hNum > 235) {
      setErrorMessage('Height must be between 110 cm and 235 cm.');
      return;
    }
    if (!Number.isFinite(wNum) || wNum < 30 || wNum > 250) {
      setErrorMessage('Weight must be between 30 kg and 250 kg.');
      return;
    }
    if (!Number.isFinite(twNum) || twNum < 35 || twNum > 250) {
      setErrorMessage('Target weight must be between 35 kg and 250 kg.');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      age: Math.round(ageNum),
      heightCm: Number(hNum.toFixed(0)),
      weightKg: Number(wNum.toFixed(1)),
      targetWeightKg: Number(twNum.toFixed(1)),
      goal,
      sex,
      activityLevel,
      experience,
      workoutLocation,
      daysPerWeek,
      sessionDurationMin,
      dietPreference,
      budget,
      mealFrequency,
      allergies,
      equipment: equipment.length > 0 ? equipment : ['bodyweight'],
      injuries,
      safeBeginnerMode,
      isDemoAccount: false,
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(updated);
    setSaveMessage(
      'Profile, workout split, and daily nutrition targets have been recalculated and saved to localStorage.'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs text-neutral-500 mb-1">
            Personalize Goals · Dietary Restrictions · Schedule · Privacy Controls
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Profile &amp; Settings
          </h1>
        </div>

        <button
          type="button"
          onClick={onLoadDemoAccount}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Load Sample Demo Account</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Body Metrics & Goals */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-neutral-900">1. Personal Metrics &amp; Goal</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="set-name" className="block text-xs font-semibold text-neutral-700 mb-1">
                Name
              </label>
              <input
                id="set-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="set-age" className="block text-xs font-semibold text-neutral-700 mb-1">
                Age (years)
              </label>
              <input
                id="set-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="set-sex" className="block text-xs font-semibold text-neutral-700 mb-1">
                Sex (optional for BMR)
              </label>
              <select
                id="set-sex"
                value={sex}
                onChange={(e) => setSex(e.target.value as BiologicalSex)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white focus:outline-none focus:border-emerald-800"
              >
                <option value="unspecified">Prefer not to say (Midpoint)</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-height" className="block text-xs font-semibold text-neutral-700 mb-1">
                Height (cm)
              </label>
              <input
                id="set-height"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="set-weight" className="block text-xs font-semibold text-neutral-700 mb-1">
                Current Weight (kg)
              </label>
              <input
                id="set-weight"
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="set-target-weight" className="block text-xs font-semibold text-neutral-700 mb-1">
                Target Weight (kg)
              </label>
              <input
                id="set-target-weight"
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="set-goal" className="block text-xs font-semibold text-neutral-700 mb-1">
                Primary Goal
              </label>
              <select
                id="set-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white focus:outline-none focus:border-emerald-800"
              >
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength">Strength</option>
                <option value="general_fitness">General Fitness</option>
                <option value="maintenance">Weight Maintenance</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-activity" className="block text-xs font-semibold text-neutral-700 mb-1">
                Daily Activity Level
              </label>
              <select
                id="set-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white focus:outline-none focus:border-emerald-800"
              >
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Workout Schedule & Equipment */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-neutral-900">
            2. Workout Schedule, Equipment &amp; Joint Modifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="set-exp" className="block text-xs font-semibold text-neutral-700 mb-1">
                Experience
              </label>
              <select
                id="set-exp"
                value={experience}
                onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-loc" className="block text-xs font-semibold text-neutral-700 mb-1">
                Workout Location
              </label>
              <select
                id="set-loc"
                value={workoutLocation}
                onChange={(e) => setWorkoutLocation(e.target.value as WorkoutLocation)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
              >
                <option value="home">At Home</option>
                <option value="gym">Commercial Gym</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-days" className="block text-xs font-semibold text-neutral-700 mb-1">
                Days Per Week
              </label>
              <select
                id="set-days"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono bg-white"
              >
                {[2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    {d} Days / Week
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="set-duration" className="block text-xs font-semibold text-neutral-700 mb-1">
                Session Duration
              </label>
              <select
                id="set-duration"
                value={sessionDurationMin}
                onChange={(e) => setSessionDurationMin(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono bg-white"
              >
                {[25, 40, 50, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} Minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-neutral-700 mb-2">
              Available Equipment
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'bodyweight', label: 'Bodyweight' },
                  { id: 'dumbbells', label: 'Dumbbells' },
                  { id: 'resistance_bands', label: 'Resistance Bands' },
                  { id: 'kettlebell', label: 'Kettlebell' },
                  { id: 'pullup_bar', label: 'Pull-Up Bar' },
                  { id: 'full_gym', label: 'Full Gym Machines' },
                ] as const
              ).map((eq) => {
                const active = equipment.includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleItem(equipment, eq.id, setEquipment)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-emerald-950 text-white border-emerald-950'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <span>{eq.label}</span>
                    {active && <Check className="w-3.5 h-3.5 text-lime-300" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-neutral-700 mb-2">
              Joint Sensitivities / Movement Limitations
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'knee_discomfort', label: 'Knee Discomfort' },
                  { id: 'lower_back_sensitivity', label: 'Lower Back Sensitivity' },
                  { id: 'shoulder_impingement', label: 'Shoulder Sensitivity' },
                  { id: 'wrist_sensitivity', label: 'Wrist Discomfort' },
                  { id: 'ankle_mobility', label: 'Ankle Stiffness' },
                ] as const
              ).map((inj) => {
                const active = injuries.includes(inj.id);
                return (
                  <button
                    key={inj.id}
                    type="button"
                    onClick={() => toggleItem(injuries, inj.id, setInjuries)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-amber-900 text-white border-amber-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <span>{inj.label}</span>
                    {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Dietary Preferences & Allergies */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-neutral-900">
            3. Dietary Preference, Budget &amp; Allergies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="set-diet" className="block text-xs font-semibold text-neutral-700 mb-1">
                Dietary Preference
              </label>
              <select
                id="set-diet"
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value as DietPreference)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
              >
                <option value="vegetarian">Vegetarian (Lacto-Veg)</option>
                <option value="vegan">Vegan (Plant-Based)</option>
                <option value="egg_inclusive">Eggetarian (Veg + Eggs)</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-budget" className="block text-xs font-semibold text-neutral-700 mb-1">
                Food Budget Tier
              </label>
              <select
                id="set-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value as BudgetLevel)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm bg-white"
              >
                <option value="budget_friendly">Budget-Friendly</option>
                <option value="moderate">Moderate</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="set-meals" className="block text-xs font-semibold text-neutral-700 mb-1">
                Meals Per Day
              </label>
              <select
                id="set-meals"
                value={mealFrequency}
                onChange={(e) => setMealFrequency(Number(e.target.value) as 3 | 4 | 5)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-mono bg-white"
              >
                <option value={3}>3 Meals / Day</option>
                <option value={4}>4 Meals / Day</option>
                <option value={5}>5 Meals / Day</option>
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-neutral-700 mb-2">
              Excluded Food Allergens
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'dairy', label: 'Dairy / Lactose' },
                  { id: 'gluten', label: 'Wheat / Gluten' },
                  { id: 'soy', label: 'Soy / Soya' },
                  { id: 'nuts', label: 'Peanuts / Tree Nuts' },
                  { id: 'eggs', label: 'Eggs' },
                  { id: 'seafood', label: 'Fish / Seafood' },
                ] as const
              ).map((al) => {
                const active = allergies.includes(al.id);
                return (
                  <button
                    key={al.id}
                    type="button"
                    onClick={() => toggleItem(allergies, al.id, setAllergies)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-amber-900 text-white border-amber-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <span>{al.label}</span>
                    {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {saveMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
            {saveMessage}
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences &amp; Recalculate Plan</span>
          </button>
        </div>
      </form>

      {/* Section 4: Local Storage Privacy Notice & Delete Personal Data */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-neutral-600 leading-relaxed">
            <h3 className="text-sm font-bold text-neutral-900">
              Transparent Data Storage &amp; Privacy Notice
            </h3>
            <p>
              FitMitra AI stores your profile, meal preferences, completed sets, and progress logs
              exclusively in your web browser&apos;s local storage (<code className="font-mono">localStorage</code>).
              We do not use fake authentication or silently store your personal health records on
              external cloud databases.
            </p>
            <p>
              When you use the AI Coach Chat in Live AI mode, only your question and summarized
              fitness context are sent to the server-side AI endpoint to generate a response. You
              can permanently erase all locally stored data from this browser at any time below.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
          {!confirmDeleteOpen ? (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Personal Data</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-red-800">
                Permanently erase your profile, meal plan, and progress logs from this browser?
              </span>
              <button
                type="button"
                onClick={onDeleteAllData}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete Everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-3 py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

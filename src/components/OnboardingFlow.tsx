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
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

interface OnboardingFlowProps {
  initialProfile?: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
  onLoadDemo: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel,
  onLoadDemo,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<string>(initialProfile ? String(initialProfile.age) : '27');
  const [heightCm, setHeightCm] = useState<string>(
    initialProfile ? String(initialProfile.heightCm) : '170'
  );
  const [weightKg, setWeightKg] = useState<string>(
    initialProfile ? String(initialProfile.weightKg) : '72'
  );
  const [targetWeightKg, setTargetWeightKg] = useState<string>(
    initialProfile ? String(initialProfile.targetWeightKg) : '68'
  );
  const [sex, setSex] = useState<BiologicalSex>(initialProfile?.sex || 'unspecified');
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'fat_loss');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    initialProfile?.activityLevel || 'moderately_active'
  );

  // Step 2: Workout setup
  const [experience, setExperience] = useState<ExperienceLevel>(
    initialProfile?.experience || 'beginner'
  );
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>(
    initialProfile?.workoutLocation || 'home'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(initialProfile?.daysPerWeek || 4);
  const [sessionDurationMin, setSessionDurationMin] = useState<number>(
    initialProfile?.sessionDurationMin || 40
  );
  const [equipment, setEquipment] = useState<EquipmentItem[]>(
    initialProfile?.equipment || ['bodyweight', 'dumbbells']
  );

  // Step 3: Diet & Nutrition
  const [dietPreference, setDietPreference] = useState<DietPreference>(
    initialProfile?.dietPreference || 'vegetarian'
  );
  const [allergies, setAllergies] = useState<AllergenItem[]>(initialProfile?.allergies || []);
  const [budget, setBudget] = useState<BudgetLevel>(initialProfile?.budget || 'moderate');
  const [mealFrequency, setMealFrequency] = useState<3 | 4 | 5>(
    initialProfile?.mealFrequency || 4
  );
  const [dietaryRestrictionsNote, setDietaryRestrictionsNote] = useState<string>(
    initialProfile?.dietaryRestrictionsNote || ''
  );

  // Step 4: Injuries & Safety
  const [injuries, setInjuries] = useState<InjuryLimitation[]>(initialProfile?.injuries || []);
  const [injuryNotes, setInjuryNotes] = useState<string>(initialProfile?.injuryNotes || '');
  const [safeBeginnerMode, setSafeBeginnerMode] = useState<boolean>(
    initialProfile?.safeBeginnerMode ?? true
  );

  const toggleItem = <T extends string>(list: T[], item: T, setter: (val: T[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 14 || ageNum > 95) {
      newErrors.age = 'Please enter a valid age between 14 and 95 years.';
    }
    const hNum = Number(heightCm);
    if (!Number.isFinite(hNum) || hNum < 110 || hNum > 235) {
      newErrors.heightCm = 'Please enter a valid height between 110 cm and 235 cm.';
    }
    const wNum = Number(weightKg);
    if (!Number.isFinite(wNum) || wNum < 30 || wNum > 250) {
      newErrors.weightKg = 'Please enter a valid weight between 30 kg and 250 kg.';
    }
    const twNum = Number(targetWeightKg);
    if (!Number.isFinite(twNum) || twNum < 35 || twNum > 250) {
      newErrors.targetWeightKg = 'Please enter a realistic target weight between 35 kg and 250 kg.';
    } else if (Number.isFinite(hNum) && hNum >= 110) {
      const targetBmi = twNum / Math.pow(hNum / 100, 2);
      if (targetBmi < 17.0) {
        newErrors.targetWeightKg =
          'This target weight falls into a severely underweight BMI (<17). Please choose a safe, healthy target weight.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (daysPerWeek < 2 || daysPerWeek > 6) {
      newErrors.daysPerWeek = 'Please select between 2 and 6 training days per week.';
    }
    if (sessionDurationMin < 20 || sessionDurationMin > 90) {
      newErrors.sessionDurationMin = 'Session duration must be between 20 and 90 minutes.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      setStep(1);
      return;
    }

    const finalEquip: EquipmentItem[] =
      equipment.length === 0 ? ['bodyweight'] : equipment.includes('bodyweight') ? equipment : ['bodyweight', ...equipment];

    const nowIso = new Date().toISOString();
    const profile: UserProfile = {
      name: name.trim(),
      age: Math.round(Number(age)),
      heightCm: Number(heightCm),
      weightKg: Number(Number(weightKg).toFixed(1)),
      targetWeightKg: Number(Number(targetWeightKg).toFixed(1)),
      goal,
      sex,
      activityLevel,
      experience,
      workoutLocation,
      daysPerWeek,
      sessionDurationMin,
      dietPreference,
      allergies,
      dietaryRestrictionsNote: dietaryRestrictionsNote.trim(),
      budget,
      mealFrequency,
      equipment: finalEquip,
      injuries,
      injuryNotes: injuryNotes.trim(),
      safeBeginnerMode,
      isDemoAccount: false,
      createdAt: initialProfile?.createdAt || nowIso,
      updatedAt: nowIso,
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLoadDemo}
              className="text-xs font-semibold text-emerald-900 underline underline-offset-4 hover:text-emerald-700 cursor-pointer"
            >
              Skip &amp; Load Sample Demo Account
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Body Metrics & Primary Goal'}
              {step === 2 && 'Experience, Schedule & Equipment'}
              {step === 3 && 'Indian & Global Nutrition Preferences'}
              {step === 4 && 'Joint Safety & Health Limitations'}
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-900 transition-all duration-200"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs"
          noValidate
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-neutral-950">
                  Tell us about yourself and your goal
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  We use these metrics to estimate your daily energy needs and tailor your training
                  volume.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="onb-name" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="onb-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Priya Nair"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="onb-age" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                    Age (years) *
                  </label>
                  <input
                    id="onb-age"
                    type="number"
                    min={14}
                    max={95}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
                  />
                  {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label htmlFor="onb-height" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                    Height (cm) *
                  </label>
                  <input
                    id="onb-height"
                    type="number"
                    min={110}
                    max={235}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
                  />
                  {errors.heightCm && <p className="text-xs text-red-600 mt-1">{errors.heightCm}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="onb-weight" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Current Weight (kg) *
                    </label>
                    <input
                      id="onb-weight"
                      type="number"
                      step="0.1"
                      min={30}
                      max={250}
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="onb-target-weight" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                      Target Weight (kg) *
                    </label>
                    <input
                      id="onb-target-weight"
                      type="number"
                      step="0.1"
                      min={35}
                      max={250}
                      value={targetWeightKg}
                      onChange={(e) => setTargetWeightKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
                    />
                  </div>
                  {(errors.weightKg || errors.targetWeightKg) && (
                    <p className="col-span-2 text-xs text-red-600">
                      {errors.weightKg || errors.targetWeightKg}
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Sex for BMR Estimation */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1">
                  Sex (Optional — used only when estimating resting energy requirements)
                </label>
                <p className="text-xs text-neutral-500 mb-2.5">
                  If left unspecified, FitMitra uses a balanced midpoint coefficient in the
                  Mifflin-St Jeor energy equation.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'unspecified', label: 'Prefer not to say' },
                      { id: 'female', label: 'Female' },
                      { id: 'male', label: 'Male' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSex(opt.id)}
                      className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        sex === opt.id
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Primary Fitness Goal *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'fat_loss', label: 'Fat Loss', desc: 'Sustainable ~400 kcal deficit' },
                      { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Hypertrophy + lean surplus' },
                      { id: 'strength', label: 'Strength', desc: 'Progressive compound lifts' },
                      { id: 'general_fitness', label: 'General Fitness', desc: 'Stamina, mobility & tone' },
                      { id: 'maintenance', label: 'Weight Maintenance', desc: 'Recomposition & energy' },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        goal === g.id
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{g.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          goal === g.id ? 'text-emerald-200' : 'text-neutral-500'
                        }`}
                      >
                        {g.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Daily Activity Level (outside workouts) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, under 4,000 steps/day' },
                      { id: 'lightly_active', label: 'Lightly Active', desc: '4,000–7,000 steps/day' },
                      { id: 'moderately_active', label: 'Moderately Active', desc: '7,000–10,000 steps/day' },
                      { id: 'very_active', label: 'Very Active', desc: '10,000+ steps or physical job' },
                    ] as const
                  ).map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityLevel(act.id)}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        activityLevel === act.id
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{act.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          activityLevel === act.id ? 'text-emerald-200' : 'text-neutral-500'
                        }`}
                      >
                        {act.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  Workout Experience, Location &amp; Equipment
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Customize where you train, how many days you can commit, and what equipment you
                  have access to.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Training Experience *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'beginner', label: 'Beginner', desc: '0–6 months consistent' },
                      { id: 'intermediate', label: 'Intermediate', desc: '6–24 months experience' },
                      { id: 'advanced', label: 'Advanced', desc: '2+ years structured lifting' },
                    ] as const
                  ).map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => {
                        setExperience(exp.id);
                        if (exp.id === 'beginner') setSafeBeginnerMode(true);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        experience === exp.id
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{exp.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          experience === exp.id ? 'text-emerald-200' : 'text-neutral-500'
                        }`}
                      >
                        {exp.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Preferred Workout Location *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { id: 'home', label: 'At Home' },
                        { id: 'gym', label: 'Commercial Gym' },
                      ] as const
                    ).map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setWorkoutLocation(loc.id);
                          if (loc.id === 'gym' && !equipment.includes('full_gym')) {
                            setEquipment(['bodyweight', 'dumbbells', 'full_gym']);
                          }
                        }}
                        className={`py-3 px-4 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${
                          workoutLocation === loc.id
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {loc.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Days Available Per Week: <span className="font-mono">{daysPerWeek} days</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5, 6].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDaysPerWeek(d)}
                        className={`flex-1 py-2.5 rounded-lg border font-mono text-sm font-semibold cursor-pointer ${
                          daysPerWeek === d
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                  {errors.daysPerWeek && (
                    <p className="text-xs text-red-600 mt-1">{errors.daysPerWeek}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Session Duration (minutes):{' '}
                  <span className="font-mono">{sessionDurationMin} min</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[25, 40, 50, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionDurationMin(mins)}
                      className={`py-2.5 rounded-lg border font-mono text-sm font-semibold cursor-pointer ${
                        sessionDurationMin === mins
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Equipment Available (select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'bodyweight', label: 'Bodyweight / Mat' },
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
                        className={`p-3 rounded-xl border text-left text-sm font-medium flex items-center justify-between cursor-pointer ${
                          active
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{eq.label}</span>
                        {active && <Check className="w-4 h-4 text-lime-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  Dietary Preference, Allergies &amp; Budget
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  We create your meal plan using everyday Indian and global whole foods. Non-veg
                  items are only shown when explicitly selected.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Dietary Preference *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        id: 'vegetarian',
                        label: 'Vegetarian (Lacto-Veg)',
                        desc: 'Dal, roti, rice, paneer, curd, soya, chana, rajma, oats, veggies',
                      },
                      {
                        id: 'vegan',
                        label: 'Vegan (100% Plant-Based)',
                        desc: 'Soya chunks, kala chana, rajma, moong sprouts, sattu, oats, tofu',
                      },
                      {
                        id: 'egg_inclusive',
                        label: 'Eggetarian (Veg + Eggs)',
                        desc: 'All vegetarian foods plus boiled eggs and masala egg bhurji',
                      },
                      {
                        id: 'non_vegetarian',
                        label: 'Non-Vegetarian',
                        desc: 'Includes lean chicken breast, fish curry, eggs, and veg staples',
                      },
                    ] as const
                  ).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietPreference(d.id)}
                      className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        dietPreference === d.id
                          ? 'bg-emerald-950 text-white border-emerald-950'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{d.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          dietPreference === d.id ? 'text-emerald-200' : 'text-neutral-500'
                        }`}
                      >
                        {d.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Food Budget Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'budget_friendly', label: 'Economy' },
                        { id: 'moderate', label: 'Moderate' },
                        { id: 'flexible', label: 'Flexible' },
                      ] as const
                    ).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudget(b.id)}
                        className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold cursor-pointer ${
                          budget === b.id
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-800 mb-2">
                    Meals Per Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([3, 4, 5] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setMealFrequency(freq)}
                        className={`py-2.5 px-3 rounded-lg border font-mono text-xs sm:text-sm font-semibold cursor-pointer ${
                          mealFrequency === freq
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {freq} Meals
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Food Allergies or Intolerances (automatically excluded from meal plan)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                        className={`p-2.5 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer ${
                          active
                            ? 'bg-amber-900 text-white border-amber-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{al.label}</span>
                        {active && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="onb-diet-note" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                  Additional Dietary Restrictions or Regional Preferences (Optional)
                </label>
                <input
                  id="onb-diet-note"
                  type="text"
                  value={dietaryRestrictionsNote}
                  onChange={(e) => setDietaryRestrictionsNote(e.target.value)}
                  placeholder="e.g., Jain vegetarian on Tuesdays, prefer South Indian breakfasts, low oil"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950">
                  Joint Comfort, Injuries &amp; Safe Beginner Mode
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Let us know if any joints feel sensitive so we can provide lower-impact exercise
                  modifications automatically.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Current Joint Sensitivities or Movement Limitations (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      { id: 'knee_discomfort', label: 'Knee Discomfort (deep squats/lunges)' },
                      { id: 'lower_back_sensitivity', label: 'Lower Back Sensitivity (bending/hinging)' },
                      { id: 'shoulder_impingement', label: 'Shoulder Sensitivity (overhead pressing)' },
                      { id: 'wrist_sensitivity', label: 'Wrist Discomfort (floor push-ups/planks)' },
                      { id: 'ankle_mobility', label: 'Ankle Stiffness or Balance Limitation' },
                    ] as const
                  ).map((inj) => {
                    const active = injuries.includes(inj.id);
                    return (
                      <button
                        key={inj.id}
                        type="button"
                        onClick={() => toggleItem(injuries, inj.id, setInjuries)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium flex items-center justify-between cursor-pointer ${
                          active
                            ? 'bg-emerald-950 text-white border-emerald-950'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{inj.label}</span>
                        {active && <Check className="w-4 h-4 text-lime-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {injuries.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <p className="font-semibold mb-1">
                      Safety Warning — Exercise Modifications Enabled (No Medical Diagnosis)
                    </p>
                    <p>
                      FitMitra will highlight low-shear alternatives (such as Supine Glute Bridges,
                      Box Squats, and Incline Push-Ups) for your selected areas. Because FitMitra AI
                      cannot diagnose or treat injuries, please stop immediately if you feel sharp,
                      radiating, or worsening pain and consult a licensed physiotherapist or doctor.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="onb-injury-notes" className="block text-sm font-semibold text-neutral-800 mb-1.5">
                  Health or Movement Notes (Optional)
                </label>
                <input
                  id="onb-injury-notes"
                  type="text"
                  value={injuryNotes}
                  onChange={(e) => setInjuryNotes(e.target.value)}
                  placeholder="e.g., Mild right knee stiffness after long sitting hours"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Enable Safe Beginner Mode
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Uses conservative set volumes (2 sets per exercise), longer rest intervals, and
                    gentle box/incline progressions.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={safeBeginnerMode}
                  onClick={() => setSafeBeginnerMode(!safeBeginnerMode)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    safeBeginnerMode
                      ? 'bg-emerald-900 text-white'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                  }`}
                >
                  {safeBeginnerMode ? 'Enabled' : 'Standard Pace'}
                </button>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 leading-relaxed">
                  By completing setup, you acknowledge that all calorie, protein, and workout
                  suggestions are approximate general wellness estimates stored locally in your
                  browser—not medical prescriptions.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-neutral-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Generate My Personalized Plan</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

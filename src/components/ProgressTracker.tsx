import React, { useState } from 'react';
import {
  UserProfile,
  EnergyAndMacroTargets,
  PlannedMealSlot,
  ProgressLogEntry,
  AppView,
} from '../types/fitness';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Download,
  Plus,
  Trash2,
  TrendingUp,
  Calendar,
  Info,
  BarChart3,
} from 'lucide-react';
import { WeeklyConsistencyModal } from './WeeklyConsistencyModal';

interface ProgressTrackerProps {
  profile: UserProfile;
  targets: EnergyAndMacroTargets;
  mealSlots: PlannedMealSlot[];
  progressLogs: ProgressLogEntry[];
  onSaveLogEntry: (entry: ProgressLogEntry) => void;
  onDeleteLogEntry: (id: string) => void;
  onNavigate?: (view: AppView) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  profile,
  targets,
  mealSlots,
  progressLogs,
  onSaveLogEntry,
  onDeleteLogEntry,
  onNavigate,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];

  const [logDate, setLogDate] = useState<string>(todayIso);
  const [weightInput, setWeightInput] = useState<string>(String(profile.weightKg));
  const [waistInput, setWaistInput] = useState<string>('');
  const [waterInput, setWaterInput] = useState<string>('8');
  const [activeMinInput, setActiveMinInput] = useState<string>('40');
  const [workoutDoneInput, setWorkoutDoneInput] = useState<boolean>(true);
  const [notesInput, setNotesInput] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [chartRange, setChartRange] = useState<'weekly' | 'monthly'>('weekly');
  const [showConsistencyModal, setShowConsistencyModal] = useState<boolean>(false);

  const sortedAsc = [...progressLogs].sort((a, b) => a.date.localeCompare(b.date));
  const sortedDesc = [...progressLogs].sort((a, b) => b.date.localeCompare(a.date));

  const visibleLogs =
    chartRange === 'weekly' ? sortedAsc.slice(-7) : sortedAsc.slice(-30);

  const chartData = visibleLogs.map((entry) => ({
    date: entry.date.slice(5),
    weight: entry.weightKg,
    waist: entry.waistCm ?? null,
    activeMinutes: entry.activeMinutes,
  }));

  const latestWeight =
    sortedDesc.length > 0 ? sortedDesc[0].weightKg : profile.weightKg;
  const startingWeight =
    sortedAsc.length > 0 ? sortedAsc[0].weightKg : profile.weightKg;

  const totalChange = Number((latestWeight - startingWeight).toFixed(1));
  const distanceToTarget = Number((latestWeight - profile.targetWeightKg).toFixed(1));

  // Estimate realistic timeline at ~0.45 kg / week
  const realisticWeeks = Math.max(
    1,
    Math.round(Math.abs(distanceToTarget) / 0.45)
  );

  const completedWorkouts = progressLogs.filter((l) => l.workoutCompleted).length;

  let habitStreak = 0;
  for (const l of sortedDesc) {
    if (l.workoutCompleted || l.activeMinutes >= 20 || l.waterGlasses >= 6) {
      habitStreak++;
    } else {
      break;
    }
  }

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const wNum = Number(weightInput);
    if (!Number.isFinite(wNum) || wNum < 30 || wNum > 250) {
      setFormError('Please enter a valid weight between 30 kg and 250 kg.');
      return;
    }

    let waistNum: number | undefined;
    if (waistInput.trim() !== '') {
      const parsedWaist = Number(waistInput);
      if (!Number.isFinite(parsedWaist) || parsedWaist < 45 || parsedWaist > 180) {
        setFormError('Waist measurement must be between 45 cm and 180 cm (or left blank).');
        return;
      }
      waistNum = Number(parsedWaist.toFixed(1));
    }

    const waterNum = Math.max(0, Math.min(30, Math.round(Number(waterInput) || 0)));
    const activeNum = Math.max(0, Math.min(360, Math.round(Number(activeMinInput) || 0)));

    const newEntry: ProgressLogEntry = {
      id: `log_${logDate}`,
      date: logDate,
      weightKg: Number(wNum.toFixed(1)),
      waistCm: waistNum,
      waterGlasses: waterNum,
      activeMinutes: activeNum,
      workoutCompleted: workoutDoneInput,
      notes: notesInput.trim() || undefined,
    };

    onSaveLogEntry(newEntry);
    setFormSuccess(`Saved progress entry for ${logDate}.`);
    setNotesInput('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Date',
      'Weight_kg',
      'Waist_cm',
      'Water_Glasses_250ml',
      'Active_Minutes',
      'Workout_Completed',
      'Notes',
    ];

    const rows = sortedDesc.map((entry) => [
      entry.date,
      entry.weightKg,
      entry.waistCm ?? '',
      entry.waterGlasses,
      entry.activeMinutes,
      entry.workoutCompleted ? 'Yes' : 'No',
      `"${(entry.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fitmitra_progress_${todayIso}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header & CSV Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs text-neutral-500 mb-1">
            Body Metrics · Waist Circumference · Workout Consistency
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Progress &amp; Habit Tracker
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Track weight, optional waist measurements, and completed sessions over time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConsistencyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lime-200/70 border border-lime-400/60 text-emerald-950 text-xs sm:text-sm font-semibold hover:bg-lime-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-900" />
            <span>Weekly Consistency &amp; Calorie Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-900 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Data to CSV</span>
          </button>
        </div>
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

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <span className="text-xs text-neutral-500">Latest Logged Weight</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-950 mt-1">
            {latestWeight} kg
          </div>
          <span className="text-xs text-neutral-500 font-mono tabular-nums">
            Change from start: {totalChange > 0 ? `+${totalChange}` : totalChange} kg
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <span className="text-xs text-neutral-500">Target Weight Progress</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-900 mt-1">
            {profile.targetWeightKg} kg
          </div>
          <span className="text-xs text-neutral-500">
            {Math.abs(distanceToTarget) < 0.2
              ? 'Goal weight reached!'
              : `~${Math.abs(distanceToTarget)} kg remaining (~${realisticWeeks} wks at safe pace)`}
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <span className="text-xs text-neutral-500">Completed Workouts</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-950 mt-1">
            {completedWorkouts} Sessions
          </div>
          <span className="text-xs text-neutral-500">
            Scheduled: {profile.daysPerWeek} days/week
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <span className="text-xs text-neutral-500">Active Habit Streak</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 mt-1">
            {habitStreak} Days
          </div>
          <span className="text-xs text-neutral-500">
            Consistent movement &amp; hydration
          </span>
        </div>
      </div>

      {/* Log Entry Form + Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Log Check-In Form */}
        <form
          onSubmit={handleAddLog}
          className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-neutral-900">Log Daily Check-In</h2>

          <div>
            <label htmlFor="prog-date" className="block text-xs font-semibold text-neutral-700 mb-1">
              Date *
            </label>
            <input
              id="prog-date"
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono focus:outline-none focus:border-emerald-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prog-weight" className="block text-xs font-semibold text-neutral-700 mb-1">
                Weight (kg) *
              </label>
              <input
                id="prog-weight"
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="prog-waist" className="block text-xs font-semibold text-neutral-700 mb-1">
                Waist (cm, optional)
              </label>
              <input
                id="prog-waist"
                type="number"
                step="0.1"
                placeholder="e.g. 84.5"
                value={waistInput}
                onChange={(e) => setWaistInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prog-water" className="block text-xs font-semibold text-neutral-700 mb-1">
                Water (250ml glasses)
              </label>
              <input
                id="prog-water"
                type="number"
                min={0}
                max={30}
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>

            <div>
              <label htmlFor="prog-active" className="block text-xs font-semibold text-neutral-700 mb-1">
                Active Minutes
              </label>
              <input
                id="prog-active"
                type="number"
                min={0}
                max={360}
                value={activeMinInput}
                onChange={(e) => setActiveMinInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm font-mono tabular-nums focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label htmlFor="prog-workout-done" className="text-xs font-semibold text-neutral-800">
              Completed Workout Today?
            </label>
            <input
              id="prog-workout-done"
              type="checkbox"
              checked={workoutDoneInput}
              onChange={(e) => setWorkoutDoneInput(e.target.checked)}
              className="w-4 h-4 accent-emerald-900 rounded cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="prog-notes" className="block text-xs font-semibold text-neutral-700 mb-1">
              Notes (Optional)
            </label>
            <input
              id="prog-notes"
              type="text"
              placeholder="e.g., Added 2 reps on squats"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
            />
          </div>

          {formError && <p className="text-xs text-red-600">{formError}</p>}
          {formSuccess && <p className="text-xs text-emerald-800 font-medium">{formSuccess}</p>}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Progress Entry</span>
          </button>
        </form>

        {/* Right: Interactive Charts */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-800" />
                  <span>Weight &amp; Waist Measurement Trend</span>
                </h2>
                <p className="text-xs text-neutral-500">
                  Healthy, sustainable fat loss or muscle gain averages 0.25–0.75 kg per week.
                </p>
              </div>

              {/* Weekly vs Monthly Segmented Filter */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setChartRange('weekly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                    chartRange === 'weekly'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Weekly (7 Entries)
                </button>
                <button
                  type="button"
                  onClick={() => setChartRange('monthly')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                    chartRange === 'monthly'
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Monthly (30 Entries)
                </button>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#737373' }} />
                  <YAxis
                    domain={['auto', 'auto']}
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
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#064e3b"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#064e3b' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waist"
                    name="Waist (cm)"
                    stroke="#65a30d"
                    strokeWidth={2}
                    connectNulls
                    dot={{ r: 3, fill: '#65a30d' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Minutes Bar Chart */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h3 className="text-base font-bold text-neutral-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span>Daily Active Movement Minutes</span>
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Consistency of daily workouts and brisk walks across logged days
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#737373' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#737373' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e5e5',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="activeMinutes"
                    name="Active Minutes"
                    fill="#065f46"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Log Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">Logged History</h2>
          <span className="font-mono text-xs text-neutral-500 tabular-nums">
            {sortedDesc.length} Entries
          </span>
        </div>

        {sortedDesc.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No progress entries logged yet. Use the form above to record your first check-in.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Weight (kg)</th>
                  <th className="py-3 px-4 font-semibold text-right">Waist (cm)</th>
                  <th className="py-3 px-4 font-semibold text-right">Water</th>
                  <th className="py-3 px-4 font-semibold text-right">Active Min</th>
                  <th className="py-3 px-4 font-semibold">Workout</th>
                  <th className="py-3 px-4 font-semibold">Notes</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedDesc.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-50/80">
                    <td className="py-3 px-4 font-mono tabular-nums text-neutral-900">
                      {entry.date}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right font-semibold text-neutral-950">
                      {entry.weightKg}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-neutral-600">
                      {entry.waistCm ?? '—'}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-neutral-700">
                      {entry.waterGlasses} gl ({(entry.waterGlasses * 0.25).toFixed(2)}L)
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right text-neutral-700">
                      {entry.activeMinutes}m
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {entry.workoutCompleted ? (
                        <span className="font-semibold text-emerald-800">Completed</span>
                      ) : (
                        <span className="text-neutral-500">Rest / Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 max-w-xs truncate">
                      {entry.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        aria-label={`Delete log for ${entry.date}`}
                        onClick={() => onDeleteLogEntry(entry.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Realistic Expectations Note */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs text-neutral-600">
        <Info className="w-4 h-4 text-emerald-900 shrink-0 mt-0.5" />
        <p>
          <strong>Realistic Progress Expectations:</strong> Daily body weight naturally fluctuates by
          0.5 to 1.5 kg due to hydration, glycogen storage, and meal sodium. FitMitra avoids
          unrealistic rapid weight-loss promises—aim for a steady 0.25 to 0.75 kg weekly trend while
          preserving strength and energy.
        </p>
      </div>
    </div>
  );
};

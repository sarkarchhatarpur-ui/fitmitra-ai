import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutDayPlan,
  CompletedSetsMap,
} from '../types/fitness';
import { ExerciseIllustration } from './VisualAssets';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Clock,
  Flame,
} from 'lucide-react';

interface WorkoutPlannerProps {
  profile: UserProfile;
  weeklyPlan: WorkoutDayPlan[];
  completedSets: CompletedSetsMap;
  todayIso: string;
  onToggleSet: (dayIndex: number, exerciseId: string, setIdx: number, totalSets: number) => void;
  onToggleSafeBeginnerMode: () => void;
  onMarkTodayWorkoutDone: () => void;
  todayWorkoutCompleted: boolean;
}

export const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({
  profile,
  weeklyPlan,
  completedSets,
  todayIso,
  onToggleSet,
  onToggleSafeBeginnerMode,
  onMarkTodayWorkoutDone,
  todayWorkoutCompleted,
}) => {
  const jsDay = new Date().getDay();
  const defaultDayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(defaultDayIdx);

  // Built-in Rest & Workout Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerInitial, setTimerInitial] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const startPresetTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const activeDayPlan = weeklyPlan[selectedDayIdx] || weeklyPlan[0];

  // Count completed sets for the selected day
  const totalDaySets = activeDayPlan.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedDaySets = activeDayPlan.exercises.reduce((acc, ex) => {
    const key = `${todayIso}_${activeDayPlan.dayIndex}_${ex.id}`;
    const arr = completedSets[key] || [];
    return acc + arr.filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header & Safe Beginner Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs text-neutral-500 mb-1">
            {profile.daysPerWeek} Days/Week · {profile.workoutLocation === 'home' ? 'Home Setup' : 'Commercial Gym'} ·{' '}
            {profile.experience} level
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            Weekly Workout Split &amp; Form Tutorials
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleSafeBeginnerMode}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              profile.safeBeginnerMode
                ? 'bg-emerald-950 text-lime-300 border-emerald-950'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              Safe Beginner Mode: {profile.safeBeginnerMode ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={onMarkTodayWorkoutDone}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              todayWorkoutCompleted
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-emerald-900 text-white hover:bg-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {todayWorkoutCompleted ? 'Today Logged as Complete' : 'Complete Today’s Workout'}
            </span>
          </button>
        </div>
      </div>

      {/* Day Selector Segmented Bar + Interactive Rest Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 7-Day Selector */}
        <div className="lg:col-span-8 bg-neutral-100 p-1.5 rounded-xl grid grid-cols-7 gap-1">
          {weeklyPlan.map((day) => {
            const isSelected = day.dayIndex === selectedDayIdx;
            return (
              <button
                key={day.dayIndex}
                type="button"
                onClick={() => setSelectedDayIdx(day.dayIndex)}
                className={`py-2.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white text-neutral-950 shadow-xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="text-xs whitespace-nowrap">{day.shortName}</div>
                <div
                  className={`text-[10px] mt-0.5 truncate ${
                    day.isRestDay ? 'text-neutral-400' : 'text-emerald-800 font-semibold'
                  }`}
                >
                  {day.isRestDay ? 'Rest' : 'Train'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Built-In Rest & Interval Timer */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-emerald-800" />
              <span>Rest &amp; Plank Timer</span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-neutral-950 mt-0.5">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[30, 60, 75, 90].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => startPresetTimer(sec)}
                  className="px-2 py-0.5 text-[11px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded cursor-pointer"
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
              onClick={() => {
                if (timerSeconds === 0) setTimerSeconds(timerInitial);
                setTimerRunning(!timerRunning);
              }}
              className="w-10 h-10 rounded-lg bg-emerald-900 text-white flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              aria-label="Reset timer"
              onClick={() => {
                setTimerRunning(false);
                setTimerSeconds(timerInitial);
              }}
              className="w-10 h-10 rounded-lg border border-neutral-200 text-neutral-700 flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Day Header & Warm-up / Cool-down */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <span>{activeDayPlan.dayName}</span>
              <span aria-hidden="true">·</span>
              <span>~{activeDayPlan.estimatedMinutes} Minutes</span>
              <span aria-hidden="true">·</span>
              <span>{activeDayPlan.focus}</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-950 mt-1">{activeDayPlan.title}</h2>
          </div>

          {!activeDayPlan.isRestDay && (
            <div className="text-right font-mono text-xs text-neutral-700 tabular-nums">
              <span className="font-semibold text-emerald-900">{completedDaySets}</span> /{' '}
              {totalDaySets} Sets Checked
            </div>
          )}
        </div>

        {/* Warm-up & Cool-down Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-xs font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-800" />
              <span>Warm-Up Protocol (5 Minutes)</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-600 list-disc pl-4">
              {activeDayPlan.warmupRoutine.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>Cool-Down &amp; Recovery (5 Minutes)</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-600 list-disc pl-4">
              {activeDayPlan.cooldownRoutine.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Rest Day Card OR Exercise Cards */}
      {activeDayPlan.isRestDay ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-neutral-950 mb-2">
            Scheduled Rest &amp; Tissue Recovery Day
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed mb-4">
            Muscles adapt and grow stronger during rest—not during the workout itself. Aim for
            7–8 hours of sleep, hit your daily protein and hydration targets, and enjoy a relaxed
            20–30 minute walk outdoors.
          </p>
          <button
            type="button"
            onClick={onMarkTodayWorkoutDone}
            className="px-5 py-2.5 rounded-lg bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
          >
            Log Active Recovery Walk Completed
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeDayPlan.exercises.map((ex, index) => {
            const setKey = `${todayIso}_${activeDayPlan.dayIndex}_${ex.id}`;
            const setsArr =
              completedSets[setKey] || Array.from({ length: ex.sets }, () => false);
            const isExpanded = expandedExerciseId === ex.id;

            return (
              <div
                key={ex.id}
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                        <span className="font-mono font-semibold text-emerald-900">
                          0{index + 1}.
                        </span>
                        <span>{ex.muscleGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">Rest {ex.restSeconds}s</span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-950">{ex.name}</h3>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-sm font-bold text-emerald-950 tabular-nums">
                        {ex.sets} Sets
                      </div>
                      <div className="text-xs text-neutral-600 tabular-nums">{ex.reps}</div>
                    </div>
                  </div>

                  {/* Biomechanical SVG Illustration */}
                  <div className="mb-4">
                    <ExerciseIllustration
                      type={ex.illustrationType}
                      muscleGroup={ex.muscleGroup}
                    />
                  </div>

                  {/* Injury Modification Banner if applicable */}
                  {ex.injuryModificationNote && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                      <span>{ex.injuryModificationNote}</span>
                    </div>
                  )}

                  {/* Interactive Set Checkboxes */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-2">
                      <span>Track Completed Sets:</span>
                      <button
                        type="button"
                        onClick={() => startPresetTimer(ex.restSeconds)}
                        className="text-emerald-900 hover:underline font-mono cursor-pointer"
                      >
                        Start {ex.restSeconds}s Rest Timer
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {Array.from({ length: ex.sets }).map((_, sIdx) => {
                        const checked = Boolean(setsArr[sIdx]);
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() =>
                              onToggleSet(activeDayPlan.dayIndex, ex.id, sIdx, ex.sets)
                            }
                            className={`px-3.5 py-2 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              checked
                                ? 'bg-emerald-900 text-white border-emerald-900'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Set {sIdx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-2 text-xs text-neutral-700 bg-neutral-50 rounded-xl p-4 border border-neutral-200/70">
                    <p className="font-bold text-neutral-900">Form &amp; Technique Cues:</p>
                    <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                      {ex.instructions.map((stepText, idx) => (
                        <li key={idx}>{stepText}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Easier Alternative & Progression Accordion */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-xl p-4">
                      <p>
                        <strong className="text-neutral-900">Easier Beginner Regression:</strong>{' '}
                        {ex.easierAlternative}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Next Progression Tip:</strong>{' '}
                        {ex.progressionTip}
                      </p>
                      <p>
                        <strong className="text-neutral-900">Specific Warm-Up Cue:</strong>{' '}
                        {ex.warmupTip}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Links */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedExerciseId(isExpanded ? null : ex.id)
                    }
                    className="font-semibold text-emerald-900 hover:underline cursor-pointer"
                  >
                    {isExpanded ? 'Hide Regression & Tips' : 'Easier Alternative & Progression'}
                  </button>

                  <a
                    href={ex.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
                  >
                    <span>{ex.referenceTitle.split('—')[0].trim()}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

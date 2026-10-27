import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  PlannedMealSlot,
  ProgressLogEntry,
  CompletedSetsMap,
  ChatMessage,
  AppView,
} from './types/fitness';
import {
  calculateEnergyAndMacros,
  generateWeeklyWorkoutPlan,
  generateDefaultMealPlan,
  DEMO_USER_PROFILE,
  createDemoProgressLogs,
} from './data/fitnessData';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DashboardView } from './components/DashboardView';
import { WorkoutPlanner } from './components/WorkoutPlanner';
import { DietPlanner } from './components/DietPlanner';
import { AiCoachChat } from './components/AiCoachChat';
import { ProgressTracker } from './components/ProgressTracker';
import { ProfileSettings } from './components/ProfileSettings';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  MessageSquare,
  TrendingUp,
  Settings,
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'fitmitra_profile_v1',
  MEALS: 'fitmitra_meals_v1',
  PROGRESS: 'fitmitra_progress_v1',
  SETS: 'fitmitra_sets_v1',
  CHAT: 'fitmitra_chat_v1',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const todayIso = new Date().toISOString().split('T')[0];

  const [profile, setProfile] = useState<UserProfile | null>(() =>
    loadJson<UserProfile | null>(STORAGE_KEYS.PROFILE, null)
  );

  const [view, setView] = useState<AppView>(() => {
    const existing = loadJson<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
    return existing ? 'dashboard' : 'landing';
  });

  const [mealSlots, setMealSlots] = useState<PlannedMealSlot[]>(() =>
    loadJson<PlannedMealSlot[]>(STORAGE_KEYS.MEALS, [])
  );

  const [progressLogs, setProgressLogs] = useState<ProgressLogEntry[]>(() =>
    loadJson<ProgressLogEntry[]>(STORAGE_KEYS.PROGRESS, [])
  );

  const [completedSets, setCompletedSets] = useState<CompletedSetsMap>(() =>
    loadJson<CompletedSetsMap>(STORAGE_KEYS.SETS, {})
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadJson<ChatMessage[]>(STORAGE_KEYS.CHAT, [])
  );

  // Persist changes to localStorage
  useEffect(() => {
    try {
      if (profile) {
        window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.PROFILE);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(mealSlots));
    } catch {
      // Ignore
    }
  }, [mealSlots]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressLogs));
    } catch {
      // Ignore
    }
  }, [progressLogs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(completedSets));
    } catch {
      // Ignore
    }
  }, [completedSets]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    } catch {
      // Ignore
    }
  }, [chatMessages]);

  const activeProfile = profile || DEMO_USER_PROFILE;

  const targets = useMemo(
    () => calculateEnergyAndMacros(activeProfile),
    [activeProfile]
  );

  const weeklyPlan = useMemo(
    () => generateWeeklyWorkoutPlan(activeProfile),
    [activeProfile]
  );

  // Ensure mealSlots are populated whenever profile exists
  useEffect(() => {
    if (profile && mealSlots.length === 0) {
      setMealSlots(generateDefaultMealPlan(profile, calculateEnergyAndMacros(profile)));
    }
  }, [profile, mealSlots.length]);

  const todayLog: ProgressLogEntry = useMemo(() => {
    const found = progressLogs.find((l) => l.date === todayIso);
    if (found) return found;
    return {
      id: `log_${todayIso}`,
      date: todayIso,
      weightKg: activeProfile.weightKg,
      waterGlasses: 0,
      activeMinutes: 0,
      workoutCompleted: false,
    };
  }, [progressLogs, todayIso, activeProfile.weightKg]);

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    const newTargets = calculateEnergyAndMacros(newProfile);
    const defaultMeals = generateDefaultMealPlan(newProfile, newTargets);
    setProfile(newProfile);
    setMealSlots(defaultMeals);
    setProgressLogs([
      {
        id: `log_${todayIso}`,
        date: todayIso,
        weightKg: newProfile.weightKg,
        waterGlasses: 4,
        activeMinutes: 20,
        workoutCompleted: false,
        notes: 'Initial profile setup completed.',
      },
    ]);
    setView('dashboard');
  };

  const handleLoadDemo = () => {
    const demoTargets = calculateEnergyAndMacros(DEMO_USER_PROFILE);
    setProfile(DEMO_USER_PROFILE);
    setMealSlots(generateDefaultMealPlan(DEMO_USER_PROFILE, demoTargets));
    setProgressLogs(createDemoProgressLogs());
    setView('dashboard');
  };

  const handleUpdateTodayLog = (patch: Partial<ProgressLogEntry>) => {
    const updatedEntry: ProgressLogEntry = {
      ...todayLog,
      ...patch,
    };
    setProgressLogs((prev) => {
      const exists = prev.some((l) => l.date === todayIso);
      if (exists) {
        return prev.map((l) => (l.date === todayIso ? updatedEntry : l));
      }
      return [...prev, updatedEntry];
    });
    if (typeof patch.weightKg === 'number' && profile) {
      setProfile({ ...profile, weightKg: patch.weightKg });
    }
  };

  const handleSaveLogEntry = (entry: ProgressLogEntry) => {
    setProgressLogs((prev) => {
      const exists = prev.some((l) => l.date === entry.date || l.id === entry.id);
      if (exists) {
        return prev.map((l) =>
          l.date === entry.date || l.id === entry.id ? entry : l
        );
      }
      return [...prev, entry];
    });
    if (entry.date === todayIso && profile) {
      setProfile({ ...profile, weightKg: entry.weightKg });
    }
  };

  const handleDeleteLogEntry = (id: string) => {
    setProgressLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggleSet = (
    dayIndex: number,
    exerciseId: string,
    setIdx: number,
    totalSets: number
  ) => {
    const key = `${todayIso}_${dayIndex}_${exerciseId}`;
    setCompletedSets((prev) => {
      const current = prev[key]
        ? [...prev[key]]
        : Array.from({ length: totalSets }, () => false);
      current[setIdx] = !current[setIdx];
      return {
        ...prev,
        [key]: current,
      };
    });
  };

  const handleUpdateMealSlot = (slotId: string, patch: Partial<PlannedMealSlot>) => {
    setMealSlots((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, ...patch } : slot))
    );
  };

  const handleResetMealPlan = () => {
    setMealSlots(generateDefaultMealPlan(activeProfile, targets));
  };

  const handleSaveProfileSettings = (updated: UserProfile) => {
    const newTargets = calculateEnergyAndMacros(updated);
    setProfile(updated);
    setMealSlots(generateDefaultMealPlan(updated, newTargets));
  };

  const handleDeleteAllData = () => {
    window.localStorage.removeItem(STORAGE_KEYS.PROFILE);
    window.localStorage.removeItem(STORAGE_KEYS.MEALS);
    window.localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    window.localStorage.removeItem(STORAGE_KEYS.SETS);
    window.localStorage.removeItem(STORAGE_KEYS.CHAT);
    setProfile(null);
    setMealSlots([]);
    setProgressLogs([]);
    setCompletedSets({});
    setChatMessages([]);
    setView('landing');
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onStartOnboarding={() => setView('onboarding')}
        onLoadDemo={handleLoadDemo}
        hasExistingProfile={Boolean(profile)}
        onContinueToDashboard={() => setView('dashboard')}
      />
    );
  }

  if (view === 'onboarding') {
    return (
      <OnboardingFlow
        initialProfile={profile}
        onComplete={handleCompleteOnboarding}
        onCancel={() => setView(profile ? 'dashboard' : 'landing')}
        onLoadDemo={handleLoadDemo}
      />
    );
  }

  const navItems: Array<{ id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet Plan', icon: Utensils },
    { id: 'chat', label: 'AI Coach', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      {/* Top Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single wordmark */}
          <button
            type="button"
            onClick={() => setView('landing')}
            className="text-lg font-extrabold tracking-tight text-emerald-950 whitespace-nowrap shrink-0 cursor-pointer"
          >
            FitMitra AI
          </button>

          {/* Zone 2: Clean single-line text nav links */}
          <nav
            aria-label="Primary Workspace Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600"
          >
            {navItems.slice(0, 5).map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-emerald-950 font-bold underline decoration-2 underline-offset-8 decoration-emerald-800'
                      : 'hover:text-neutral-950'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setView('settings')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'settings'
                  ? 'bg-emerald-950 text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200/70'
              }`}
            >
              Profile &amp; Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-24 md:pb-16">
        {view === 'dashboard' && (
          <DashboardView
            profile={activeProfile}
            targets={targets}
            weeklyPlan={weeklyPlan}
            mealSlots={mealSlots}
            progressLogs={progressLogs}
            todayLog={todayLog}
            onUpdateTodayLog={handleUpdateTodayLog}
            onNavigate={setView}
          />
        )}

        {view === 'workouts' && (
          <WorkoutPlanner
            profile={activeProfile}
            weeklyPlan={weeklyPlan}
            completedSets={completedSets}
            todayIso={todayIso}
            onToggleSet={handleToggleSet}
            onToggleSafeBeginnerMode={() => {
              if (profile) {
                setProfile({
                  ...profile,
                  safeBeginnerMode: !profile.safeBeginnerMode,
                });
              }
            }}
            onMarkTodayWorkoutDone={() =>
              handleUpdateTodayLog({ workoutCompleted: !todayLog.workoutCompleted })
            }
            todayWorkoutCompleted={todayLog.workoutCompleted}
          />
        )}

        {view === 'diet' && (
          <DietPlanner
            profile={activeProfile}
            targets={targets}
            mealSlots={mealSlots}
            onUpdateSlot={handleUpdateMealSlot}
            onResetMealPlan={handleResetMealPlan}
          />
        )}

        {view === 'chat' && (
          <AiCoachChat
            profile={activeProfile}
            targets={targets}
            messages={chatMessages}
            onAddMessage={(msg) => setChatMessages((prev) => [...prev, msg])}
            onClearChat={() => setChatMessages([])}
          />
        )}

        {view === 'progress' && (
          <ProgressTracker
            profile={activeProfile}
            targets={targets}
            mealSlots={mealSlots}
            progressLogs={progressLogs}
            onSaveLogEntry={handleSaveLogEntry}
            onDeleteLogEntry={handleDeleteLogEntry}
            onNavigate={setView}
          />
        )}

        {view === 'settings' && (
          <ProfileSettings
            profile={activeProfile}
            onSaveProfile={handleSaveProfileSettings}
            onLoadDemoAccount={handleLoadDemo}
            onDeleteAllData={handleDeleteAllData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (compact height <= 56px to respect 15% sticky budget) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200 px-2 py-1.5 grid grid-cols-6 gap-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                isActive ? 'text-emerald-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

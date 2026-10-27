import React from 'react';
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { ProgressRing } from './VisualAssets';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onLoadDemo: () => void;
  hasExistingProfile: boolean;
  onContinueToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onLoadDemo,
  hasExistingProfile,
  onContinueToDashboard,
}) => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <a
            href="#top"
            className="text-xl font-extrabold tracking-tight text-emerald-950 whitespace-nowrap shrink-0"
          >
            FitMitra AI
          </a>

          <nav
            aria-label="Landing Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600"
          >
            <a
              href="#features"
              className="hover:text-emerald-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Workouts
            </a>
            <a
              href="#nutrition-preview"
              className="hover:text-emerald-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Nutrition
            </a>
            <a
              href="#methodology"
              className="hover:text-emerald-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            <a
              href="#safety-disclaimer"
              className="hover:text-emerald-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Wellness Notice
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={hasExistingProfile ? onContinueToDashboard : onStartOnboarding}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-emerald-900 rounded-lg hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {hasExistingProfile ? 'Open My Dashboard' : 'Start My Fitness Journey'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="top" className="flex-1">
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Column: Editorial Hero Copy & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-semibold text-emerald-800 tracking-wide mb-3">
                Your Personal AI Fitness Coach
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-950 tracking-tight leading-[1.08] mb-6"
                style={{ textWrap: 'balance' }}
              >
                Your Body. Your Goals. Your Plan.
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
                Science-backed home and gym workout splits, transparent Indian &amp; global meal
                planning (from dal-roti and paneer to soya chunks and oats), interactive form
                tutorials, and sustainable progress tracking—built around your schedule, budget, and
                joint comfort.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  type="button"
                  onClick={onStartOnboarding}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-emerald-900 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Start My Fitness Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-emerald-950 bg-neutral-100 border border-neutral-200 rounded-xl hover:bg-neutral-200/70 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-800" />
                  <span>Try Sample Demo Account</span>
                </button>

                {hasExistingProfile && (
                  <button
                    type="button"
                    onClick={onContinueToDashboard}
                    className="px-4 py-3 text-sm font-semibold text-emerald-900 underline underline-offset-4 hover:text-emerald-700 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Resume Saved Profile
                  </button>
                )}
              </div>

              {/* Clean unboxed metadata separator line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span>Mifflin-St Jeor TDEE Modeling</span>
                <span aria-hidden="true">·</span>
                <span>IFCT &amp; USDA Nutrition Values</span>
                <span aria-hidden="true">·</span>
                <span>Safe Beginner &amp; Joint-Friendly Modes</span>
                <span aria-hidden="true">·</span>
                <span>Private Local Browser Storage</span>
              </div>
            </div>

            {/* Right Column: Interactive Visual Preview Card */}
            <div className="lg:col-span-5 flex">
              <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-200">
                    <div>
                      <p className="text-xs text-neutral-500">Sample Daily Blueprint</p>
                      <h2 className="text-lg font-bold text-neutral-900">
                        4-Day Home Strength &amp; Vegetarian Nutrition
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-emerald-900 font-semibold tabular-nums">
                      Week 04
                    </span>
                  </div>

                  {/* Progress rings row */}
                  <div className="grid grid-cols-3 gap-3 py-3 mb-5 bg-white rounded-xl border border-neutral-200/80 px-3">
                    <div className="flex flex-col items-center">
                      <ProgressRing
                        percentage={82}
                        size={86}
                        strokeWidth={7}
                        label="1,920"
                        sublabel="kcal est."
                        colorClass="text-emerald-800"
                      />
                      <span className="text-xs font-medium text-neutral-700 mt-1.5">Calories</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ProgressRing
                        percentage={88}
                        size={86}
                        strokeWidth={7}
                        label="124g"
                        sublabel="of 130g"
                        colorClass="text-lime-600"
                      />
                      <span className="text-xs font-medium text-neutral-700 mt-1.5">Protein</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ProgressRing
                        percentage={75}
                        size={86}
                        strokeWidth={7}
                        label="3 / 4"
                        sublabel="sessions"
                        colorClass="text-emerald-700"
                      />
                      <span className="text-xs font-medium text-neutral-700 mt-1.5">Workouts</span>
                    </div>
                  </div>

                  {/* Sample Today's Items */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                      <div>
                        <p className="font-semibold text-neutral-900">
                          Goblet Squat &amp; Incline Push-Up Split
                        </p>
                        <p className="text-xs text-neutral-500">
                          40 min · Home Dumbbells · Safe Beginner Option
                        </p>
                      </div>
                      <span className="font-mono text-xs text-emerald-800 font-semibold tabular-nums">
                        4 Exercises
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-neutral-200/70">
                      <div>
                        <p className="font-semibold text-neutral-900">
                          Moong Dal Chilla, Paneer &amp; Soya Pulao
                        </p>
                        <p className="text-xs text-neutral-500">
                          4 Meals · Vegetarian · Budget-Friendly Swaps
                        </p>
                      </div>
                      <span className="font-mono text-xs text-emerald-800 font-semibold tabular-nums">
                        124g Protein
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                  <span>Customize in 60 seconds</span>
                  <button
                    type="button"
                    onClick={onStartOnboarding}
                    className="font-semibold text-emerald-900 hover:underline cursor-pointer"
                  >
                    Build Your Plan →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="bg-neutral-50 border-y border-neutral-200 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-emerald-800 mb-2">
                01. Complete Coaching Toolkit
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                Everything you need to train safely, eat well, and stay consistent
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center mb-4">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Personalized Workout Splits
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Adaptive 2-to-6 day weekly routines for home or gym. Includes warm-ups,
                    cool-downs, rest timers, set checkboxes, and a 1-click Safe Beginner Mode.
                  </p>
                </div>
                <p className="text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  Bodyweight · Dumbbells · Resistance Bands · Gym
                </p>
              </div>

              <div
                id="nutrition-preview"
                className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center mb-4">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Indian &amp; Global Diet Planner
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Practical daily meals featuring dal, roti, rice, paneer, dahi, soya chunks,
                    chana, rajma, oats, eggs, and lean meats—with gram weights, household katori
                    measures, and budget swaps.
                  </p>
                </div>
                <p className="text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  Vegetarian · Vegan · Egg-Inclusive · Non-Veg
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Exercise Tutorials &amp; Coach Chat
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Step-by-step posture cues, biomechanical SVG diagrams, easier joint-friendly
                    regressions, and an AI Fitness Coach for form checks and food substitutions.
                  </p>
                </div>
                <p className="text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  Knee, Lower-Back, Shoulder &amp; Wrist Modifications
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-950 text-lime-300 flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Progress &amp; Habit Tracker
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    Log weight, optional waist circumference, hydration, and daily active minutes.
                    Visualize weekly trends and export your full history to CSV anytime.
                  </p>
                </div>
                <p className="text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  Weekly Charts · Habit Streaks · CSV Export
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparent Methodology & Safety Disclaimer Section */}
        <section id="methodology" className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold text-emerald-800 mb-2">
                02. Sustainable, Evidence-Grounded Principles
              </p>
              <h2 className="text-2xl font-bold text-neutral-950 mb-4">
                Zero crash diets. Transparent calculations.
              </h2>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900">Transparent Energy Math:</strong> Uses the
                    Mifflin-St Jeor equation and physical activity multipliers, displaying every
                    assumption clearly on your dashboard.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900">Context Around BMI:</strong> Explains why
                    Body Mass Index cannot distinguish between skeletal muscle mass and adipose
                    tissue, encouraging waist and strength tracking alongside weight.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-neutral-900">Safe Minimum Floors:</strong> Never
                    recommends extreme calorie restriction, dehydration tactics, or unregulated
                    supplements.
                  </span>
                </li>
              </ul>
            </div>

            <div
              id="safety-disclaimer"
              className="lg:col-span-6 bg-neutral-50 border border-neutral-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-900 shrink-0" />
                <h3 className="text-base font-bold text-neutral-900">
                  Wellness &amp; Medical Disclaimer
                </h3>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-3">
                FitMitra AI provides general fitness, exercise education, and nutritional wellness
                estimates for informational purposes only. It is <strong>not</strong> a medical
                device and does not provide medical diagnosis, physical therapy, or clinical dietetic
                treatment.
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Always consult a qualified physician or healthcare professional before starting a
                new exercise or nutrition program, especially if you are pregnant, managing chronic
                health conditions (such as diabetes, hypertension, or cardiovascular disease), or
                recovering from orthopedic injuries. Your profile and logs are saved locally in your
                browser&apos;s <code className="font-mono">localStorage</code> and can be exported
                or deleted at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>FitMitra AI — Personal Fitness &amp; Nutrition Coach</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
            >
              Create Custom Plan
            </button>
            <button
              type="button"
              onClick={onLoadDemo}
              className="hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
            >
              Load Sample Demo Account
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

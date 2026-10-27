# FitMitra AI — Your Personal AI Fitness Coach

FitMitra AI is a full-stack, mobile-first personal fitness and nutrition coaching web application built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Express + `@google/genai`**.

---

## Core Features

1. **Landing Page**
   - Brand header, hero call-to-action (`Start My Fitness Journey`), interactive sample blueprint preview, feature cards, methodology breakdown, and medical/wellness disclaimer.
   - Includes a 1-click **Sample Demo Account** (`Aarav Sharma`) so users can explore a populated profile immediately.

2. **Validated 4-Step User Onboarding**
   - Collects and validates name, age, height (cm), current weight (kg), target weight (kg), optional sex (used only for Mifflin-St Jeor resting energy calculation), goal, activity level, experience level, workout location (home or gym), days/week, session duration, diet preference (`vegetarian`, `vegan`, `egg_inclusive`, `non_vegetarian`), food allergies, budget tier, meal frequency, equipment, and joint sensitivities.

3. **Personalized Dashboard**
   - Displays current vs. target weight, BMI with explicit limitations, estimated daily calories & protein targets (with expandable Mifflin-St Jeor assumptions), interactive daily water & active minutes rings, Recharts weekly weight trend chart, today's workout, and today's meal plan.

4. **Workout Planner & Exercise Tutorials**
   - Generates a 7-day weekly split with training and active recovery days.
   - Includes custom SVG biomechanical posture diagrams, step-by-step beginner cues, warm-up and cool-down protocols, easier regressions, progression tips, interactive set checkboxes, a built-in **Rest & Interval Timer**, and a 1-click **Safe Beginner Mode**.

5. **Indian & Global Personalized Diet Planner**
   - Grounded in approximate values from the **Indian Food Composition Tables (IFCT 2017, NIN India)** and **USDA FoodData Central**.
   - Supports everyday Indian foods including dal, phulka/roti, rice, paneer, dahi/curd, soya chunks, bhuna chana, rajma, moong dal chilla, poha, idli sambar, sattu, makhana, oats, eggs, chicken breast, and fish curry (non-vegetarian choices are shown only when selected).
   - Every meal is editable with portion multipliers (`0.5×` to `2.5×`), compatible food substitutions, preparation steps, and budget-friendly ingredient swaps.

6. **AI Fitness Coach Chat (Secure Backend + Honest Demo Mode)**
   - Calls `/api/chat` on the Express server (`server.ts`) using `@google/genai` (`gemini-3.8-flash`).
   - Never exposes API keys in client-side code.
   - If `GEMINI_API_KEY` is not configured on the server, the UI transparently labels itself as **Demo Mode — Predefined Evidence-Based Coaching** and serves tailored coaching responses without pretending to be live AI.

7. **Progress & Habit Tracker**
   - Log daily weight, date, optional waist circumference (cm), water intake, active minutes, and workout completion.
   - Toggle between Weekly and Monthly Recharts visualizations and export all data to CSV (`Export Data to CSV`).

8. **Profile, Settings & Privacy Controls**
   - Edit goals, schedule, equipment, dietary restrictions, or permanently erase all locally stored data from `localStorage`.

---

## Project Folder Structure

```text
/
├── .env.example                 # Sample environment variables (no secrets)
├── index.html                   # HTML entry point & Google Fonts
├── metadata.json                # Application metadata
├── package.json                 # Scripts & dependencies
├── server.ts                    # Express server + Vite middleware + Server-side Gemini API
└── src/
    ├── App.tsx                  # Main application state & navigation shell
    ├── index.css                # Tailwind CSS & typography rules
    ├── main.tsx                 # React DOM root
    ├── types/
    │   └── fitness.ts           # TypeScript interfaces for profile, workouts, nutrition, logs
    ├── data/
    │   └── fitnessData.ts       # IFCT/USDA food dataset, exercise library, TDEE/macro math
    └── components/
        ├── VisualAssets.tsx     # Reusable SVG ProgressRing & ExerciseIllustration diagrams
        ├── LandingPage.tsx      # Public landing page & wellness disclaimer
        ├── OnboardingFlow.tsx   # 4-step validated onboarding wizard
        ├── DashboardView.tsx    # Personalized daily dashboard
        ├── WorkoutPlanner.tsx   # Weekly workout split, tutorials, checkboxes & rest timer
        ├── DietPlanner.tsx      # Editable Indian & global meal planner + food swapper
        ├── AiCoachChat.tsx      # AI fitness chat with server status & demo fallback
        ├── ProgressTracker.tsx  # Weight/waist logs, Recharts graphs & CSV export
        └── ProfileSettings.tsx  # Profile editor, privacy notice & local data reset
```

---

## Local Setup & Running Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables (Optional for Live AI Chat)**
   Copy `.env.example` to `.env` and add your Gemini API key if you want Live AI responses in the Coach Chat:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
   *(If `GEMINI_API_KEY` is omitted, the entire application works seamlessly and the Coach Chat runs in clearly labelled Demo Mode.)*

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Type-check and build for production**
   ```bash
   npm run lint
   npm run build
   ```

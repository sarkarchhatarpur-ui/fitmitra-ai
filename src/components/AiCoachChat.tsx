import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  EnergyAndMacroTargets,
  ChatMessage,
} from '../types/fitness';
import { generateDemoCoachReply } from '../data/fitnessData';
import {
  Send,
  ShieldAlert,
  Sparkles,
  Info,
  Trash2,
} from 'lucide-react';

interface AiCoachChatProps {
  profile: UserProfile;
  targets: EnergyAndMacroTargets;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearChat: () => void;
}

const QUICK_PROMPTS = [
  'What are the best affordable Indian vegetarian protein sources?',
  'How do I modify squats if my knees feel sensitive?',
  'How can I progress from incline push-ups to floor push-ups?',
  'Why has my scale weight stalled for 10 days despite eating in a deficit?',
  'Suggest a quick high-protein evening snack under 250 kcal.',
];

export const AiCoachChat: React.FC<AiCoachChatProps> = ({
  profile,
  targets,
  messages,
  onAddMessage,
  onClearChat,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverMode, setServerMode] = useState<'checking' | 'live' | 'demo'>('checking');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/status')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setServerMode(data?.aiConfigured ? 'live' : 'demo');
      })
      .catch(() => {
        if (active) setServerMode('demo');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: serverMode === 'live' ? 'live' : 'demo',
    };

    onAddMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          profileContext: {
            name: profile.name,
            age: profile.age,
            goal: profile.goal,
            dietPreference: profile.dietPreference,
            workoutLocation: profile.workoutLocation,
            daysPerWeek: profile.daysPerWeek,
            experience: profile.experience,
            injuries: profile.injuries,
            targetCalories: targets.targetCalories,
            proteinGrams: targets.proteinGrams,
          },
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.mode === 'live' && data.reply) {
        setServerMode('live');
        onAddMessage({
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'live',
        });
      } else {
        setServerMode('demo');
        const fallbackText = generateDemoCoachReply(trimmed, profile);
        onAddMessage({
          id: `demo_${Date.now()}`,
          role: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'demo',
        });
      }
    } catch {
      setServerMode('demo');
      const fallbackText = generateDemoCoachReply(trimmed, profile);
      onAddMessage({
        id: `demo_${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'demo',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Honest Mode Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span>Coach Mode:</span>
            {serverMode === 'live' ? (
              <span className="font-semibold text-emerald-800">
                Live Server-Side Gemini AI Connected
              </span>
            ) : (
              <span className="font-semibold text-amber-800">
                Demo Mode (Predefined Evidence-Based Coaching)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
            FitMitra AI Fitness &amp; Nutrition Coach
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Ask about exercise technique, home/gym substitutions, Indian vegetarian protein swaps,
            or habit consistency.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClearChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 self-start md:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        )}
      </div>

      {/* Transparent Mode Explanation Notice */}
      {serverMode === 'demo' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-950">
          <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold">
              Demo Mode Active — Predefined Coaching Library
            </p>
            <p className="mt-0.5">
              No server-side <code className="font-mono">GEMINI_API_KEY</code> is currently
              configured, or the live API is unreachable. FitMitra AI is transparently serving
              predefined, evidence-based responses tailored to your profile metrics rather than
              pretending to be live AI. Configure <code className="font-mono">GEMINI_API_KEY</code>{' '}
              on the server environment to enable live AI generation.
            </p>
          </div>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col h-[520px]">
        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="max-w-xl mx-auto text-center py-8 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-950 text-lime-300 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Ask FitMitra Coach a Question
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Tailored to your goal ({profile.goal.replace('_', ' ')}),{' '}
                  {profile.dietPreference.replace('_', ' ')} diet (~{targets.targetCalories} kcal,{' '}
                  {targets.proteinGrams}g protein), and {profile.workoutLocation} setup.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendQuestion(q)}
                    className="text-xs text-left px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 hover:border-emerald-800 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[11px] mb-1 opacity-75">
                  <span className="font-semibold">
                    {msg.role === 'user'
                      ? 'You'
                      : msg.mode === 'live'
                      ? 'FitMitra AI Coach (Live AI)'
                      : 'FitMitra Coach (Demo Mode)'}
                  </span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-600 font-medium">
                Analyzing your profile and preparing coaching guidance...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="border-t border-neutral-200 p-4 bg-neutral-50 rounded-b-2xl flex items-center gap-3"
        >
          <label htmlFor="coach-chat-input" className="sr-only">
            Ask a workout or nutrition question
          </label>
          <input
            id="coach-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about squat form, vegetarian protein, dal/paneer swaps, or workout recovery..."
            className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-emerald-800"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 text-white text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Medical Safety Reminder */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs text-neutral-600">
        <ShieldAlert className="w-4 h-4 text-emerald-900 shrink-0 mt-0.5" />
        <p>
          <strong>Healthcare Safety Notice:</strong> Coaching responses are for general educational
          and wellness support only. If you experience chest pain, dizziness, sharp joint pain, or
          require medical nutrition therapy for a clinical condition, stop exercising and consult a
          qualified physician, physiotherapist, or registered dietitian.
        </p>
      </div>
    </div>
  );
};

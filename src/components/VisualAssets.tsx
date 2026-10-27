import React from 'react';
import { ExerciseItem } from '../types/fitness';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  colorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 108,
  strokeWidth = 9,
  label,
  sublabel,
  colorClass = 'text-emerald-800',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-300`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <span className="font-mono text-base font-semibold text-neutral-900 tabular-nums leading-tight">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] text-neutral-500 leading-tight mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

export const ExerciseIllustration: React.FC<{
  type: ExerciseItem['illustrationType'];
  muscleGroup: string;
}> = ({ type, muscleGroup }) => {
  return (
    <div
      className="relative w-full aspect-[4/3] bg-gradient-to-br from-emerald-950 via-emerald-900 to-neutral-900 rounded-xl overflow-hidden flex flex-col justify-between p-4 text-white border border-emerald-900/30"
      role="img"
      aria-label={`Biomechanical posture diagram for ${type.replace('_', ' ')} targeting ${muscleGroup}`}
    >
      {/* Subtle architectural posture grid */}
      <svg
        className="w-full h-full flex-1"
        viewBox="0 0 280 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Reference alignment lines */}
        <line x1="20" y1="142" x2="260" y2="142" stroke="#A3E635" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="140" y1="18" x2="140" y2="142" stroke="#ffffff" strokeOpacity="0.12" strokeDasharray="3 3" />
        <line x1="75" y1="18" x2="75" y2="142" stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />
        <line x1="205" y1="18" x2="205" y2="142" stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="3 3" />

        {type === 'squat' && (
          <g>
            {/* Squat biomechanics vector */}
            <circle cx="148" cy="40" r="11" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Torso */}
            <line x1="145" y1="52" x2="112" y2="92" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Thigh (parallel) */}
            <line x1="112" y1="92" x2="156" y2="96" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
            {/* Shin */}
            <line x1="156" y1="96" x2="144" y2="140" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Foot */}
            <line x1="140" y1="140" x2="164" y2="140" stroke="#A3E635" strokeWidth="3.5" strokeLinecap="round" />
            {/* Arms holding goblet / counterbalance */}
            <path d="M142 58 L166 74 L158 54" stroke="#D9F99D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Joint markers */}
            <circle cx="112" cy="92" r="4" fill="#A3E635" />
            <circle cx="156" cy="96" r="4" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">90° PARALLEL DEPTH</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Neutral spine · Mid-foot drive</text>
          </g>
        )}

        {type === 'pushup' && (
          <g>
            {/* Pushup plank alignment vector */}
            <circle cx="204" cy="68" r="10" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Rigid body line from shoulder to ankle */}
            <line x1="192" y1="74" x2="72" y2="128" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Arm pressing */}
            <path d="M180 80 L168 108 L184 140" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Foot contact */}
            <line x1="72" y1="128" x2="68" y2="140" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
            <circle cx="136" cy="100" r="4" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">45° ELBOW ARROW TUCK</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Straight head-to-heel brace</text>
          </g>
        )}

        {type === 'glute_bridge' && (
          <g>
            {/* Supine Glute Bridge */}
            <circle cx="72" cy="130" r="9" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Shoulders to Hip to Knee straight diagonal */}
            <line x1="86" y1="134" x2="145" y2="96" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="145" y1="96" x2="188" y2="76" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" />
            {/* Shin vertical */}
            <line x1="188" y1="76" x2="194" y2="140" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="145" cy="96" r="4.5" fill="#A3E635" />
            <circle cx="188" cy="76" r="4" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">2S PEAK GLUTE HOLD</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Ribs down · Drive through heels</text>
          </g>
        )}

        {type === 'row' && (
          <g>
            {/* Bench-supported single-arm row */}
            <rect x="148" y="108" width="64" height="32" rx="4" stroke="#ffffff" strokeOpacity="0.25" fill="none" />
            <circle cx="195" cy="58" r="10" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Flat back torso */}
            <line x1="182" y1="64" x2="112" y2="74" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Pulling arm */}
            <path d="M168 66 L146 48 L152 82" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Supporting leg */}
            <line x1="112" y1="74" x2="96" y2="140" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="146" cy="48" r="4" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">SCAPULAR RETRACTION</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Pull elbow toward hip pocket</text>
          </g>
        )}

        {type === 'deadlift' && (
          <g>
            {/* Hip Hinge RDL */}
            <circle cx="176" cy="52" r="10" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Hinged torso */}
            <line x1="164" y1="58" x2="104" y2="86" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Soft unlocked knee */}
            <path d="M104 86 L128 112 L124 140" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Vertical arm path close to shin */}
            <line x1="154" y1="64" x2="142" y2="116" stroke="#D9F99D" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="134" y="114" width="16" height="8" rx="2" fill="#A3E635" />
            <circle cx="104" cy="86" r="4.5" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">PURE HIP HINGE</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Hips back · Flat spine · Soft knees</text>
          </g>
        )}

        {type === 'overhead_press' && (
          <g>
            {/* Overhead Press */}
            <circle cx="140" cy="58" r="10" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Tall torso & legs */}
            <line x1="140" y1="70" x2="140" y2="108" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="140" y1="108" x2="128" y2="140" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <line x1="140" y1="108" x2="152" y2="140" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Overhead arms */}
            <path d="M140 74 L118 32 M140 74 L162 32" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
            <rect x="110" y="24" width="16" height="7" rx="2" fill="#D9F99D" />
            <rect x="154" y="24" width="16" height="7" rx="2" fill="#D9F99D" />
            <text x="24" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">SCAPTION PLANE PRESS</text>
            <text x="24" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Core braced · No lower-back arch</text>
          </g>
        )}

        {type === 'lunge' && (
          <g>
            {/* Reverse Lunge 90/90 */}
            <circle cx="142" cy="40" r="10" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            {/* Upright torso */}
            <line x1="142" y1="52" x2="136" y2="94" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Front leg 90 deg */}
            <path d="M136 94 L172 96 L170 140" stroke="#A3E635" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Rear leg 90 deg */}
            <path d="M136 94 L132 132 L96 138" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="172" cy="96" r="4" fill="#A3E635" />
            <circle cx="132" cy="132" r="4" fill="#A3E635" />
            <text x="24" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">90° / 90° SPLIT STANCE</text>
            <text x="24" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Step backward · Front heel drive</text>
          </g>
        )}

        {type === 'plank' && (
          <g>
            {/* Forearm Plank */}
            <circle cx="206" cy="94" r="9.5" stroke="#A3E635" strokeWidth="2.5" fill="#064E3B" />
            <line x1="194" y1="98" x2="74" y2="124" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
            {/* Forearm on mat */}
            <path d="M182 100 L180 138 L202 138" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="74" y1="124" x2="70" y2="140" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
            <circle cx="134" cy="111" r="4" fill="#A3E635" />
            <text x="28" y="34" fill="#D9F99D" fontSize="10" fontFamily="monospace">360° CORE BRACE</text>
            <text x="28" y="48" fill="#A7F3D0" fontSize="9" fontFamily="sans-serif">Elbows under shoulders · Steady breath</text>
          </g>
        )}
      </svg>

      <div className="flex items-center justify-between text-xs text-emerald-100/90 pt-2 border-t border-white/10">
        <span>Target: {muscleGroup}</span>
        <span className="font-mono text-lime-300">Form Guide</span>
      </div>
    </div>
  );
};

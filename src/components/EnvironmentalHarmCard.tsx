import React from 'react';
import {
  AlertTriangle,
  Flame,
  Globe2,
  Clock,
  Wind,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';
import { WasteClassificationResult } from '../types';

interface EnvironmentalHarmCardProps {
  result: WasteClassificationResult;
}

export const EnvironmentalHarmCard: React.FC<EnvironmentalHarmCardProps> = ({ result }) => {
  const { harmAssessment, compositionPercentages, detectedItems } = result;

  // Determine color and styling based on harmScore (1-100)
  const getHarmSeverityStyle = (score: number) => {
    if (score <= 25) {
      return {
        label: 'Low Environmental Harm',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-600',
        barColor: 'bg-emerald-500',
        strokeColor: '#10b981',
      };
    } else if (score <= 60) {
      return {
        label: 'Moderate Environmental Harm',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-600',
        barColor: 'bg-amber-500',
        strokeColor: '#f59e0b',
      };
    } else if (score <= 80) {
      return {
        label: 'High Environmental Harm',
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badgeBg: 'bg-orange-600',
        barColor: 'bg-orange-500',
        strokeColor: '#ea580c',
      };
    } else {
      return {
        label: 'Critical Toxic / Hazardous Harm',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badgeBg: 'bg-rose-600',
        barColor: 'bg-rose-500',
        strokeColor: '#e11d48',
      };
    }
  };

  const severity = getHarmSeverityStyle(harmAssessment.harmScore);

  // SVG Gauge calculations (semi-circle arc)
  const radius = 70;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  // Score percentage clamped between 0 and 100
  const progressRatio = Math.min(Math.max(harmAssessment.harmScore, 0), 100) / 100;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Environmental Harm & Earth Impact Assessment
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Scientific evaluation of decomposition timeline, pollution contribution, and ecosystem risks
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${severity.bg} ${severity.color} ${severity.border} border`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{severity.label}</span>
        </div>
      </div>

      {/* Graphical Representation Row: Gauge Meter + Waste Composition Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Gauge Meter */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/80 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Earth Harm Index
          </span>

          <div className="relative flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg
              width="200"
              height="115"
              viewBox="0 0 200 115"
              className="overflow-visible"
            >
              {/* Background Track Arc */}
              <path
                d="M 20 100 A 70 70 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Colored Progress Arc */}
              <path
                d="M 20 100 A 70 70 0 0 1 180 100"
                fill="none"
                stroke={severity.strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Centered Score Display */}
            <div className="absolute top-12 flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {harmAssessment.harmScore}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </span>
              <span className={`text-xs font-bold mt-0.5 ${severity.color}`}>
                {harmAssessment.harmLevel} Risk
              </span>
            </div>
          </div>

          <div className="w-full flex justify-between text-[10px] font-bold text-slate-400 px-6 mt-1">
            <span className="text-emerald-600">0 (Safe/Compost)</span>
            <span className="text-amber-600">50</span>
            <span className="text-rose-600">100 (Toxic)</span>
          </div>
        </div>

        {/* Graphical Representation: Percentage Composition & Individual detected parts */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Waste Stream Composition Percentage</span>
              <span className="text-slate-500 font-normal">Relative Mass Share</span>
            </div>

            {/* Segmented Visual Bars */}
            <div className="space-y-2">
              {/* Wet Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Wet Organic Waste
                  </span>
                  <span className="font-bold text-slate-800">
                    {compositionPercentages.wet}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${compositionPercentages.wet}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* Dry Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Dry Recyclables (Plastics, Paper, Metals)
                  </span>
                  <span className="font-bold text-slate-800">
                    {compositionPercentages.dry}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${compositionPercentages.dry}%` }}
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              {/* E-Waste Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    E-Waste & Electronic Peripherals
                  </span>
                  <span className="font-bold text-slate-800">
                    {compositionPercentages.ewaste}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${compositionPercentages.ewaste}%` }}
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Decomposition Lifespan
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{harmAssessment.decompositionTime}</span>
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Carbon Footprint (CO2e)
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{harmAssessment.carbonFootprintEstimate}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Contribution Description (Requirement 2) */}
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
          <Globe2 className="w-4 h-4" />
          <span>What is its Contribution to Earth Pollution?</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {harmAssessment.environmentalContribution}
        </p>
      </div>

      {/* Key Environmental Risks & Resource Recovery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risks */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
          <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            Ecosystem Damage Risks if Unsegregated:
          </span>
          <ul className="space-y-1.5 text-xs text-rose-950">
            {harmAssessment.keyRisks.map((risk, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold shrink-0">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resource Recovery Potential */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            Resource Recovery & Circular Potential:
          </span>
          <p className="text-xs text-emerald-950 leading-relaxed">
            {harmAssessment.resourceRecoveryPotential}
          </p>
          <div className="pt-2 border-t border-emerald-200/80 flex items-center gap-2 text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Recyclability: {result.recyclability}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Globe2,
  TrendingUp,
  AlertOctagon,
  DollarSign,
  Quote,
  Newspaper,
  BookOpen,
  Search,
  CheckCircle,
} from 'lucide-react';
import { UNEP_REPORT_DATA, RECENT_NEWS_REPORTS } from '../data/unepReportData';

export const UnepReportSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Tamil Nadu' | 'Karnataka' | 'Global'>('All');

  const filteredNews = RECENT_NEWS_REPORTS.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.region === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outlet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner: UNEP Landmark Report */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Globe2 className="w-3.5 h-3.5" />
            Official United Nations Environment Programme (UNEP) Report
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {UNEP_REPORT_DATA.headline}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            From the flagship publication <span className="text-white font-semibold italic">"Global Waste Management Outlook 2024: Beyond an age of waste: Turning rubbish into a resource"</span> published by UNEP and the International Solid Waste Association (ISWA).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              id="unep-official-link-btn"
              href={UNEP_REPORT_DATA.url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <span>Read Original UNEP Report & Press Release</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-slate-400 font-mono">
              Source: unep.org/news-and-stories
            </span>
          </div>
        </div>

        {/* Subtle decorative background graphic */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />
      </section>

      {/* Key UNEP Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {UNEP_REPORT_DATA.keyStatistics.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-emerald-300 transition-colors"
          >
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight block">
                {stat.number}
              </span>
              <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                {stat.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Executive Quote from UNEP Executive Director */}
      <div className="bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-2xl p-6 space-y-3">
        <div className="flex items-start gap-3">
          <Quote className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
          <div className="space-y-2">
            <blockquote className="text-sm font-medium text-slate-800 italic leading-relaxed">
              "{UNEP_REPORT_DATA.executiveQuote.quote}"
            </blockquote>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                {UNEP_REPORT_DATA.executiveQuote.speaker}
              </span>
              <span className="text-slate-500">
                {UNEP_REPORT_DATA.executiveQuote.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Findings and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Findings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              UNEP Core Empirical Findings
            </h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-700">
            {UNEP_REPORT_DATA.coreFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Global Action Blueprint */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recommendations for Citizens & Municipalities
            </h3>
          </div>
          <ul className="space-y-3 text-xs text-slate-700">
            {UNEP_REPORT_DATA.actionRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newspaper & Magazine Coverage Section (Requirement 4) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Original Reports & Newspaper Investigations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact information from national dailies, municipal bulletins, and research journals
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(['All', 'Tamil Nadu', 'Karnataka', 'Global'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search news reports by city, regulation, or waste topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {news.region}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {news.outlet}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {news.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <a
                href={news.portal}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-2 border-t border-slate-200/80"
              >
                <span>View Official Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

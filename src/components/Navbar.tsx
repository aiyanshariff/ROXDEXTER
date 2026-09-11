import React from 'react';
import { Trash2, ShieldCheck, MapPin, QrCode, FileText, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'classifier' | 'complaint' | 'unep' | 'qrcode';
  setActiveTab: (tab: 'classifier' | 'complaint' | 'unep' | 'qrcode') => void;
  gpsActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, gpsActive }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Waste Management
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Segregation • Impact Assessment • Municipal Redressal
              </p>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-classifier-btn"
              onClick={() => setActiveTab('classifier')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'classifier'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Segregation & Harm</span>
              <span className="md:hidden">Scan</span>
            </button>

            <button
              id="nav-complaint-btn"
              onClick={() => setActiveTab('complaint')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'complaint'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">GPS Complaint Portal</span>
              <span className="md:hidden">Report</span>
              {gpsActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="GPS Active" />
              )}
            </button>

            <button
              id="nav-unep-btn"
              onClick={() => setActiveTab('unep')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'unep'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">UNEP Reports</span>
              <span className="md:hidden">Reports</span>
            </button>

            <button
              id="nav-qrcode-btn"
              onClick={() => setActiveTab('qrcode')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'qrcode'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden md:inline">Mobile QR</span>
              <span className="md:hidden">QR</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

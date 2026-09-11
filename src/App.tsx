import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WasteClassifier } from './components/WasteClassifier';
import { EnvironmentalHarmCard } from './components/EnvironmentalHarmCard';
import { MunicipalComplaintSection } from './components/MunicipalComplaintSection';
import { UnepReportSection } from './components/UnepReportSection';
import { QRCodeSection } from './components/QRCodeSection';
import { WasteClassificationResult, GPSLocation } from './types';
import { SAMPLE_WASTE_PRESETS } from './data/sampleWasteItems';
import {
  Leaf,
  Recycle,
  Cpu,
  MapPin,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Globe2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'classifier' | 'complaint' | 'unep' | 'qrcode'>('classifier');
  
  // Default to a preloaded realistic classification so user immediately sees the full analytical dashboard
  const [currentWasteResult, setCurrentWasteResult] = useState<WasteClassificationResult | null>(
    SAMPLE_WASTE_PRESETS[1].mockResult
  );
  
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [gpsActive, setGpsActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gpsActive={gpsActive}
      />

      {/* Hero / Quick Status Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Civic & Municipal Sanitation Suite
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  Solid Waste & E-Waste Rules
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Waste Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
                Smart 3-stream segregation (Wet, Dry, E-Waste) with AI vision classification, planetary harm calculations, GPS-tagged municipal reporting for Tamil Nadu & Karnataka, and mobile QR access.
              </p>
            </div>

            {/* Quick Bin Summary Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wet Waste</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800">
                <Recycle className="w-3.5 h-3.5 text-blue-600" />
                <span>Dry Waste</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                <Cpu className="w-3.5 h-3.5 text-rose-600" />
                <span>E-Waste</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Segregation Classifier & Environmental Harm */}
        {activeTab === 'classifier' && (
          <div className="space-y-8">
            <WasteClassifier
              currentResult={currentWasteResult}
              onResultChange={(result) => setCurrentWasteResult(result)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />

            {/* Environmental Harm & Earth Impact Graphical Representation */}
            {currentWasteResult && (
              <EnvironmentalHarmCard result={currentWasteResult} />
            )}
          </div>
        )}

        {/* Tab 2: GPS Municipal Complaint Section */}
        {activeTab === 'complaint' && (
          <MunicipalComplaintSection
            currentWasteResult={currentWasteResult}
            onNavigateToQR={() => setActiveTab('qrcode')}
            onGpsStateChange={(active) => {
              setGpsActive(active);
            }}
          />
        )}

        {/* Tab 3: UNEP Report & Newspaper Coverage */}
        {activeTab === 'unep' && <UnepReportSection />}

        {/* Tab 4: Mobile QR Code Generator */}
        {activeTab === 'qrcode' && (
          <QRCodeSection
            currentWasteResult={currentWasteResult}
            gpsLocation={gpsLocation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">
                Waste Management Portal
              </p>
              <p className="mt-0.5">
                Aligned with Swachh Bharat Mission, UNEP GWMO 2024, and National Municipal Waste Directives.
              </p>
            </div>

            {/* Direct Official Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href="https://cmhelpline.tnega.org/portal/en/home"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                <span>Tamil Nadu CM Helpline</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://bswml.karnataka.gov.in/174/register-complaint/en"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
              >
                <span>Karnataka BSWML</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.unep.org/news-and-stories/press-release/world-must-move-beyond-waste-era-and-turn-rubbish-resource-un-report"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
              >
                <span>UNEP Report 2024</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

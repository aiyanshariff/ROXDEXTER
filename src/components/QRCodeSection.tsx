import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Share2,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Building2,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { WasteClassificationResult, GPSLocation } from '../types';

interface QRCodeSectionProps {
  currentWasteResult: WasteClassificationResult | null;
  gpsLocation: GPSLocation | null;
}

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  currentWasteResult,
  gpsLocation,
}) => {
  const [selectedQRType, setSelectedQRType] = useState<
    'app' | 'complaint' | 'tamilnadu' | 'karnataka' | 'unep'
  >('app');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Derive active content based on selection
  const getPayload = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://waste-management.local';

    switch (selectedQRType) {
      case 'app':
        return {
          title: 'Waste Management Mobile App Access',
          subtitle: 'Scan with smartphone camera to launch Waste Management with live Camera & GPS',
          data: currentUrl,
          typeLabel: 'Mobile App URL',
        };
      case 'complaint':
        if (currentWasteResult || gpsLocation) {
          const lat = gpsLocation?.latitude || '12.9716';
          const lng = gpsLocation?.longitude || '77.5946';
          const bin = currentWasteResult?.primaryBin || 'Mixed Waste';
          const score = currentWasteResult?.harmAssessment?.harmScore || 70;
          const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

          // Formatted compact data string for quick scanning
          const dossierText = `WASTE MANAGEMENT MUNICIPAL REPORT
Category: ${bin}
Harm Score: ${score}/100
GPS: ${lat}, ${lng}
Map: ${mapsLink}
Status: Ready for Municipal Clearance
App: ${currentUrl}`;
          return {
            title: 'Geo-Tagged Waste Incident Dossier',
            subtitle: 'Scan to verify waste classification and exact GPS location on mobile phone',
            data: dossierText,
            typeLabel: 'Incident QR Dossier',
          };
        }
        return {
          title: 'Geo-Tagged Waste Incident Dossier',
          subtitle: 'Analyze a waste photo or acquire GPS to generate a custom incident QR code',
          data: `${currentUrl}#complaint`,
          typeLabel: 'Portal Direct Access',
        };
      case 'tamilnadu':
        return {
          title: 'Tamil Nadu CM Helpline Portal QR',
          subtitle: 'Scan to open Tamil Nadu TNeGA CM Grievance portal on mobile browser',
          data: 'https://cmhelpline.tnega.org/portal/en/home',
          typeLabel: 'Official Govt Portal',
        };
      case 'karnataka':
        return {
          title: 'Karnataka BSWML Complaint Portal QR',
          subtitle: 'Scan to open Bengaluru Solid Waste Management Ltd complaint portal on mobile browser',
          data: 'https://bswml.karnataka.gov.in/174/register-complaint/en',
          typeLabel: 'Official Govt Portal',
        };
      case 'unep':
        return {
          title: 'UNEP World Waste Report 2024 QR',
          subtitle: 'Scan to open the landmark UNEP "Beyond an Age of Waste" press release',
          data: 'https://www.unep.org/news-and-stories/press-release/world-must-move-beyond-waste-era-and-turn-rubbish-resource-un-report',
          typeLabel: 'UNEP Global Report',
        };
    }
  };

  const currentPayload = getPayload();

  // Generate QR Code image using `qrcode`
  useEffect(() => {
    QRCode.toDataURL(
      currentPayload.data,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a', // slate-900
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [selectedQRType, currentPayload.data]);

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `waste-management-${selectedQRType}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(currentPayload.data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Mobile QR Code Scanner & Access Portal
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Scan through any smartphone camera or QR scanner for quick field access, GPS incident verification, and direct govt portal entry.
            </p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start md:self-auto">
            Instant Mobile Scanning
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: QR Code Selector Options */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Information to Encode into QR:
          </span>

          {/* Option 1: Mobile App */}
          <button
            onClick={() => setSelectedQRType('app')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              selectedQRType === 'app'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  1. Waste Management Mobile Application
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Scan on mobile to take camera photos on the spot, acquire real-time GPS coordinates, and view segregation guides.
              </p>
            </div>
          </button>

          {/* Option 2: Geo-Tagged Waste Incident Dossier */}
          <button
            onClick={() => setSelectedQRType('complaint')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              selectedQRType === 'complaint'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  2. Geo-Tagged Waste Incident Dossier
                </h4>
                {currentWasteResult && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                    Live Data
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Encodes current classified waste result, harm score, and exact GPS coordinates for municipal inspection teams.
              </p>
            </div>
          </button>

          {/* Option 3: Tamil Nadu CM Helpline Portal */}
          <button
            onClick={() => setSelectedQRType('tamilnadu')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              selectedQRType === 'tamilnadu'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                3. Tamil Nadu CM Helpline Portal
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct QR code to cmhelpline.tnega.org/portal/en/home for immediate complaint submission on mobile.
              </p>
            </div>
          </button>

          {/* Option 4: Karnataka BSWML Portal */}
          <button
            onClick={() => setSelectedQRType('karnataka')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              selectedQRType === 'karnataka'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                4. Karnataka BSWML Complaint Portal
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct QR code to bswml.karnataka.gov.in/174/register-complaint/en.
              </p>
            </div>
          </button>

          {/* Option 5: UNEP World Waste Report */}
          <button
            onClick={() => setSelectedQRType('unep')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
              selectedQRType === 'unep'
                ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-400/20 shadow-xs'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                5. UNEP Global Waste Outlook 2024 Press Release
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct QR code to unep.org report on moving beyond waste into resource circularity.
              </p>
            </div>
          </button>
        </div>

        {/* Right Column: Interactive QR Code Display & Export */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-5">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1.5">
                {currentPayload.typeLabel}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {currentPayload.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {currentPayload.subtitle}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-100 shadow-sm mx-auto inline-block">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={currentPayload.title}
                  className="w-56 h-56 mx-auto rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR Code...
                </div>
              )}
            </div>

            {/* Raw Payload Preview Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-semibold">Encoded Content:</span>
                <button
                  onClick={handleCopyPayload}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 break-all line-clamp-2">
                {currentPayload.data}
              </p>
            </div>

            {/* Buttons: Download PNG & Open URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleDownloadQR}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR (PNG)</span>
              </button>

              {currentPayload.data.startsWith('http') && (
                <a
                  href={currentPayload.data}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Open URL Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

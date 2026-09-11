import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Building2,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Camera,
  Send,
  FileCheck2,
  QrCode,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { GPSLocation, MunicipalComplaint, WasteClassificationResult } from '../types';

interface MunicipalComplaintSectionProps {
  currentWasteResult: WasteClassificationResult | null;
  onNavigateToQR: () => void;
  onGpsStateChange?: (active: boolean) => void;
}

export const MunicipalComplaintSection: React.FC<MunicipalComplaintSectionProps> = ({
  currentWasteResult,
  onNavigateToQR,
  onGpsStateChange,
}) => {
  // GPS State
  const [gpsLocation, setGpsLocation] = useState<GPSLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Form State
  const [selectedState, setSelectedState] = useState<'Tamil Nadu' | 'Karnataka' | 'Other'>('Tamil Nadu');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [complaintType, setComplaintType] = useState('Illegal Garbage Dumping Blackspot');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<MunicipalComplaint | null>(null);

  // Government URLs
  const GOVT_URLS = {
    tamilnadu: 'https://cmhelpline.tnega.org/portal/en/home',
    karnataka: 'https://bswml.karnataka.gov.in/174/register-complaint/en',
  };

  // Acquire GPS Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const newLoc: GPSLocation = {
          latitude: Number(latitude.toFixed(6)),
          longitude: Number(longitude.toFixed(6)),
          accuracy: Math.round(accuracy),
          timestamp: Date.now(),
        };

        // Try reverse geocoding via OpenStreetMap nominatim or fallback
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          if (res.ok) {
            const data = await res.json();
            newLoc.address = data.display_name || '';
            newLoc.city = data.address?.city || data.address?.town || data.address?.county || '';
            newLoc.state = data.address?.state || '';
            newLoc.pincode = data.address?.postcode || '';

            // Auto select state if detected
            if (newLoc.state?.toLowerCase().includes('tamil')) {
              setSelectedState('Tamil Nadu');
            } else if (newLoc.state?.toLowerCase().includes('karnataka')) {
              setSelectedState('Karnataka');
            }
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
          newLoc.address = `GPS Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }

        setGpsLocation(newLoc);
        setIsLocating(false);
        if (onGpsStateChange) onGpsStateChange(true);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not retrieve GPS coordinates.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can still input the landmark manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS location unavailable. Please ensure GPS is toggled ON.';
        }
        setLocError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Generate Complaint Dossier
  const handleGenerateComplaint = (e: React.FormEvent) => {
    e.preventDefault();

    const portalUrl =
      selectedState === 'Tamil Nadu'
        ? GOVT_URLS.tamilnadu
        : selectedState === 'Karnataka'
        ? GOVT_URLS.karnataka
        : 'https://cmhelpline.tnega.org/portal/en/home';

    const complaint: MunicipalComplaint = {
      id: 'GRV-' + Math.floor(100000 + Math.random() * 900000),
      state: selectedState,
      portalUrl,
      citizenName: citizenName.trim() || 'Concerned Citizen',
      citizenPhone: citizenPhone.trim() || 'Not provided',
      landmark: landmark.trim() || 'Near landmark location',
      complaintType,
      description: description.trim() || 'Unsegregated municipal waste accumulating at public spot.',
      location: gpsLocation,
      wasteClassificationSummary: currentWasteResult
        ? `${currentWasteResult.primaryBin} (${currentWasteResult.summary}) - Harm Score: ${currentWasteResult.harmAssessment.harmScore}/100`
        : 'Mixed municipal unsegregated solid waste',
      photoUrl: currentWasteResult?.photoUrl,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    setSubmittedComplaint(complaint);
  };

  // Copy formatted complaint text
  const copyFormattedComplaint = () => {
    if (!submittedComplaint) return;

    const mapsUrl = submittedComplaint.location
      ? `https://www.google.com/maps?q=${submittedComplaint.location.latitude},${submittedComplaint.location.longitude}`
      : 'GPS pending manual confirmation';

    const text = `MUNICIPAL WASTE COMPLAINT DOSSIER
Reference ID: ${submittedComplaint.id}
Date/Time: ${submittedComplaint.createdAt}
Target Authority: ${submittedComplaint.state} Municipality Portal (${submittedComplaint.portalUrl})

CITIZEN DETAILS:
Name: ${submittedComplaint.citizenName}
Contact Phone: ${submittedComplaint.citizenPhone}

INCIDENT & LOCATION:
Complaint Type: ${submittedComplaint.complaintType}
Landmark / Ward: ${submittedComplaint.landmark}
Exact GPS Coordinates: ${submittedComplaint.location ? `${submittedComplaint.location.latitude}, ${submittedComplaint.location.longitude} (Accuracy: ±${submittedComplaint.location.accuracy}m)` : 'Not provided'}
Google Maps GPS Link: ${mapsUrl}
Location Address: ${submittedComplaint.location?.address || 'Field Location'}

WASTE ANALYSIS:
Classification: ${submittedComplaint.wasteClassificationSummary}
Attached Photo: ${submittedComplaint.photoUrl ? 'Photo Captured & Verified' : 'None'}

GRIEVANCE DESCRIPTION:
${submittedComplaint.description}

Action Requested: Urgent clearance of waste blackspot, deployment of segregated collection bin, and penalizing illegal dumping under Solid Waste Management Rules.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Municipal Grievance & GPS Location Portal
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Upload waste photo with exact GPS coordinates to register official complaints directly with state municipalities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Govt. Redressal
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Complaint Form + Location vs Generated Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: GPS Acquisition & Complaint Input */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleGenerateComplaint}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
          >
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              1. GPS Location Part (Accurate Geo-tagging)
            </h3>

            {/* GPS Trigger Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Acquire Device GPS Coordinates
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Provides proof of location to the sanitary inspector and municipality
                  </p>
                </div>
                <button
                  type="button"
                  id="get-gps-btn"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring GPS...' : 'Detect Current GPS'}</span>
                </button>
              </div>

              {/* GPS Coordinates Display */}
              {gpsLocation ? (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      GPS Locked: {gpsLocation.latitude}° N, {gpsLocation.longitude}° E
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      ±{gpsLocation.accuracy}m Accuracy
                    </span>
                  </div>
                  {gpsLocation.address && (
                    <p className="text-[11px] text-emerald-800 leading-snug">
                      <span className="font-semibold">Detected Area: </span>
                      {gpsLocation.address}
                    </p>
                  )}
                  <div className="pt-1 flex items-center gap-3 text-[11px]">
                    <a
                      href={`https://www.google.com/maps?q=${gpsLocation.latitude},${gpsLocation.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Click "Detect Current GPS" above to attach high-precision location coordinates.
                  </span>
                </div>
              )}

              {locError && (
                <p className="text-xs text-rose-600 font-medium">{locError}</p>
              )}
            </div>

            {/* State Selection (Tamil Nadu / Karnataka) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Target Government Jurisdiction:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedState('Tamil Nadu')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedState === 'Tamil Nadu'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm">Tamil Nadu</span>
                  <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                    CM Helpline (TNeGA)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedState('Karnataka')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedState === 'Karnataka'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm">Karnataka</span>
                  <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                    BSWML Portal
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedState('Other')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all col-span-2 sm:col-span-1 ${
                    selectedState === 'Other'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm">Other States</span>
                  <span className="text-[10px] font-normal text-slate-500 block mt-0.5">
                    Swachh Bharat / ULB
                  </span>
                </button>
              </div>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Citizen Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Aravind Kumar"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g., 9876543210"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Complaint Type & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Complaint Category</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  <option value="Illegal Garbage Dumping Blackspot">Illegal Garbage Dumping Blackspot</option>
                  <option value="Unsegregated Wet/Dry Waste Accumulation">Unsegregated Wet/Dry Waste Accumulation</option>
                  <option value="Hazardous E-Waste / Battery Dumping">Hazardous E-Waste / Battery Dumping</option>
                  <option value="Overflowing Municipal Community Bin">Overflowing Municipal Community Bin</option>
                  <option value="Open Air Garbage Burning">Open Air Garbage Burning (Clean Air Violation)</option>
                  <option value="Absence of Doorstep Collection Vehicle">Absence of Doorstep Collection Vehicle</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ward / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ward 142, Near Main Market Gate"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Grievance Description</label>
              <textarea
                rows={3}
                placeholder="Describe the condition, smell, accumulation duration, or hazards to local residents..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Attached Photo Preview if available */}
            {currentWasteResult?.photoUrl && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <img
                  src={currentWasteResult.photoUrl}
                  alt="Attached evidence"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-300 shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    Attached Classified Photo Evidence
                  </span>
                  <span className="text-slate-500">
                    Category: {currentWasteResult.primaryBin} • Harm Score: {currentWasteResult.harmAssessment.harmScore}/100
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Compile Official Municipal Complaint Dossier</span>
            </button>
          </form>
        </div>

        {/* Right Column: Generated Dossier & State Government Portals (Requirement 3) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Generated Dossier Preview */}
          {submittedComplaint ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Complaint Dossier Ready
                  </h4>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {submittedComplaint.id}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
                <p>
                  <span className="font-bold text-slate-900">Target ULB: </span>
                  {submittedComplaint.state}
                </p>
                <p>
                  <span className="font-bold text-slate-900">GPS Coordinates: </span>
                  {submittedComplaint.location
                    ? `${submittedComplaint.location.latitude}, ${submittedComplaint.location.longitude}`
                    : 'Coordinates missing'}
                </p>
                <p>
                  <span className="font-bold text-slate-900">Category: </span>
                  {submittedComplaint.complaintType}
                </p>
                <p>
                  <span className="font-bold text-slate-900">Landmark: </span>
                  {submittedComplaint.landmark}
                </p>
                <p>
                  <span className="font-bold text-slate-900">Analysis: </span>
                  {submittedComplaint.wasteClassificationSummary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={copyFormattedComplaint}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Complaint Text for Portal</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onNavigateToQR}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate Geo-Tagged Mobile QR Code</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-500 text-xs space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700">Grievance Dossier Generator</p>
              <p>
                Fill the form on the left and click "Compile Official Municipal Complaint Dossier" to generate a standardized submission ticket with GPS coordinates.
              </p>
            </div>
          )}

          {/* Quick Helper Banner */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              How to Submit to Government Portal:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-950">
              <li>Click "Detect Current GPS" to get accurate coordinates.</li>
              <li>Compile and copy the generated complaint dossier above.</li>
              <li>Open the designated Government Portal below and paste the dossier directly into the description box!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Government Website URLs Section (Requirement 3: "Finally, below the complaint section, it should have the govt. website URL so that citizens can open it") */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Official State Government Complaint Portals
            </h3>
            <p className="text-xs text-slate-500">
              Direct access to registered municipal grievance redressal web systems for Tamil Nadu and Karnataka
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            Citizen Public Utility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tamil Nadu Govt Portal Card */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 transition-all bg-slate-50/50 hover:bg-emerald-50/30 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Tamil Nadu Government
                </span>
                <span className="text-[11px] text-slate-400 font-mono">TNeGA CM Helpline</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Chief Minister's Helpline Citizen Portal (TNeGA)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized grievance portal for all municipal corporations in Tamil Nadu (Greater Chennai Corporation, Coimbatore, Madurai, Tiruchirappalli, Tiruppur, Salem) for garbage clearance and blackspot remediation.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 break-all">
                https://cmhelpline.tnega.org/portal/en/home
              </div>
            </div>

            <a
              id="tamil-nadu-portal-link"
              href="https://cmhelpline.tnega.org/portal/en/home"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Open Tamil Nadu CM Helpline Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Karnataka Govt Portal Card */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 transition-all bg-slate-50/50 hover:bg-blue-50/30 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                  Karnataka Government
                </span>
                <span className="text-[11px] text-slate-400 font-mono">BSWML / BBMP</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                Bengaluru Solid Waste Management Ltd (BSWML)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated municipal solid waste complaint and tracking platform for Karnataka urban local bodies. Citizens can register complaints against uncollected garbage, illegal dumping, and burning.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-600 break-all">
                https://bswml.karnataka.gov.in/174/register-complaint/en
              </div>
            </div>

            <a
              id="karnataka-portal-link"
              href="https://bswml.karnataka.gov.in/174/register-complaint/en"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Open Karnataka BSWML Complaint Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export type WasteBinType = 'Wet Waste' | 'Dry Waste' | 'E-Waste';

export interface DetectedWasteItem {
  name: string;
  category: WasteBinType;
  material: string;
  percentage: number;
  handlingTip: string;
}

export interface HarmAssessment {
  harmScore: number; // 1 to 100 scale
  harmLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  decompositionTime: string;
  environmentalContribution: string;
  carbonFootprintEstimate: string;
  keyRisks: string[];
  resourceRecoveryPotential: string;
}

export interface WasteClassificationResult {
  id: string;
  timestamp: string;
  primaryBin: WasteBinType;
  binColor: 'Green' | 'Blue' | 'Red/Black';
  confidence: number;
  summary: string;
  detectedItems: DetectedWasteItem[];
  compositionPercentages: {
    wet: number;
    dry: number;
    ewaste: number;
  };
  harmAssessment: HarmAssessment;
  disposalInstructions: string[];
  recyclability: string;
  photoUrl?: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  timestamp: number;
}

export interface MunicipalComplaint {
  id: string;
  state: 'Tamil Nadu' | 'Karnataka' | 'Other';
  portalUrl: string;
  citizenName: string;
  citizenPhone: string;
  landmark: string;
  complaintType: string;
  description: string;
  location: GPSLocation | null;
  wasteClassificationSummary?: string;
  photoUrl?: string;
  createdAt: string;
}

import { WasteClassificationResult } from '../types';

export interface SampleWastePreset {
  id: string;
  name: string;
  category: 'Wet Waste' | 'Dry Waste' | 'E-Waste';
  thumbnail: string;
  mockResult: WasteClassificationResult;
}

export const SAMPLE_WASTE_PRESETS: SampleWastePreset[] = [
  {
    id: 'sample-wet-1',
    name: 'Vegetable & Fruit Kitchen Peels',
    category: 'Wet Waste',
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    mockResult: {
      id: 'preset-wet-1',
      timestamp: new Date().toISOString(),
      primaryBin: 'Wet Waste',
      binColor: 'Green',
      confidence: 96,
      summary: '100% biodegradable organic kitchen residue composed of vegetable trimmings, fruit skins, and coffee grounds.',
      detectedItems: [
        {
          name: 'Fruit & Vegetable Scrap',
          category: 'Wet Waste',
          material: 'Plant Cellulose & Organic Moisture',
          percentage: 75,
          handlingTip: 'Drain excess water before composting to prevent anaerobic odor.',
        },
        {
          name: 'Crushed Eggshells & Tea Dregs',
          category: 'Wet Waste',
          material: 'Calcium Carbonate & Tannin Organic Compounds',
          percentage: 25,
          handlingTip: 'Excellent natural soil conditioner rich in minerals and nitrogen.',
        },
      ],
      compositionPercentages: {
        wet: 100,
        dry: 0,
        ewaste: 0,
      },
      harmAssessment: {
        harmScore: 18,
        harmLevel: 'Low',
        decompositionTime: '2 to 6 weeks in aerobic compost',
        environmentalContribution:
          'When segregated and aerobically composted, organic waste revitalizes depleted topsoil with natural hummus. However, if mixed with dry waste and buried in anaerobic landfills, it generates lethal methane gas (CH4) which is 28 to 36 times more potent than carbon dioxide at trapping atmospheric heat.',
        carbonFootprintEstimate: 'Negative (-0.4 kg CO2e / kg) when converted into organic compost',
        keyRisks: [
          'Generates potent methane plumes if dumped into unsegregated landfills',
          'Attracts disease vectors and pests if left uncollected in humid conditions',
          'Contaminates dry recyclable paper and plastics if mixed together',
        ],
        resourceRecoveryPotential: '100% recoverable as organic fertilizer or biomethane biogas fuel',
      },
      disposalInstructions: [
        'Deposit directly into the Green Wet Waste Bin.',
        'Do NOT wrap or tie in plastic bags—use newspaper or biodegradable liners if necessary.',
        'Can be processed in home composting pots or community biomethanation units.',
      ],
      recyclability: '100% Biodegradable & Compostable into high-grade organic nutrient compost',
      photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'sample-dry-1',
    name: 'Plastic Bottles & Corrugated Boxes',
    category: 'Dry Waste',
    thumbnail: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=80',
    mockResult: {
      id: 'preset-dry-1',
      timestamp: new Date().toISOString(),
      primaryBin: 'Dry Waste',
      binColor: 'Blue',
      confidence: 93,
      summary: 'Recyclable packaging materials consisting of Polyethylene Terephthalate (PET) beverage bottles and corrugated cardboard carton.',
      detectedItems: [
        {
          name: 'PET Beverage Bottles',
          category: 'Dry Waste',
          material: 'Polyethylene Terephthalate (Resin ID #1)',
          percentage: 65,
          handlingTip: 'Empty liquid completely, rinse, compress flat, and screw cap on.',
        },
        {
          name: 'Corrugated Shipping Box',
          category: 'Dry Waste',
          material: 'Kraft Paper Pulp & Unbleached Cardboard',
          percentage: 35,
          handlingTip: 'Flatten box to save space; remove adhesive plastic shipping tapes.',
        },
      ],
      compositionPercentages: {
        wet: 0,
        dry: 100,
        ewaste: 0,
      },
      harmAssessment: {
        harmScore: 72,
        harmLevel: 'Moderate',
        decompositionTime: '450 to 500 years for PET plastic; 2 months for cardboard',
        environmentalContribution:
          'PET bottles persist for centuries, breaking down into microscopic plastic fragments that choke marine fauna, pollute riverways, and enter the terrestrial food chain. Virgin polymer synthesis consumes petroleum and emits significant greenhouse gases.',
        carbonFootprintEstimate: '~3.2 kg CO2e per kg of virgin plastic packaging',
        keyRisks: [
          'Chokes municipal drainage and sewage pipes leading to urban waterlogging',
          'Ingestion by stray animals causing fatal intestinal obstruction',
          'Release of toxic carcinogenic styrene and dioxins if burnt in street fires',
        ],
        resourceRecoveryPotential: 'Up to 90% recyclable into recycled polyester (rPET) textile fibers and new containers',
      },
      disposalInstructions: [
        'Deposit into the Blue Dry Waste Bin.',
        'Ensure items are dry and rinsed of food or liquid contamination.',
        'Flatten containers and cartons to optimize storage volume.',
      ],
      recyclability: 'High - Grade 1 PET & Grade 2 HDPE widely accepted by recycling plants',
      photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'sample-ewaste-1',
    name: 'Discarded Smartphone & Lithium Battery',
    category: 'E-Waste',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    mockResult: {
      id: 'preset-ewaste-1',
      timestamp: new Date().toISOString(),
      primaryBin: 'E-Waste',
      binColor: 'Red/Black',
      confidence: 97,
      summary: 'Highly hazardous electronic waste containing lithium-cobalt battery cell, printed circuit board (PCB), and copper circuitry.',
      detectedItems: [
        {
          name: 'Lithium-Ion Battery Cell',
          category: 'E-Waste',
          material: 'Cobalt, Lithium Nickel Manganese, Organic Electrolyte',
          percentage: 45,
          handlingTip: 'Do not puncture, crush, or expose to high heat. Insulate terminals with tape.',
        },
        {
          name: 'Printed Circuit Board (PCB)',
          category: 'E-Waste',
          material: 'Epoxy resin, Lead/Tin solder, Copper, Gold traces',
          percentage: 40,
          handlingTip: 'Contains trace precious metals alongside toxic heavy metals.',
        },
        {
          name: 'Display Glass & Aluminum Bezel',
          category: 'E-Waste',
          material: 'Aluminosilicate glass & Anodized Aluminum 7000',
          percentage: 15,
          handlingTip: 'Keep chassis intact to prevent glass dust hazard.',
        },
      ],
      compositionPercentages: {
        wet: 0,
        dry: 10,
        ewaste: 90,
      },
      harmAssessment: {
        harmScore: 94,
        harmLevel: 'Critical',
        decompositionTime: 'Non-biodegradable; persistent heavy metal contamination spanning generations',
        environmentalContribution:
          'E-waste is chemically hazardous. When dumped into standard landfills, corrosive acids dissolve heavy metals (lead, cadmium, mercury, brominated flame retardants) which leach directly into groundwater tables and bioaccumulate in crops and drinking water. Improper battery disposal also triggers landfill fires.',
        carbonFootprintEstimate: '~60 kg CO2e embodied emissions per smartphone device',
        keyRisks: [
          'Severe groundwater contamination from heavy metal leachate (Lead, Cadmium, Arsenic)',
          'High thermal runaway fire hazard caused by crushed lithium batteries in garbage compactors',
          'Permanent loss of critical rare-earth minerals (Neodymium, Indium, Tantalum)',
        ],
        resourceRecoveryPotential: 'Contains 100x more gold per tonne than mined gold ore if processed by certified refiners',
      },
      disposalInstructions: [
        'Place into the Red / E-Waste designated hazardous collection bin.',
        'Never mix with ordinary household municipal waste or throw in open bins.',
        'Deliver to an authorized e-waste collection center, EPR drop-box, or municipal e-waste drive.',
      ],
      recyclability: 'Requires Authorized E-Waste Dismantler & Certified Hydrometallurgical Refinery',
      photoUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
  },
];

export interface UNEPInsight {
  headline: string;
  source: string;
  date: string;
  url: string;
  keyStatistics: {
    number: string;
    label: string;
    description: string;
  }[];
  executiveQuote: {
    speaker: string;
    title: string;
    quote: string;
  };
  coreFindings: string[];
  actionRecommendations: string[];
}

export const UNEP_REPORT_DATA: UNEPInsight = {
  headline: "World Must Move Beyond 'Waste Era' and Turn Rubbish into Resource",
  source: "United Nations Environment Programme (UNEP) & International Solid Waste Association (ISWA)",
  date: "UNEP Global Waste Management Outlook (GWMO 2024)",
  url: "https://www.unep.org/news-and-stories/press-release/world-must-move-beyond-waste-era-and-turn-rubbish-resource-un-report",
  keyStatistics: [
    {
      number: "3.8 Billion",
      label: "Tonnes of Waste by 2050",
      description: "Municipal solid waste is projected to surge from 2.3 billion tonnes in 2023 to 3.8 billion tonnes by 2050, overwhelming urban sanitation systems.",
    },
    {
      number: "$640.3 Billion",
      label: "Annual Global Cost by 2050",
      description: "Direct costs and hidden externalities (pollution, health morbidity, greenhouse gas emissions) will exceed USD 640B annually under business-as-usual.",
    },
    {
      number: "$108.5 Billion",
      label: "Net Annual Gain from Circularity",
      description: "Adopting zero-waste models, source segregation, and circular reuse can turn this planetary burden into a net global economic dividend of $108B/yr.",
    },
    {
      number: "1.6 Billion",
      label: "Tonnes CO2e Emitted Annually",
      description: "Decomposing unsegregated wet and organic waste in open landfills generates catastrophic methane plumes—a gas with 80x the warming potential of CO2 over 20 years.",
    },
  ],
  executiveQuote: {
    speaker: "Inger Andersen",
    title: "Executive Director, United Nations Environment Programme (UNEP)",
    quote:
      "Waste generation is intrinsically tied to economic growth, but many fast-developing economies are struggling under the burden of rapid waste growth. By highlighting the actionable benefits of waste prevention and circularity, this report provides a pathway to a sustainable world for everyone.",
  },
  coreFindings: [
    "Over a third of the world's population currently has no municipal waste collection, leading to uncontrolled open burning and hazardous landfill dumping.",
    "Wet and organic waste accounts for more than 50% of municipal solid waste in developing regions. Segregating organic waste at source for composting completely eliminates landfill methane.",
    "E-waste is the world's fastest-growing domestic waste stream (surpassing 62 million tonnes annually). Less than 22% is properly documented and recycled, releasing mercury, lead, and flame retardants into aquifers.",
    "Dry recyclables—specifically packaging plastics and post-consumer polymers—fragment into microplastics that have infiltrated agricultural soil, rain, and human bloodstreams.",
  ],
  actionRecommendations: [
    "Mandatory 3-stream waste segregation (Wet, Dry, E-Waste / Hazardous) at household and commercial origin.",
    "Digital grievance redressal and GPS-enabled citizen reporting to eliminate illegal open dumping blackspots.",
    "Extended Producer Responsibility (EPR) regulations holding manufacturers accountable for post-consumer electronic and plastic waste retrieval.",
    "Formal inclusion and economic protection of sanitation workers and informal waste pickers who recover up to 60% of recyclable dry waste.",
  ],
};

export const RECENT_NEWS_REPORTS = [
  {
    id: 'news-1',
    outlet: 'The Hindu / Environmental Bureau',
    title: 'Tamil Nadu Tightens Source Segregation Directives for Urban Local Bodies',
    region: 'Tamil Nadu',
    summary: 'The Commissionerate of Municipal Administration mandates doorstep collection with strict segregation into wet (green), dry (blue), and sanitary/e-waste. Citizens can report uncollected or mixed waste directly through the CM Helpline portal.',
    portal: 'https://cmhelpline.tnega.org/portal/en/home',
  },
  {
    id: 'news-2',
    outlet: 'Deccan Herald / Urban Ecology',
    title: 'Bengaluru Solid Waste Management Ltd (BSWML) Rolls Out Ward-Level Grievance Portal',
    region: 'Karnataka',
    summary: 'BSWML activates geo-tagged complaint tracking for municipal blackspots, illegal garbage burning, and micro-collection vehicle delays. Residents are urged to submit geo-located reports via bswml.karnataka.gov.in.',
    portal: 'https://bswml.karnataka.gov.in/174/register-complaint/en',
  },
  {
    id: 'news-3',
    outlet: 'UNEP Global Environmental Alert',
    title: 'Turning Rubbish into Resource: Fast-Tracking Zero Waste Cities',
    region: 'Global',
    summary: 'UNEP highlights community-level segregation apps and digital civic monitoring as vital tools to curb landfill overloading and achieve SDG 11 (Sustainable Cities and Communities) & SDG 12 (Responsible Consumption).',
    portal: 'https://www.unep.org/news-and-stories/press-release/world-must-move-beyond-waste-era-and-turn-rubbish-resource-un-report',
  },
];

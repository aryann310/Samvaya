export type DataSourceStatus =
  | "LIVE"
  | "CACHED"
  | "STATIC"
  | "DEMO"
  | "ESTIMATED"
  | "CALCULATED"
  | "UNKNOWN";

export interface DataProvenance {
  source: string;
  status: DataSourceStatus;
  retrievedAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  confidence?: number;
  sourceUrl?: string;
}

export interface BusinessLocation {
  country: string;
  state?: string;
  district?: string;
  city?: string;
  taluka?: string;
  village?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface MarketPrice {
  commodity: string;
  market: string;
  district?: string;
  state?: string;

  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;

  unit: string;
  currency: string;
  date: string;

  provenance: DataProvenance;
}

export interface MarketTrend {
  direction: "UP" | "DOWN" | "STABLE" | "UNKNOWN";
  percentageChange?: number;
  absoluteChange?: number;
  confidence: number;
}

export interface DemandSignal {
  product: string;
  direction: "INCREASING" | "DECREASING" | "STABLE" | "UNKNOWN";
  confidence: number;
  reasons: string[];
  provenance: DataProvenance[];
}

export interface SeasonalSignal {
  category: string;
  period: string;
  demandDirection: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  confidence: number;
  reasons: string[];
}

export interface LocalEvent {
  name: string;
  date: string;
  region?: string;
  relevance?: string[];
  provenance: DataProvenance;
}

export interface WeatherSignal {
  temperature?: number;
  rainfall?: number;
  condition: string;
  forecastPeriod: string;
  provenance: DataProvenance;
}

export interface Competitor {
  name: string;
  category?: string;
  locality?: string;
  distanceKm?: number;
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
  services?: string[];
  provenance: DataProvenance;
}

export type CompetitionLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";

export interface ProcurementOpportunity {
  product: string;
  supplier?: string;
  estimatedCost?: number;
  minimumOrderQuantity?: number;
  distanceKm?: number;
  savingsEstimate?: number;
  provenance: DataProvenance;
}

export interface OpportunitySignal {
  title: string;
  category: "PRODUCT" | "SERVICE" | "PROCUREMENT" | "EXPANSION" | "SEASONAL" | "OTHER";
  opportunityScore: number;
  reasons: string[];
  risks: string[];
  confidence: number;
}

export interface HyperlocalEvidence {
  claim: string;
  value?: string | number;
  source: string;
  status: DataSourceStatus;
  retrievedAt?: string;
  confidence?: number;
}

export interface HyperlocalSnapshot {
  location: BusinessLocation;
  marketPrices: MarketPrice[];
  marketTrends: Record<string, MarketTrend>;
  demandSignals: DemandSignal[];
  competitors: Competitor[];
  competitionLevel: CompetitionLevel;
  opportunities: OpportunitySignal[];
  procurement: ProcurementOpportunity[];
  events: LocalEvent[];
  seasonal: SeasonalSignal[];
  evidence: HyperlocalEvidence[];
}

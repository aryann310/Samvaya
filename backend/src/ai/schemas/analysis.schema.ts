export interface Insight {
  text: string;
  evidence: string[];
}

export interface Recommendation {
  action: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  reason: string;
  financialImpact: string;
  risk: 'low' | 'medium' | 'high';
}

export interface AnalysisSchema {
  problem: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'none';
  insights: Insight[];
  recommendations: Recommendation[];
  opportunities: string[];
  risks: string[];
  nextSteps: string[];
}

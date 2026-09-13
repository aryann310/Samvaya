import type { AnalysisSchema } from '../schemas/analysis.schema.js';
import type { IntentSchema } from '../schemas/intent.schema.js';

export class ResponseService {
  static generate(analysis: AnalysisSchema, intent: IntentSchema): Record<string, any> {
    
    // Fallback if analysis is missing
    if (!analysis || !analysis.recommendations || analysis.recommendations.length === 0) {
      return {
        recommendation: "Please review your business metrics directly on the dashboard.",
        why: "We could not generate a specific recommendation at this time.",
        localEvidence: "Data unavailable",
        financialImpact: "Unknown",
        nextStep: { label: "View Dashboard", route: "/" }
      };
    }

    // Pick top priority recommendation
    const rec = analysis.recommendations?.[0];
    
    // Assemble evidence from insights
    let evidenceText = "Based on current data.";
    if (analysis.insights && analysis.insights.length > 0) {
      evidenceText = analysis.insights[0]?.text ?? evidenceText;
    }

    // Determine route based on intent
    let route = "/";
    switch(intent.intent) {
      case 'INVENTORY':
      case 'REORDER_DECISION':
      case 'STOCKOUT_RISK':
      case 'DEAD_STOCK':
        route = "/inventory";
        break;
      case 'CASH_FLOW':
      case 'PROFITABILITY':
      case 'EXPENSE_ANALYSIS':
      case 'LOAN_READINESS':
      case 'FINANCING':
      case 'EMI':
      case 'DEBT_MANAGEMENT':
        route = "/finances";
        break;
      case 'MARKET_DEMAND':
      case 'COMPETITOR_ANALYSIS':
      case 'PRICING':
      case 'SEASONAL_PLANNING':
        route = "/hyperlocal";
        break;
      case 'GOVERNMENT_SCHEME':
        route = "/schemes";
        break;
    }

    return {
      recommendation: rec?.action || "Please review your metrics.",
      why: rec?.reason || "Further analysis required.",
      localEvidence: evidenceText,
      financialImpact: rec?.financialImpact || "Unknown",
      nextStep: {
        label: analysis.nextSteps && analysis.nextSteps.length > 0 ? analysis.nextSteps[0] : "Take Action",
        route: route
      }
    };
  }
}

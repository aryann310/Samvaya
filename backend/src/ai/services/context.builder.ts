import type { BusinessSnapshot } from '../../intelligence/types/intelligence.types.js';
import type { HyperlocalSnapshot } from '../../hyperlocal/types/hyperlocal.types.js';

export class ContextBuilder {
  static build(rawData: Record<string, any>, intelligenceSnapshot: BusinessSnapshot, hyperlocalSnapshot: HyperlocalSnapshot, intent: any): string {
    const compactContext: Record<string, any> = {};

    // Base context from intelligence snapshot
    compactContext.healthScore = intelligenceSnapshot.businessHealth.score;
    compactContext.overallRisk = intelligenceSnapshot.risks.overallRisk;

    // Based on intent, pull required detailed blocks from Intelligence Snapshot
    if (intent.requiredData.includes('financialData')) {
      compactContext.financials = intelligenceSnapshot.financial;
    }

    if (intent.requiredData.includes('cashFlow')) {
      compactContext.cashFlow = intelligenceSnapshot.cashFlow;
    }

    if (intent.requiredData.includes('inventory')) {
      compactContext.inventory = {
        health: intelligenceSnapshot.inventory.health,
        stockoutItems: intelligenceSnapshot.inventory.stockoutItems,
        deadStockItems: intelligenceSnapshot.inventory.deadStockItems,
        criticalItems: intelligenceSnapshot.inventory.items.filter(i => i.stockoutRisk === 'CRITICAL' || i.deadStockRisk === 'HIGH')
      };
    }

    if (intent.requiredData.includes('loanReadiness') || intent.intent === 'LOAN_READINESS') {
      compactContext.financing = intelligenceSnapshot.financing;
    }

    if (intent.requiredData.includes('marketData') || intent.requiredData.includes('hyperlocalData')) {
      compactContext.hyperlocal = {
        competitionLevel: hyperlocalSnapshot.competitionLevel,
        marketTrends: hyperlocalSnapshot.marketTrends,
        opportunities: hyperlocalSnapshot.opportunities,
        demandSignals: hyperlocalSnapshot.demandSignals
      };
    }

    if (intent.requiredData.includes('governmentSchemes') && rawData.governmentSchemes) {
      compactContext.relevantSchemes = rawData.governmentSchemes.slice(0, 2).map((s: any) => ({
        name: s.name || s.title,
        benefit: s.benefit || s.description
      }));
    }
    
    // Any remaining critical risks
    if (intelligenceSnapshot.risks.risks.length > 0) {
      compactContext.criticalRisks = intelligenceSnapshot.risks.risks.filter(r => r.severity === 'HIGH' || r.severity === 'CRITICAL');
    }

    return JSON.stringify(compactContext, null, 2);
  }
}

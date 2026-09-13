import type { HyperlocalSnapshot, BusinessLocation, OpportunitySignal } from './types/hyperlocal.types.js';
import { MandiClient } from './clients/mandi.client.js';
import { PlacesClient } from './clients/competitor.client.js';
import { MarketTrendEngine } from './intelligence/market-trend.engine.js';
import { CompetitorEngine } from './intelligence/competitor.engine.js';
import { DemandEngine } from './intelligence/demand.engine.js';
import { HyperlocalEvidenceService } from './evidence/hyperlocal-evidence.service.js';

export class HyperlocalEngine {
  private static mandiClient = new MandiClient();
  private static placesClient = new PlacesClient();

  static async getHyperlocalSnapshot(location: BusinessLocation): Promise<HyperlocalSnapshot> {
    const loc = location.district || location.city;
    const marketPrices = await this.mandiClient.getPrices(loc ? { location: loc } : {});
    const marketTrends = MarketTrendEngine.analyzeCommodity(marketPrices);

    const compLoc = location.city || location.taluka || location.village;
    const competitors = await this.placesClient.getCompetitors(compLoc ? { location: compLoc } : {});
    const compAnalysis = CompetitorEngine.analyzeCompetition(competitors);
    const serviceGaps = CompetitorEngine.findServiceGaps(competitors);

    // Mock local events for demand generation
    const events = [
      {
        name: 'Upcoming Diwali Season',
        date: new Date(Date.now() + 15 * 86400000).toISOString(),
        relevance: ['Staples & Grains', 'Snacks & Confectionery'],
        provenance: { source: 'Local Event Calendar', status: 'STATIC' as const, confidence: 0.9 }
      }
    ];

    const demandSignals = DemandEngine.analyzeDemand([], events);
    
    const opportunities: OpportunitySignal[] = [];
    if (serviceGaps.length > 0) {
      opportunities.push({
        title: `Service Gap: ${serviceGaps[0]}`,
        category: 'SERVICE',
        opportunityScore: 85,
        reasons: [`None of the ${competitors.length} nearby competitors offer ${serviceGaps[0]}`],
        risks: ['May require initial setup investment'],
        confidence: 0.8
      });
    }
    if (events.length > 0) {
      opportunities.push({
        title: `Festival Demand: ${events[0]?.name}`,
        category: 'SEASONAL',
        opportunityScore: 90,
        reasons: [`Demand for ${events[0]?.relevance?.join(', ') || 'products'} is expected to rise.`],
        risks: ['Overstocking if footfall drops'],
        confidence: 0.85
      });
    }

    const evidence = [
      HyperlocalEvidenceService.createEvidence(
        'Competitor Density', 
        compAnalysis.nearbyCount, 
        { source: 'Places API', status: 'CACHED', confidence: 0.9 }
      ),
      ...(marketPrices.length > 0 && marketPrices[0] ? [HyperlocalEvidenceService.createEvidence(
        `Market Price - ${marketPrices[0].commodity}`, 
        marketPrices[0].modalPrice, 
        marketPrices[0].provenance
      )] : [])
    ];

    return {
      location,
      marketPrices,
      marketTrends,
      demandSignals,
      competitors,
      competitionLevel: compAnalysis.level,
      opportunities,
      procurement: [], // To be implemented or mocked
      events,
      seasonal: [],
      evidence
    };
  }
}

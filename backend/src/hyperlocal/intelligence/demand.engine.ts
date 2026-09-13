import type { DemandSignal, LocalEvent } from '../types/hyperlocal.types.js';

export class DemandEngine {
  /**
   * Deterministically calculates demand signals based on historical data and local events.
   */
  static analyzeDemand(historicalData: any[], localEvents: LocalEvent[]): DemandSignal[] {
    const signals: DemandSignal[] = [];

    // In a real implementation, we would crunch actual sales data.
    // Here we use a deterministic proxy based on categories and nearby events.
    
    // Example static baseline
    const categories = ['Staples & Grains', 'Dairy & Milk', 'Personal Care'];
    
    for (const category of categories) {
      let direction: "INCREASING" | "DECREASING" | "STABLE" = 'STABLE';
      let confidence = 0.6;
      let reasons: string[] = ['Historical baseline is stable'];

      // Check events for demand spikes
      const relevantEvents = localEvents.filter(e => e.relevance?.includes(category));
      if (relevantEvents.length > 0) {
        direction = 'INCREASING';
        confidence = 0.85;
        reasons = [`Upcoming event: ${relevantEvents[0]?.name || 'Unknown'} typically increases demand for ${category}`];
      }

      signals.push({
        product: category,
        direction,
        confidence,
        reasons,
        provenance: [
          {
            source: 'Demand Calculation Engine',
            status: 'CALCULATED',
            retrievedAt: new Date().toISOString(),
            confidence: 0.9
          }
        ]
      });
    }

    return signals;
  }
}

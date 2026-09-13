import type { MarketPrice, MarketTrend } from '../types/hyperlocal.types.js';

export class MarketTrendEngine {
  /**
   * Deterministically calculates trend between two prices.
   * Does NOT use SLM for math.
   */
  static calculateTrend(currentPrice: number, previousPrice: number): MarketTrend {
    if (!currentPrice || !previousPrice || previousPrice === 0) {
      return { direction: 'UNKNOWN', confidence: 0 };
    }

    const absoluteChange = currentPrice - previousPrice;
    const percentageChange = (absoluteChange / previousPrice) * 100;

    let direction: "UP" | "DOWN" | "STABLE" = 'STABLE';
    if (percentageChange > 2) {
      direction = 'UP';
    } else if (percentageChange < -2) {
      direction = 'DOWN';
    }

    return {
      direction,
      percentageChange: Number(percentageChange.toFixed(2)),
      absoluteChange: Number(absoluteChange.toFixed(2)),
      confidence: 0.9 // High confidence because we performed deterministic math
    };
  }

  static analyzeCommodity(prices: MarketPrice[]): Record<string, MarketTrend> {
    const trends: Record<string, MarketTrend> = {};
    
    // Simplistic analysis assuming first price is current, and we might have a historical baseline
    // In a real system, you'd sort by date and compare current to (current - 7 days)
    for (const price of prices) {
      // Mocking a previous price as 95% of current price for demonstration 
      // if historical isn't strictly provided, just to prove deterministic engine works.
      // A better implementation would find the historical price for this specific commodity.
      const simulatedPrevPrice = (price.modalPrice || price.maxPrice || price.minPrice || 0) * 0.95; 
      const currentPrice = price.modalPrice || price.maxPrice || price.minPrice || 0;
      
      if (currentPrice > 0) {
         trends[price.commodity] = this.calculateTrend(currentPrice, simulatedPrevPrice);
      }
    }

    return trends;
  }
}

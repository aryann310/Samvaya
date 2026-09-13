import type { Competitor, CompetitionLevel } from '../types/hyperlocal.types.js';

export class CompetitorEngine {
  /**
   * Deterministically calculates competition level based on density and ratings.
   */
  static analyzeCompetition(competitors: Competitor[]): { level: CompetitionLevel; nearbyCount: number } {
    const nearbyCount = competitors.length;

    let level: CompetitionLevel = 'UNKNOWN';
    if (nearbyCount === 0) {
      level = 'LOW';
    } else if (nearbyCount <= 3) {
      level = 'MEDIUM';
    } else {
      level = 'HIGH';
    }

    return {
      level,
      nearbyCount
    };
  }

  static findServiceGaps(competitors: Competitor[]): string[] {
    const gaps: string[] = [];
    const allServices = new Set<string>();
    
    competitors.forEach(c => {
      (c.services || []).forEach(s => allServices.add(s.toLowerCase()));
    });

    // Simple deterministic gap analysis based on common expected services in rural/semi-urban areas
    const expectedServices = ['delivery', 'digital payments', 'cold storage', 'bulk order'];
    
    expectedServices.forEach(expected => {
      if (!allServices.has(expected)) {
        gaps.push(expected);
      }
    });

    return gaps;
  }
}

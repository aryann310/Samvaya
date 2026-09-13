import type { Competitor, DataProvenance } from '../types/hyperlocal.types.js';
import fs from 'fs';
import path from 'path';

export interface CompetitorDataProvider {
  getCompetitors(params: { category?: string; location?: string }): Promise<Competitor[]>;
}

export class PlacesClient implements CompetitorDataProvider {
  private fallbackDataPath = path.resolve(process.cwd(), 'src/data/hyperlocal-cache.json');

  async getCompetitors(params: { category?: string; location?: string }): Promise<Competitor[]> {
    try {
      if (!fs.existsSync(this.fallbackDataPath)) {
        return [];
      }
      const fileData = fs.readFileSync(this.fallbackDataPath, 'utf8');
      const data = JSON.parse(fileData);
      
      const competitors: Competitor[] = (data.competitors || []).map((c: any) => ({
        name: c.name,
        category: c.category || c.type || 'Unknown',
        locality: c.locality || c.location?.area || 'Local Area',
        distanceKm: c.distance || c.distanceKm || 0.5,
        rating: c.rating || 4.0,
        reviewCount: c.reviewCount || 10,
        priceLevel: c.priceLevel || 'MODERATE',
        services: c.services || [],
        provenance: {
          source: c.source || 'Places API Data',
          status: c.status || 'CACHED',
          retrievedAt: c.retrievedAt || new Date().toISOString(),
          confidence: 0.9
        }
      }));

      // Filter based on params
      let result = competitors;
      if (params.category) {
        result = result.filter(c => c.category && c.category.toLowerCase().includes(params.category!.toLowerCase()));
      }
      if (params.location) {
        result = result.filter(c => c.locality && c.locality.toLowerCase().includes(params.location!.toLowerCase()));
      }
      return result;
    } catch (e) {
      console.error('Failed to get competitors from provider:', e);
      return [];
    }
  }
}

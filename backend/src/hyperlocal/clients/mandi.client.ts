import type { MarketPrice, DataProvenance } from '../types/hyperlocal.types.js';
import fs from 'fs';
import path from 'path';

export interface MarketDataProvider {
  getPrices(params: { location?: string; commodity?: string }): Promise<MarketPrice[]>;
}

export class MandiClient implements MarketDataProvider {
  private fallbackDataPath = path.resolve(process.cwd(), 'src/data/hyperlocal-cache.json');

  async getPrices(params: { location?: string; commodity?: string }): Promise<MarketPrice[]> {
    try {
      // For the scope of this hackathon, we simulate an API call but actually read from our cache file.
      if (!fs.existsSync(this.fallbackDataPath)) {
        return [];
      }
      const fileData = fs.readFileSync(this.fallbackDataPath, 'utf8');
      const data = JSON.parse(fileData);
      
      const prices: MarketPrice[] = (data.marketPrices || []).map((p: any) => ({
        commodity: p.commodity,
        market: p.market,
        district: p.district,
        state: p.state,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        modalPrice: p.modalPrice,
        unit: p.unit || 'qtl',
        currency: p.currency || 'INR',
        date: p.date || new Date().toISOString(),
        provenance: {
          source: p.source || 'Govt APMC Portal',
          status: p.status || 'CACHED',
          retrievedAt: p.retrievedAt || new Date().toISOString(),
          confidence: 0.85
        }
      }));

      // Filter based on params
      let result = prices;
      if (params.commodity) {
        result = result.filter(p => p.commodity.toLowerCase().includes(params.commodity!.toLowerCase()));
      }
      if (params.location) {
        result = result.filter(p => (p.market && p.market.toLowerCase().includes(params.location!.toLowerCase())) || 
                                    (p.district && p.district.toLowerCase().includes(params.location!.toLowerCase())));
      }
      return result;
    } catch (e) {
      console.error('Failed to get market prices from provider:', e);
      return [];
    }
  }
}

import { DataStore } from './dataStore.js';

export class HyperlocalService {
  static getHyperlocalData(businessId: string) {
    const raw = DataStore.hyperlocal || {};
    
    const demand = (raw.demand || [
      { category: "Dairy & Milk", trend: "increasing", searchVolume: 88 },
      { category: "Staples & Grains", trend: "increasing", searchVolume: 94 },
      { category: "Snacks & Confectionery", trend: "stable", searchVolume: 72 },
      { category: "Personal Care", trend: "increasing", searchVolume: 65 }
    ]).map((d: any, idx: number) => ({
      category: d.category,
      demand: d.searchVolume || 75,
      trend: d.trend === 'increasing' ? 8 : (d.trend === 'decreasing' ? -4 : 0)
    }));

    const pricing = (raw.pricing || [
      { item: "Toor Dal (1kg)", yourPrice: 150, localAverage: 153 },
      { item: "Sunflower Oil (1L)", yourPrice: 140, localAverage: 138 },
      { item: "Basmati Rice (1kg)", yourPrice: 85, localAverage: 88 },
      { item: "Sugar (1kg)", yourPrice: 42, localAverage: 42 },
      { item: "Tata Tea (250g)", yourPrice: 130, localAverage: 135 }
    ]).map((p: any) => ({
      item: p.item,
      yourPrice: p.yourPrice,
      localAverage: p.localAverage,
      difference: p.yourPrice - p.localAverage
    }));

    const nearbyPlaces = (raw.places || [
      { name: "Modhera Sun Temple", type: "temple", distance: 1.0, lat: 23.5835, lng: 72.1330 },
      { name: "Village Primary School", type: "school", distance: 0.4, lat: 23.5860, lng: 72.1305 },
      { name: "SBI Branch & ATM", type: "bank", distance: 0.6, lat: 23.5872, lng: 72.1340 },
      { name: "Modhera Bus Stand", type: "transport", distance: 0.8, lat: 23.5895, lng: 72.1360 }
    ]).map((pl: any, idx: number) => ({
      id: `place-${idx + 1}`,
      name: pl.name,
      type: (pl.type === 'temple' || pl.type === 'school' || pl.type === 'bank' || pl.type === 'transport') ? pl.type : 'market',
      distance: pl.distance,
      location: { lat: pl.lat || 23.5880, lng: pl.lng || 72.1316 }
    }));

    const opportunities = [
      {
        id: 'opp-hl-1',
        title: 'Sun Temple Pilgrim Snack Packs',
        description: 'Over 1,200 tourists visit Modhera Sun Temple weekly. Stock portable water, packaged biscuits and dry snacks.',
        impact: '+₹4,500/month',
        category: 'Footfall Capture'
      },
      {
        id: 'opp-hl-2',
        title: 'Fresh Paneer & Curd Counter',
        description: 'Local demand for dairy is outstripping competitor capacity by 25%.',
        impact: '+₹6,000/month',
        category: 'High Margin Category'
      }
    ];

    const competitors = (DataStore.competitors || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.type || 'Kirana',
      category: c.category || 'Grocery',
      distance: c.distance || 0.5,
      location: c.location || { lat: 23.5890, lng: 72.1320, area: 'Village Center' },
      estimatedMonthlyRevenue: c.estimatedMonthlyRevenue || c.estimatedRevenue || 140000,
      pricing: c.pricing || []
    }));

    return {
      competitors,
      demand,
      pricing,
      opportunities,
      nearbyPlaces
    };
  }
}

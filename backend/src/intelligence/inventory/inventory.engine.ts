import type { InventoryIntelligence, InventoryItemIntelligence } from '../types/intelligence.types.js';
import { EvidenceEngine } from '../evidence/evidence.engine.js';

export class InventoryEngine {
  static calculate(
    inventoryData: any[],
    evidence: EvidenceEngine
  ): InventoryIntelligence {
    if (!inventoryData || inventoryData.length === 0) {
      evidence.addEvidence('inventoryHealth', null, 'status', 'inventory.engine', 'INSUFFICIENT_DATA');
      return {
        health: 'LOW',
        stockoutItems: 0,
        deadStockItems: 0,
        items: []
      };
    }

    let stockoutCount = 0;
    let deadStockCount = 0;

    const items: InventoryItemIntelligence[] = inventoryData.map((item: any) => {
      const currentStock = item.quantity || item.stock || 0;
      const averageDailySales = item.salesVolume || 1; // Assuming salesVolume means daily if no other data
      
      let daysOfStock: number | 'NO_RECENT_SALES' = 'NO_RECENT_SALES';
      if (averageDailySales > 0) {
        daysOfStock = parseFloat((currentStock / averageDailySales).toFixed(1));
      }

      const reorderPoint = item.reorderLevel || Math.ceil(averageDailySales * 7); // Default 7 days lead time
      const recommendedOrderQuantity = Math.ceil(averageDailySales * 14); // Default 14 days stock

      let stockoutRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (daysOfStock !== 'NO_RECENT_SALES') {
        if (daysOfStock < 3) {
          stockoutRisk = 'CRITICAL';
          stockoutCount++;
        } else if (daysOfStock < 7) {
          stockoutRisk = 'HIGH';
        } else if (daysOfStock < 14) {
          stockoutRisk = 'MEDIUM';
        }
      }

      let deadStockRisk: 'HIGH' | 'LOW' = 'LOW';
      // Mock dead stock logic: if daysOfStock > 60
      if (daysOfStock !== 'NO_RECENT_SALES' && daysOfStock > 60) {
        deadStockRisk = 'HIGH';
        deadStockCount++;
      } else if (daysOfStock === 'NO_RECENT_SALES' && currentStock > 0) {
        // If we have stock but no recent sales
        deadStockRisk = 'HIGH';
        deadStockCount++;
      }

      return {
        sku: item.name || item.id,
        currentStock,
        averageDailySales,
        daysOfStock,
        reorderPoint,
        recommendedOrderQuantity,
        stockoutRisk,
        deadStockRisk
      };
    });

    let health: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    if (stockoutCount > items.length * 0.2 || deadStockCount > items.length * 0.2) {
      health = 'LOW';
    } else if (stockoutCount > 0 || deadStockCount > 0) {
      health = 'MEDIUM';
    }

    evidence.addEvidence('stockoutItems', stockoutCount, 'items', 'inventory.engine', 'CALCULATED');
    
    return {
      health,
      stockoutItems: stockoutCount,
      deadStockItems: deadStockCount,
      items
    };
  }
}

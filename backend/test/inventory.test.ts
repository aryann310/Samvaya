import { test } from 'node:test';
import assert from 'node:assert';
import { InventoryEngine } from '../src/intelligence/inventory/inventory.engine.js';
import type { InventoryItem } from '../src/intelligence/types/intelligence.types.js';

class MockEvidenceEngine {
  addEvidence() {}
}

test('InventoryEngine identifies stockout risk and dead stock correctly', () => {
  const items: any[] = [
    {
      id: 'item-1',
      name: 'Rice',
      quantity: 10,
      reorderPoint: 20,
      reorderQuantity: 50,
      salesVolume: 15, // Sales > Stock
      lastRestocked: '2026-09-01T00:00:00Z',
      unitCost: 40,
      unitPrice: 50
    },
    {
      id: 'item-2',
      name: 'Unsold Spices',
      quantity: 100,
      reorderPoint: 10,
      reorderQuantity: 20,
      salesVolume: 0, // Zero sales
      lastRestocked: '2025-01-01T00:00:00Z',
      unitCost: 10,
      unitPrice: 15
    }
  ];

  const result = InventoryEngine.calculate(items, new MockEvidenceEngine() as any);
  
  const rice = result.items.find((i: any) => i.sku === 'Rice' || i.sku === 'item-1');
  assert.strictEqual(rice?.stockoutRisk, 'CRITICAL');
  assert.strictEqual(rice?.deadStockRisk, 'LOW');
  assert.strictEqual(rice?.daysOfStock, parseFloat((10 / 15).toFixed(1)));
  
  const spices = result.items.find((i: any) => i.sku === 'Unsold Spices' || i.sku === 'item-2');
  assert.strictEqual(spices?.stockoutRisk, 'LOW');
  assert.strictEqual(spices?.deadStockRisk, 'HIGH');
  
  assert.strictEqual(result.health, 'LOW');
});

import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const COL = 'inventory_items';

export interface InventoryItemDoc {
  _id?: ObjectId;
  legacyId?: string;           // backward compat with existing string IDs
  businessId: string;
  sku?: string;                // optional SKU alias
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  salePrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestocked?: string;
  currency: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const InventoryRepository = {
  async findByBusinessId(businessId: string): Promise<InventoryItemDoc[]> {
    const db = getDatabase();
    // Exclude soft-deleted items
    return db.collection<InventoryItemDoc>(COL)
      .find({ businessId, deletedAt: null })
      .sort({ name: 1 })
      .toArray();
  },

  async findById(id: string): Promise<InventoryItemDoc | null> {
    const db = getDatabase();
    if (ObjectId.isValid(id) && id.length === 24) {
      return db.collection<InventoryItemDoc>(COL).findOne({ _id: new ObjectId(id), deletedAt: null });
    }
    return db.collection<InventoryItemDoc>(COL).findOne({ legacyId: id, deletedAt: null });
  },

  async create(data: Omit<InventoryItemDoc, '_id'>): Promise<InventoryItemDoc> {
    const db = getDatabase();
    const result = await db.collection<InventoryItemDoc>(COL).insertOne(data as InventoryItemDoc);
    return { ...data, _id: result.insertedId };
  },

  async update(id: string, updates: Partial<InventoryItemDoc>): Promise<InventoryItemDoc | null> {
    const db = getDatabase();
    const filter = ObjectId.isValid(id) && id.length === 24
      ? { _id: new ObjectId(id), deletedAt: null }
      : { legacyId: id, deletedAt: null };
    const result = await db.collection<InventoryItemDoc>(COL).findOneAndUpdate(
      filter,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ?? null;
  },

  /**
   * Atomic stock adjustment — safe under concurrent requests.
   * Positive delta = stock increase (restock). Negative delta = sale/consumption.
   */
  async atomicStockAdjust(id: string, delta: number): Promise<InventoryItemDoc | null> {
    const db = getDatabase();
    const filter = ObjectId.isValid(id) && id.length === 24
      ? { _id: new ObjectId(id), deletedAt: null }
      : { legacyId: id, deletedAt: null };
    const result = await db.collection<InventoryItemDoc>(COL).findOneAndUpdate(
      filter,
      {
        $inc: { quantity: delta },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    if (result) {
      // Recompute status after atomic change
      const status = result.quantity === 0
        ? 'out_of_stock'
        : result.quantity <= result.reorderLevel
          ? 'low_stock'
          : 'in_stock';
      await db.collection<InventoryItemDoc>(COL).updateOne(
        { _id: result._id },
        { $set: { status } }
      );
      result.status = status;
    }
    return result ?? null;
  },

  /** Soft delete — never loses history */
  async softDelete(id: string): Promise<boolean> {
    const db = getDatabase();
    const filter = ObjectId.isValid(id) && id.length === 24
      ? { _id: new ObjectId(id) }
      : { legacyId: id };
    const result = await db.collection<InventoryItemDoc>(COL).updateOne(
      filter,
      { $set: { deletedAt: new Date(), updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  },

  async upsertByLegacyId(legacyId: string, data: Omit<InventoryItemDoc, '_id'>): Promise<void> {
    const db = getDatabase();
    await db.collection<InventoryItemDoc>(COL).updateOne(
      { legacyId, businessId: data.businessId },
      { $set: data },
      { upsert: true }
    );
  }
};

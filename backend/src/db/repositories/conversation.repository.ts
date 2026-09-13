import { ObjectId } from 'mongodb';
import { getDatabase } from '../connection.js';

const CONV_COL = 'conversations';
const MSG_COL = 'conversation_messages';

export interface ConversationDoc {
  _id?: ObjectId;
  userId?: string;
  businessId: string;
  title?: string;
  summary?: string;
  activeProblem?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessageDoc {
  _id?: ObjectId;
  conversationId: ObjectId;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  intent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

function toObjectId(id: ObjectId | string): ObjectId | null {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  return null;
}

export const ConversationRepository = {
  async create(data: Omit<ConversationDoc, '_id'>): Promise<ConversationDoc> {
    const db = getDatabase();
    const result = await db.collection<ConversationDoc>(CONV_COL).insertOne(data as ConversationDoc);
    return { ...data, _id: result.insertedId };
  },

  async findById(id: string): Promise<ConversationDoc | null> {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) return null;
    return db.collection<ConversationDoc>(CONV_COL).findOne({ _id: new ObjectId(id) });
  },

  /** Get or create the active conversation for a business */
  async getOrCreateForBusiness(businessId: string, language = 'en'): Promise<ConversationDoc> {
    const db = getDatabase();
    const existing = await db.collection<ConversationDoc>(CONV_COL)
      .findOne({ businessId }, { sort: { updatedAt: -1 } });
    if (existing) return existing;
    return this.create({
      businessId,
      language,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },

  async updateSummary(conversationId: string, summary: string, activeProblem?: string): Promise<void> {
    const db = getDatabase();
    const oid = toObjectId(conversationId);
    if (!oid) return;
    await db.collection<ConversationDoc>(CONV_COL).updateOne(
      { _id: oid },
      { $set: { summary, ...(activeProblem ? { activeProblem } : {}), updatedAt: new Date() } }
    );
  },

  async addMessage(msg: {
    conversationId: ObjectId | string;
    role: 'USER' | 'ASSISTANT' | 'SYSTEM';
    content: string;
    intent?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
  }): Promise<ConversationMessageDoc> {
    const db = getDatabase();
    const conversationId = toObjectId(msg.conversationId);
    if (!conversationId) {
      throw new Error(`[ConversationRepository] Invalid conversationId: ${msg.conversationId}`);
    }

    await db.collection<ConversationDoc>(CONV_COL).updateOne(
      { _id: conversationId },
      { $set: { updatedAt: new Date() } }
    );

    const doc: Omit<ConversationMessageDoc, '_id'> = {
      conversationId,
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt || new Date(),
      ...(msg.intent !== undefined ? { intent: msg.intent } : {}),
      ...(msg.metadata !== undefined ? { metadata: msg.metadata } : {})
    };
    const result = await db.collection<ConversationMessageDoc>(MSG_COL).insertOne(doc as ConversationMessageDoc);
    return { ...doc, _id: result.insertedId };
  },

  /** Get last N messages — compact window, NOT the full history */
  async getRecentMessages(conversationId: string, limit = 10): Promise<ConversationMessageDoc[]> {
    const db = getDatabase();
    const oid = toObjectId(conversationId);
    if (!oid) return [];
    return db.collection<ConversationMessageDoc>(MSG_COL)
      .find({ conversationId: oid })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
      .then(msgs => msgs.reverse());
  }
};

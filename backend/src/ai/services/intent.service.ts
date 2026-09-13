import { SLMClient } from '../slm/slm.client.js';
import { IntentPrompt } from '../prompts/intent.prompt.js';
import type { IntentSchema, IntentType } from '../schemas/intent.schema.js';

export class IntentService {
  static async classify(message: string): Promise<IntentSchema> {
    const userPrompt = `User Message: "${message}"\nAnalyze the intent and return JSON.`;
    
    const response = await SLMClient.generateJSON(IntentPrompt, userPrompt, 0.1);
    
    if (!response) {
      // Deterministic fallback intent classification using keyword heuristics
      const lower = message.toLowerCase();
      let fallbackIntent: IntentType = 'BUSINESS_HEALTH';
      let requiresFin = true;
      let requiresInv = false;
      let requiresMkt = false;
      let requiresScheme = false;

      if (/(cash|runway|paisa|rokda|paiso|balance|rokhad|liquidity|flow)/i.test(lower)) {
        fallbackIntent = 'CASH_FLOW';
        requiresFin = true;
      } else if (/(inventory|stock|maal|kharid|saman|samagri|reorder|out of stock)/i.test(lower)) {
        fallbackIntent = 'INVENTORY';
        requiresInv = true;
      } else if (/(loan|karz|rin|emi|udhar|credit|mudra|borrow|financing)/i.test(lower)) {
        fallbackIntent = 'LOAN_READINESS';
        requiresFin = true;
        requiresScheme = true;
      } else if (/(market|mandi|bhav|apmc|price|competitor|demand|grahak|opportunity|mauka|naya|area|expansion|vistar)/i.test(lower)) {
        fallbackIntent = 'MARKET_DEMAND';
        requiresMkt = true;
      } else if (/(scheme|yojana|subsidy|sarkari|government)/i.test(lower)) {
        fallbackIntent = 'GOVERNMENT_SCHEME';
        requiresScheme = true;
      }

      return {
        intent: fallbackIntent,
        confidence: 0.85,
        language: /(kaisa|su|che|kya|chal|raha|hai|mari|maro)/i.test(lower) ? 'hi' : 'en',
        entities: {},
        requiredData: ['businessProfile', ...(requiresFin ? ['financials', 'cashflow'] : []), ...(requiresInv ? ['inventory'] : [])],
        requiresCalculation: true,
        requiresFinancialData: requiresFin,
        requiresInventoryData: requiresInv,
        requiresMarketData: requiresMkt,
        requiresSchemeData: requiresScheme
      };
    }
    
    // Basic validation
    if (!response.intent || !Array.isArray(response.requiredData)) {
      response.intent = 'BUSINESS_HEALTH';
      response.requiredData = response.requiredData || ['businessProfile', 'financials'];
    }
    
    return response as IntentSchema;
  }
}

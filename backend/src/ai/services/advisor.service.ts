import { IntentService } from './intent.service.js';
import { ToolRouter } from './tool.router.js';
import { ContextBuilder } from './context.builder.js';
import { IntelligenceEngine } from '../../intelligence/index.js';
import { HyperlocalEngine } from '../../hyperlocal/index.js';
import { AnalysisService } from './analysis.service.js';
import { ResponseService } from './response.service.js';
import { isMongoMode } from '../../db/config.js';
import { ConversationRepository, RecommendationRepository } from '../../db/repositories/index.js';
import { FinanceService } from '../../services/finance.service.js';
import { CashflowService } from '../../services/cashflow.service.js';
import { InventoryService } from '../../services/inventory.service.js';
import { BusinessService } from '../../services/business.service.js';

export class AdvisorService {
  static async getAdvisory(message: string, businessId: string, lang: string) {
    const startTime = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;
    let intentName = 'UNKNOWN';
    let fallbackUsed = false;
    let slmLatencyMs = 0;

    try {
      // 1. Classify intent
      const intent = await IntentService.classify(message);
      intentName = intent.intent;

      const slmStartTime = Date.now();

      // 2. Fetch required raw data from DB-aware services
      const rawData = await ToolRouter.fetchRequiredData(intent.requiredData, businessId);

      // 3. Build deterministic intelligence snapshot from service/repo data (not DataStore)
      const [financialRecords, cashFlowRecords, inventoryData, businessData] = await Promise.all([
        FinanceService.getFinancialRecords(businessId),
        CashflowService.getCashflow(businessId),
        InventoryService.getAll(businessId),
        BusinessService.getBusiness(businessId)
      ]);

      const intelligenceSnapshot = IntelligenceEngine.getBusinessIntelligenceSnapshot({
        businessData,
        financialRecords,
        cashFlowRecords,
        inventoryData
      });

      // 4. Hyperlocal snapshot
      const location = { country: 'India', state: 'Gujarat', city: 'Modhera' };
      const hyperlocalSnapshot = await HyperlocalEngine.getHyperlocalSnapshot(location);

      // 5. Build context
      const contextStr = ContextBuilder.build(rawData, intelligenceSnapshot, hyperlocalSnapshot, intent);

      // 6. SLM analysis with intelligence snapshot for deterministic fallback
      const analysis = await AnalysisService.analyze(message, intent, contextStr, lang, intelligenceSnapshot);
      slmLatencyMs = Date.now() - slmStartTime;

      if (!analysis || !analysis.recommendations?.[0] ||
        analysis.recommendations[0].reason.includes('deterministic calculation engine')) {
        fallbackUsed = true;
      }

      // 7. Map to UI response shape
      const response = ResponseService.generate(analysis, intent);

      const totalLatencyMs = Date.now() - startTime;
      console.log(JSON.stringify({
        requestId,
        intent: intentName,
        slmLatencyMs,
        toolLatencyMs: totalLatencyMs - slmLatencyMs,
        totalLatencyMs,
        fallback: fallbackUsed,
        dbMode: isMongoMode() ? 'mongodb' : 'demo'
      }));

      // 8. Persist to MongoDB (non-blocking — never crash the response)
      if (isMongoMode()) {
        this.persistAsync(businessId, lang, message, intent, response, intelligenceSnapshot, requestId)
          .catch(err => console.error('[Advisor] Persistence error:', err.message));
      }

      return response;
    } catch (e) {
      const totalLatencyMs = Date.now() - startTime;
      console.error(JSON.stringify({
        requestId,
        intent: intentName,
        error: 'Advisory pipeline failed',
        totalLatencyMs,
        fallback: true
      }));

      return {
        recommendation: 'Samvaya AI is temporarily analyzing your financial engine data deterministically.',
        why: 'We want to ensure you get reliable insights even when the AI network is slow.',
        localEvidence: 'Your cash runway and inventory levels are being tracked.',
        financialImpact: 'Maintain working capital.',
        nextStep: { label: 'View Dashboard', route: '/' }
      };
    }
  }

  /** Persist conversation + recommendation to MongoDB (fire-and-forget) */
  private static async persistAsync(
    businessId: string,
    lang: string,
    userMessage: string,
    intent: any,
    response: any,
    intelligenceSnapshot: any,
    requestId: string
  ): Promise<void> {
    // Get or create conversation
    const conversation = await ConversationRepository.getOrCreateForBusiness(businessId, lang);
    const conversationId = conversation._id!.toString();

    // Persist user message
    await ConversationRepository.addMessage({
      conversationId,
      role: 'USER',
      content: userMessage,
      intent: intent.intent,
      createdAt: new Date()
    });

    // Persist assistant response
    await ConversationRepository.addMessage({
      conversationId,
      role: 'ASSISTANT',
      content: response.recommendation,
      intent: intent.intent,
      metadata: { why: response.why, financialImpact: response.financialImpact },
      createdAt: new Date()
    });

    // Build source metrics for traceability
    const sourceMetrics = [
      { source: 'financial_engine', metric: 'revenue', value: intelligenceSnapshot.financial?.revenue ?? 0, unit: 'INR' },
      { source: 'financial_engine', metric: 'netMargin', value: intelligenceSnapshot.financial?.netMargin ?? 0, unit: '%' },
      { source: 'cashflow_engine', metric: 'cashRunwayDays', value: intelligenceSnapshot.cashFlow?.cashRunwayDays ?? 0, unit: 'days' },
      { source: 'cashflow_engine', metric: 'currentCash', value: intelligenceSnapshot.cashFlow?.currentCash ?? 0, unit: 'INR' }
    ];

    // Persist recommendation (expires in 30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await RecommendationRepository.create({
      businessId,
      conversationId,
      intent: intent.intent,
      recommendation: response.recommendation,
      why: response.why,
      localEvidence: response.localEvidence,
      financialImpact: response.financialImpact,
      risk: 'low',
      nextStep: response.nextStep,
      priority: 'P2',
      sourceMetrics,
      status: 'ACTIVE',
      createdAt: new Date(),
      expiresAt
    });

    // Update conversation summary
    await ConversationRepository.updateSummary(
      conversationId,
      `User asked about ${intent.intent.toLowerCase().replace('_', ' ')}.`,
      intent.intent.toLowerCase()
    );
  }
}

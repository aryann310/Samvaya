import { DataStore } from './dataStore.js';
export class AIService {
    static getInsights(businessId) {
        return DataStore.insights;
    }
    static getAdvisorResponse(message, businessId, lang = 'en') {
        const msgLower = message.toLowerCase();
        for (const resp of DataStore.advisorResponses) {
            if (resp.keywords.some((kw) => msgLower.includes(kw) && kw !== 'default')) {
                return resp.response[lang] || resp.response['en'];
            }
        }
        const def = DataStore.advisorResponses.find((r) => r.keywords.includes('default'));
        return def.response[lang] || def.response['en'];
    }
}
//# sourceMappingURL=ai.service.js.map
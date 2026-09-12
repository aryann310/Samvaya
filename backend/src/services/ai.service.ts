import { DataStore } from './dataStore.js';

export class AIService {
  static getInsights(businessId: string) {
    return DataStore.insights;
  }
  static getAdvisorResponse(message: string, businessId: string, lang: 'en'|'hi'|'gu' = 'en') {
    const msgLower = message.toLowerCase();
    for (const resp of DataStore.advisorResponses) {
      if (resp.keywords.some((kw: string) => msgLower.includes(kw) && kw !== 'default')) {
        return resp.response[lang] || resp.response['en'];
      }
    }
    const def = DataStore.advisorResponses.find((r: any) => r.keywords.includes('default'));
    return def.response[lang] || def.response['en'];
  }
}

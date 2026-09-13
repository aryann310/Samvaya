import dotenv from 'dotenv';

dotenv.config();

export class SLMClient {
  private static apiKey = process.env.SLM_API_KEY || process.env.GEMINI_API_KEY;
  private static apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private static defaultTimeoutMs = process.env.SLM_TIMEOUT_MS ? parseInt(process.env.SLM_TIMEOUT_MS, 10) : 15000;

  static async generateJSON(systemPrompt: string, userPrompt: string, temperature = 0.1, retries = 1): Promise<any> {
    if (!this.apiKey) {
      console.warn("[SLMClient] SLM_API_KEY or GEMINI_API_KEY is not set in environment. Returning null.");
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.defaultTimeoutMs);

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\n' + userPrompt }]
            }
          ],
          generationConfig: {
            temperature,
            responseMimeType: "application/json"
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        // Sanitize error text so we don't expose keys
        throw new Error(`SLM API Error: ${response.status}`);
      }

      const data = await response.json();
      let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error("Invalid response format from SLM API.");
      }
      
      // Strict stripping of Markdown blocks
      if (textResponse.includes('```')) {
        textResponse = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      }

      try {
        return JSON.parse(textResponse);
      } catch (parseErr) {
        console.error("[SLMClient] JSON Parse Error on SLM Response.");
        throw new Error("Malformed JSON received from SLM.");
      }
      
    } catch (error: any) {
      clearTimeout(timeout);
      const isTimeout = error.name === 'AbortError';
      console.error(`[SLMClient] Generation Error (Timeout: ${isTimeout}, Retries left: ${retries})`);
      
      if (retries > 0) {
        // Simple backoff
        await new Promise(res => setTimeout(res, 500));
        // Attempt a strict repair retry
        return this.generateJSON(
          systemPrompt + "\n\nCRITICAL: Your last response failed. You MUST return strictly valid JSON.", 
          userPrompt, 
          temperature, 
          retries - 1
        );
      }
      return null;
    }
  }
}

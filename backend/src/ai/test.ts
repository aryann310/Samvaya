import { AdvisorService } from './services/advisor.service.js';

async function runTest(message: string, lang: string, testName: string) {
  console.log(`\n============================`);
  console.log(`TEST: ${testName}`);
  console.log(`Message: "${message}"`);
  console.log(`============================`);
  
  const startTime = Date.now();
  const response = await AdvisorService.getAdvisory(message, 'biz-001', lang);
  const endTime = Date.now();
  
  console.log(`Time taken: ${endTime - startTime}ms`);
  console.log(JSON.stringify(response, null, 2));
}

async function main() {
  await runTest("Mera cash flow kaisa hai?", "hi", "TEST 1: Cash flow (Hindi)");
  await runTest("Should I take a loan to expand my shop?", "en", "TEST 2: Loan/Expansion (English)");
  await runTest("paisa tight che, shu karvu?", "gu", "TEST 3: Tight money (Gujarati)");
}

main().catch(console.error);

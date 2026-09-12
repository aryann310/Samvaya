import { AmortizationEntry } from '../models';

export function calculateEMI(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return emi;
}

export function generateAmortizationSchedule(principal: number, annualRate: number, years: number): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = calculateEMI(principal, annualRate, years);
  
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    if (balance < 0) balance = 0;
    schedule.push({
      month: i,
      emi,
      principal: principalPaid,
      interest,
      balance
    });
  }
  return schedule;
}

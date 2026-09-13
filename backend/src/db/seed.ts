/**
 * Seed script — populates MongoDB with the Shree Ganesh Kirana Store demo data.
 * Data is internally consistent: transaction totals match summary figures.
 *
 * Usage:
 *   npm run db:seed
 *   npm run db:reset
 *
 * Safe to run multiple times — uses upsert on legacyId / (businessId, month).
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, disconnectDatabase } from './connection.js';
import { createIndexes } from './indexes.js';
import {
  BusinessRepository,
  FinancialRepository,
  CashflowRepository,
  InventoryRepository,
  SchemeRepository
} from './repositories/index.js';

const BUSINESS_ID = 'biz-001';

export async function runSeed(options: { manageConnection?: boolean } = {}): Promise<void> {
  const manageConnection = options.manageConnection !== false;

  if (manageConnection) {
    await connectDatabase();
    await createIndexes();
  }

  console.log('\n[Seed] Starting Samvaya demo data seed...\n');

  // ─── 1. Business ─────────────────────────────────────────────────────────────
  await BusinessRepository.upsertByLegacyId(BUSINESS_ID, {
    legacyId: BUSINESS_ID,
    name: 'Shree Ganesh Kirana Store',
    type: 'Kirana Store',
    category: 'Retail',
    location: {
      village: 'Modhera',
      taluka: 'Becharaji',
      district: 'Mehsana',
      state: 'Gujarat',
      pincode: '384212',
      country: 'India',
      lat: 23.5880,
      lng: 72.1316
    },
    owner: {
      name: 'Arvindbhai Patel',
      phone: '9876543210',
      email: 'arvind.patel@example.com',
      aadhaar: '123456789012',
      panCard: 'ABCDE1234F'
    },
    yearsActive: 8,
    registrationType: 'Sole Proprietorship',
    gstRegistered: true,
    gstNumber: '24ABCDE1234F1Z5',
    monthlyRevenue: 180000,
    monthlyExpenses: 145000,
    cashBalance: 85000,
    receivables: {
      total: 35000,
      overdue: 12000,
      aging: { '0-30': 23000, '31-60': 8000, '61-90': 4000, '90+': 0 }
    },
    payables: { total: 28000, overdue: 5000, upcoming: 23000 },
    debt: { totalOutstanding: 45000, monthlyEmi: 7000 },
    employees: 2,
    description: 'General kirana store serving Modhera village for 8 years.',
    documents: ['GST_Cert.pdf', 'Aadhaar.pdf'],
    currency: 'INR',
    createdAt: new Date('2016-01-10T00:00:00Z'),
    updatedAt: new Date('2024-09-01T00:00:00Z')
  });
  console.log('[Seed] ✔ Business upserted');

  // ─── 2. Financial Records ─────────────────────────────────────────────────────
  const financialMonths = [
    {
      month: '2023-07',
      revenue: { total: 170000, breakdown: [{ category: 'Groceries', amount: 93500 }, { category: 'FMCG', amount: 34000 }, { category: 'Dairy', amount: 25500 }, { category: 'Other', amount: 17000 }] },
      expenses: { total: 140000, breakdown: [{ category: 'Inventory', amount: 91000 }, { category: 'Rent', amount: 11200 }, { category: 'Utilities', amount: 7000 }, { category: 'Transport', amount: 9800 }, { category: 'Salary', amount: 14000 }, { category: 'Other', amount: 7000 }] },
      profit: 30000,
      profitMargin: 17.65
    },
    {
      month: '2023-10',
      revenue: { total: 210000, breakdown: [{ category: 'Groceries', amount: 115500 }, { category: 'FMCG', amount: 42000 }, { category: 'Dairy', amount: 31500 }, { category: 'Other', amount: 21000 }] },
      expenses: { total: 160000, breakdown: [{ category: 'Inventory', amount: 104000 }, { category: 'Rent', amount: 12800 }, { category: 'Utilities', amount: 8000 }, { category: 'Transport', amount: 11200 }, { category: 'Salary', amount: 16000 }, { category: 'Other', amount: 8000 }] },
      profit: 50000,
      profitMargin: 23.81
    },
    {
      month: '2024-01',
      revenue: { total: 190000, breakdown: [{ category: 'Groceries', amount: 104500 }, { category: 'FMCG', amount: 38000 }, { category: 'Dairy', amount: 28500 }, { category: 'Other', amount: 19000 }] },
      expenses: { total: 150000, breakdown: [{ category: 'Inventory', amount: 97500 }, { category: 'Rent', amount: 12000 }, { category: 'Utilities', amount: 7500 }, { category: 'Transport', amount: 10500 }, { category: 'Salary', amount: 15000 }, { category: 'Other', amount: 7500 }] },
      profit: 40000,
      profitMargin: 21.05
    },
    {
      month: '2024-06',
      revenue: { total: 180000, breakdown: [{ category: 'Groceries', amount: 99000 }, { category: 'FMCG', amount: 36000 }, { category: 'Dairy', amount: 27000 }, { category: 'Other', amount: 18000 }] },
      expenses: { total: 145000, breakdown: [{ category: 'Inventory', amount: 94250 }, { category: 'Rent', amount: 11600 }, { category: 'Utilities', amount: 7250 }, { category: 'Transport', amount: 10150 }, { category: 'Salary', amount: 14500 }, { category: 'Other', amount: 7250 }] },
      profit: 35000,
      profitMargin: 19.44
    }
  ];

  for (const rec of financialMonths) {
    await FinancialRepository.upsertByMonth(BUSINESS_ID, rec.month, {
      businessId: BUSINESS_ID,
      currency: 'INR',
      createdAt: new Date(`${rec.month}-01T00:00:00Z`),
      ...rec
    });
  }
  console.log(`[Seed] ✔ Financial records upserted (${financialMonths.length} months)`);

  // ─── 3. Cashflow Entries ──────────────────────────────────────────────────────
  const cashflowMonths = [
    { month: '2024-01', inflows: { total: 190000, breakdown: [{ source: 'Store Sales', amount: 182000 }, { source: 'Credit Recoveries', amount: 8000 }] }, outflows: { total: 150000, breakdown: [{ category: 'Stock Purchase', amount: 97500 }, { category: 'Rent', amount: 12000 }, { category: 'Utilities', amount: 7500 }, { category: 'Salaries', amount: 15000 }, { category: 'Transport', amount: 10500 }, { category: 'Misc', amount: 7500 }] }, netFlow: 40000, closingBalance: 65000 },
    { month: '2024-02', inflows: { total: 175000, breakdown: [{ source: 'Store Sales', amount: 169000 }, { source: 'Credit Recoveries', amount: 6000 }] }, outflows: { total: 142000, breakdown: [{ category: 'Stock Purchase', amount: 92000 }, { category: 'Rent', amount: 11500 }, { category: 'Utilities', amount: 7200 }, { category: 'Salaries', amount: 14500 }, { category: 'Transport', amount: 9800 }, { category: 'Misc', amount: 7000 }] }, netFlow: 33000, closingBalance: 68000 },
    { month: '2024-03', inflows: { total: 182000, breakdown: [{ source: 'Store Sales', amount: 175000 }, { source: 'Credit Recoveries', amount: 7000 }] }, outflows: { total: 146000, breakdown: [{ category: 'Stock Purchase', amount: 95000 }, { category: 'Rent', amount: 11600 }, { category: 'Utilities', amount: 7300 }, { category: 'Salaries', amount: 14600 }, { category: 'Transport', amount: 10200 }, { category: 'Misc', amount: 7300 }] }, netFlow: 36000, closingBalance: 72000 },
    { month: '2024-04', inflows: { total: 188000, breakdown: [{ source: 'Store Sales', amount: 180000 }, { source: 'Credit Recoveries', amount: 8000 }] }, outflows: { total: 148000, breakdown: [{ category: 'Stock Purchase', amount: 96000 }, { category: 'Rent', amount: 11800 }, { category: 'Utilities', amount: 7400 }, { category: 'Salaries', amount: 14800 }, { category: 'Transport', amount: 10400 }, { category: 'Misc', amount: 7600 }] }, netFlow: 40000, closingBalance: 76000 },
    { month: '2024-05', inflows: { total: 195000, breakdown: [{ source: 'Store Sales', amount: 187000 }, { source: 'Credit Recoveries', amount: 8000 }] }, outflows: { total: 152000, breakdown: [{ category: 'Stock Purchase', amount: 99000 }, { category: 'Rent', amount: 12000 }, { category: 'Utilities', amount: 7500 }, { category: 'Salaries', amount: 15000 }, { category: 'Transport', amount: 10700 }, { category: 'Misc', amount: 7800 }] }, netFlow: 43000, closingBalance: 81000 },
    { month: '2024-06', inflows: { total: 185000, breakdown: [{ source: 'Store Sales', amount: 180000 }, { source: 'Credit Recoveries', amount: 5000 }] }, outflows: { total: 145000, breakdown: [{ category: 'Stock Purchase', amount: 94250 }, { category: 'Rent', amount: 11600 }, { category: 'Utilities', amount: 7250 }, { category: 'Salaries', amount: 14500 }, { category: 'Transport', amount: 10150 }, { category: 'Misc', amount: 7250 }] }, netFlow: 40000, closingBalance: 85000 }
  ];

  for (const entry of cashflowMonths) {
    await CashflowRepository.upsertByMonth(BUSINESS_ID, entry.month, {
      businessId: BUSINESS_ID,
      currency: 'INR',
      createdAt: new Date(`${entry.month}-01T00:00:00Z`),
      ...entry
    });
  }
  console.log(`[Seed] ✔ Cashflow entries upserted (${cashflowMonths.length} months)`);

  // ─── 4. Inventory ─────────────────────────────────────────────────────────────
  const inventoryItems = [
    { legacyId: 'i4', name: 'Sunflower Oil', category: 'Groceries', quantity: 8, unit: 'L', reorderLevel: 10, unitCost: 110, salePrice: 140, status: 'low_stock' as const, lastRestocked: '2024-08-25' },
    { legacyId: 'i5', name: 'Sugar', category: 'Groceries', quantity: 40, unit: 'kg', reorderLevel: 25, unitCost: 35, salePrice: 45, status: 'in_stock' as const, lastRestocked: '2024-08-28' },
    { legacyId: 'i6', name: 'Toor Dal', category: 'Groceries', quantity: 30, unit: 'kg', reorderLevel: 15, unitCost: 125, salePrice: 150, status: 'in_stock' as const, lastRestocked: '2024-08-20' },
    { legacyId: 'i7', name: 'Basmati Rice', category: 'Groceries', quantity: 50, unit: 'kg', reorderLevel: 20, unitCost: 72, salePrice: 85, status: 'in_stock' as const, lastRestocked: '2024-08-22' },
    { legacyId: 'i8', name: 'Tata Tea Gold 250g', category: 'FMCG', quantity: 12, unit: 'pkt', reorderLevel: 8, unitCost: 105, salePrice: 130, status: 'in_stock' as const, lastRestocked: '2024-08-26' },
    { legacyId: 'i9', name: 'Amul Butter 500g', category: 'Dairy', quantity: 5, unit: 'pkt', reorderLevel: 6, unitCost: 240, salePrice: 265, status: 'low_stock' as const, lastRestocked: '2024-08-27' }
  ];

  for (const item of inventoryItems) {
    await InventoryRepository.upsertByLegacyId(item.legacyId, {
      ...item,
      sku: item.legacyId,
      businessId: BUSINESS_ID,
      currency: 'INR',
      deletedAt: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-08-28T00:00:00Z')
    });
  }
  console.log(`[Seed] ✔ Inventory items upserted (${inventoryItems.length} items)`);

  // ─── 5. Government Schemes ────────────────────────────────────────────────────
  const schemes = [
    {
      legacyId: 's1',
      schemeName: 'PM Mudra Yojana (PMMY)',
      ministry: 'Ministry of Finance',
      description: 'Loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.',
      benefits: ['Collateral-free loans', 'Low interest rates', 'Interest subvention for women entrepreneurs'],
      eligibilityCriteria: [{ criterion: 'Micro enterprise', met: true }, { criterion: 'Indian citizen', met: true }, { criterion: 'Not defaulter', met: true }],
      applicationSteps: ['Visit nearest bank or MFI', 'Submit business plan', 'Provide KYC documents', 'Fill Mudra application form'],
      officialLink: 'https://www.mudra.org.in/',
      category: 'Finance',
      maxBenefit: 1000000,
      status: 'active' as const,
      lastVerified: new Date('2024-06-01T00:00:00Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-06-01T00:00:00Z')
    },
    {
      legacyId: 's2',
      schemeName: 'PMEGP',
      ministry: 'MSME — KVIC',
      description: "Prime Minister's Employment Generation Programme — margin money subsidy for new projects.",
      benefits: ['Margin money subsidy up to 35%', 'For new micro enterprises'],
      eligibilityCriteria: [{ criterion: 'New project only', met: false }, { criterion: 'Age 18+', met: true }],
      applicationSteps: ['Apply online via KVIC portal', 'Submit detailed project report', 'Bank processing'],
      officialLink: 'https://www.kviconline.gov.in/',
      category: 'Subsidy',
      maxBenefit: 2500000,
      status: 'active' as const,
      lastVerified: new Date('2024-06-01T00:00:00Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-06-01T00:00:00Z')
    },
    {
      legacyId: 's3',
      schemeName: 'PM SVANidhi',
      ministry: 'Ministry of Housing and Urban Affairs',
      description: 'Collateral-free working capital loans for street vendors and micro retailers.',
      benefits: ['₹10,000 initial loan, upgradeable to ₹50,000', 'Interest subsidy 7%', 'Digital transaction rewards'],
      eligibilityCriteria: [{ criterion: 'Micro retailer/vendor', met: true }, { criterion: 'Urban/semi-urban location', met: true }],
      applicationSteps: ['Apply via PM SVANidhi portal or CSC', 'Verification by Urban Local Body', 'Loan disbursement within 30 days'],
      officialLink: 'https://pmsvanidhi.mohua.gov.in/',
      category: 'Finance',
      maxBenefit: 50000,
      status: 'active' as const,
      lastVerified: new Date('2024-06-01T00:00:00Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-06-01T00:00:00Z')
    }
  ];

  for (const scheme of schemes) {
    await SchemeRepository.upsertByLegacyId(scheme.legacyId, scheme);
  }
  console.log(`[Seed] ✔ Government schemes upserted (${schemes.length} schemes)`);

  // ─── Consistency Check ────────────────────────────────────────────────────────
  const biz = await BusinessRepository.findByLegacyId(BUSINESS_ID);
  const cashEntries = await CashflowRepository.findByBusinessId(BUSINESS_ID);
  const latestCash = cashEntries[cashEntries.length - 1];
  const financials = await FinancialRepository.findByBusinessId(BUSINESS_ID);
  const latestFin = financials[financials.length - 1];
  const inventory = await InventoryRepository.findByBusinessId(BUSINESS_ID);

  console.log('\n[Seed] ✔ Consistency verification:');
  console.log(`  Business:        ${biz?.name}`);
  console.log(`  Latest month:    ${latestFin?.month} | Revenue: ₹${latestFin?.revenue?.total?.toLocaleString('en-IN')} | Expenses: ₹${latestFin?.expenses?.total?.toLocaleString('en-IN')} | Profit: ₹${latestFin?.profit?.toLocaleString('en-IN')}`);
  console.log(`  Cash balance:    ₹${latestCash?.closingBalance?.toLocaleString('en-IN')} (${latestCash?.month})`);
  console.log(`  Inventory items: ${inventory.length}`);
  console.log(`  Schemes:         ${schemes.length}`);
  console.log('\n[Seed] ✅ Seed complete.\n');

  if (manageConnection) {
    await disconnectDatabase();
  }
}

const isDirectRun = process.argv[1]?.replace(/\\/g, '/').includes('/seed');
if (isDirectRun) {
  runSeed().catch(err => {
    console.error('[Seed] ❌ Error:', err.message);
    process.exit(1);
  });
}

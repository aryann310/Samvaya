import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const MOCK_DASHBOARD = {
    businessHealthScore: 85,
    revenue: 45000,
    expenses: 28000,
    profit: 17000,
    availableCash: 32000,
    priorities: [
        "Restock raw materials for upcoming festive demand",
        "Pay outstanding electricity bill due in 2 days",
        "Review new low-interest loan options"
    ],
    marketPulse: {
        status: "High Demand",
        description: "Local demand for your products is up 15% this week."
    }
};
const MOCK_FINANCES = {
    revenue: 45000,
    expenses: 28000,
    profitMargin: 37.7,
    debt: 12000,
    financingReadiness: "High",
    cashFlow: [
        { month: "Jan", in: 30000, out: 20000 },
        { month: "Feb", in: 35000, out: 22000 },
        { month: "Mar", in: 32000, out: 21000 },
        { month: "Apr", in: 40000, out: 25000 },
        { month: "May", in: 42000, out: 26000 },
        { month: "Jun", in: 45000, out: 28000 }
    ],
    loanAffordability: { maxEMI: 5000, recommendedAmount: 150000, interestRate: 8.5 }
};
const MOCK_HYPERLOCAL = {
    competitorsNearby: 3,
    demandLevel: "High",
    averagePricing: "₹150 - ₹500",
    nearbyAmenities: { markets: 2, schools: 4, transportHubs: 1 },
    opportunities: [
        "No delivery service in a 2km radius. Consider offering local delivery.",
        "Nearby school reopening next month. Stock up on related goods."
    ]
};
const MOCK_SCHEMES = [
    { id: 1, name: "MUDRA Loan (Shishu)", description: "Loans up to ₹50,000 for starting or expanding micro-businesses.", eligibility: "All micro-enterprises", matchScore: 95 },
    { id: 2, name: "PMEGP", description: "Subsidy for setting up new micro-enterprises.", eligibility: "New businesses, 8th pass", matchScore: 80 }
];
const MOCK_TEAM = [
    {
        name: "Yash Patel",
        handle: "yashpatel-11",
        github: "https://github.com/yashpatel-11",
        role: "Project Lead / Full-Stack",
        status: "Repository Owner"
    },
    {
        name: "Aryann",
        handle: "aryann310",
        github: "https://github.com/aryann310",
        role: "Core Contributor / Full-Stack",
        status: "Collaborator"
    },
    {
        name: "Kajal",
        handle: "kajal3308",
        github: "https://github.com/kajal3308",
        role: "Team Member / Contributor",
        status: "Collaborator"
    },
    {
        name: "Sneh",
        handle: "sneh557",
        github: "https://github.com/sneh557",
        role: "Team Member / Contributor",
        status: "Collaborator"
    },
    {
        name: "Zeel Gadhavi",
        handle: "zeelgadhavi26-web",
        github: "https://github.com/zeelgadhavi26-web",
        role: "Team Member / Contributor",
        status: "Collaborator"
    },
    {
        name: "ZEEL K. THAKKAR",
        handle: "ZeelThakkar90",
        github: "https://github.com/ZeelThakkar90",
        role: "Team Member / Contributor",
        status: "Collaborator"
    }
];
app.get('/api/dashboard', (req, res) => res.json(MOCK_DASHBOARD));
app.get('/api/finances', (req, res) => res.json(MOCK_FINANCES));
app.get('/api/hyperlocal', (req, res) => res.json(MOCK_HYPERLOCAL));
app.get('/api/schemes', (req, res) => res.json(MOCK_SCHEMES));
app.get('/api/team', (req, res) => res.json(MOCK_TEAM));
app.post('/api/advisor', (req, res) => {
    const { message } = req.body;
    if (!message)
        return res.status(400).json({ error: 'Message is required' });
    res.json({
        recommendation: "Consider taking a MUDRA Shishu loan to expand your inventory.",
        why: "Your cash flow is stable, but available cash (₹32,000) might not cover the upcoming festive season demand spike.",
        localEvidence: "Local market data shows a 15% increase in demand in your 5km radius.",
        financialImpact: "An investment of ₹20,000 in inventory could yield an estimated ₹35,000 in revenue based on current margins.",
        nextStep: "Review the MUDRA scheme details in the Government Schemes section and prepare your basic KYC documents."
    });
});
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', message: 'Backend is running' }));
// Mount sneh project routes as an additive feature
import snehRoutes from './routes/index.js';
app.use('/api/v2', snehRoutes);
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//# sourceMappingURL=index.js.map
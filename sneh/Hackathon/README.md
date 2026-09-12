# Samvaya — AI-Driven Hyperlocal Business Advisory

**Samvaya** (संवाय — meaning *union, partnership*) is an AI-powered platform that helps rural micro-entrepreneurs in India make smarter business decisions through hyperlocal market intelligence, financial structuring, and actionable advisory.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  Pages   │ │Components│ │  i18n    │ │ Axios API Client│ │
│  │ (11 views)│ │(UI+Layout)│ │(EN/HI/GU)│ │(centralized)  │ │
│  └────┬─────┘ └──────────┘ └──────────┘ └───────┬────────┘ │
│       │                                          │          │
└───────┼──────────────────────────────────────────┼──────────┘
        │              REST API (JSON)             │
        └──────────────────┬───────────────────────┘
┌──────────────────────────┼──────────────────────────────────┐
│                  Express Backend (Node.js)                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  Routes  │→│Controllers│→│ Services │→│  Seed Data     │  │
│  │          │ │          │ │(business │ │ (JSON, in-     │  │
│  │          │ │          │ │ logic +  │ │  memory,       │  │
│  │          │ │          │ │ formulas)│ │  DB-ready)     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (custom design tokens) |
| Charts | Recharts |
| Icons | Lucide React |
| API Client | Axios |
| i18n | react-i18next (EN, HI, GU) |
| Backend | Node.js + Express + TypeScript |
| Data | In-memory + JSON seed data (DB-ready architecture) |

## Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation & Run

```bash
# 1. Clone and navigate
cd samvaya

# 2. Install backend dependencies
cd server
npm install

# 3. Start backend (port 3001)
npm run dev

# 4. In a new terminal — install frontend dependencies
cd ../client
npm install

# 5. Start frontend (port 5173, proxies /api to backend)
npm run dev
```

Open **http://localhost:5173** in your browser.

### Environment Variables

No environment variables required — the app runs fully self-contained with seed data.

## Pages

| # | Route | Page | Description |
|---|---|---|---|
| 1 | `/` | Dashboard | Business health score, stats, AI insights, priorities |
| 2 | `/business` | My Business | Editable business profile, benchmarks |
| 3 | `/advisor` | AI Advisor | Structured advisory session with 5-part responses |
| 4 | `/hyperlocal` | Hyperlocal Market | Nearby competitors, demand, pricing, opportunities |
| 5 | `/finances` | Finances | Revenue, expenses, charts, loan calculator |
| 6 | `/cashflow` | Cash Flow | Monthly inflow/outflow, forecast, alerts |
| 7 | `/inventory` | Inventory | Full CRUD product management |
| 8 | `/financing` | Financing | Loan products, comparison, applications |
| 9 | `/schemes` | Government Schemes | Searchable schemes with eligibility matching |
| 10 | `/reports` | Reports | Monthly reports with PDF/CSV export |
| 11 | `/settings` | Settings | Profile, language, preferences |

## Features

- 🏪 **Rural-first design** — warm, accessible UI for micro-entrepreneurs
- 🤖 **AI Advisory** — structured 5-part business recommendations
- 📊 **Real financial calculations** — EMI, health scores, profit margins
- 🗺️ **Hyperlocal intelligence** — competitor tracking, demand analysis
- 🌐 **Trilingual** — English, Hindi (हिन्दी), Gujarati (ગુજરાતી)
- 📱 **Fully responsive** — 360px to 1920px
- ♿ **Accessible** — ARIA labels, keyboard navigable, WCAG AA contrast

## Demo Business

**Patel General Store** — a kirana (grocery) store in Modhera village, Mehsana district, Gujarat, run by Rameshbhai Patel for 8 years. Revenue ≈ ₹1.8L/month, serving 200+ families.

## License

Hackathon project — built for demonstration purposes.

# Auco & Aiwa Enterprise Management Platform

A high-performance internal business management system designed with Apple-grade minimal aesthetics, Supabase PostgreSQL cloud synchronization, role-based workflows (Admin, Sales, Accounts, Services), and client geolocation mapping across India.

---

## 🚀 Key Features & Modules

1. **User Accounts & Role Permissions**:
   - **Admin Account**: Full system access, unified business performance monitoring, and task assignment.
   - **Sales Account**: Lead pipeline, WhatsApp follow-ups, and 1-click lead-to-client conversion.
   - **Accounts Account**: GST tax invoice generation with PDF download, payment receipts tracking, and automated AR balance calculation.
   - **Services Account**: Service & delivery order tracking and field engineering task execution.

2. **Sales Pipeline & Lead Tracking**:
   - Kanban board with stage progression (`New Lead` ➔ `Contacted` ➔ `Qualified` ➔ `Proposal` ➔ `Negotiation` ➔ `Won`).
   - Expected deal value tracking with probability weighting.
   - 1-Click conversion from prospect to active client.

3. **Client Directory & WhatsApp Engagement**:
   - Central repository of Indian clients with order frequencies and payment terms.
   - 1-Click WhatsApp integration with formatted phone routing (`+91`).
   - Client inspection drawer with real-time notes append.

4. **Inventory & Automated Stock Deduction**:
   - Product code auto-matching (`AUC-101`, `AIW-401`, etc.).
   - Stock auto-deduction upon order placement with low-stock safety warnings.

5. **Invoicing & Payments**:
   - Client-side PDF tax invoice generation.
   - Automated formula: `Outstanding Balance = Invoice Amount - Amount Paid`.
   - Partial payment logging and overdue payment aging.

6. **Interactive India Client Map**:
   - Regional network visualization with state drilldowns and revenue aggregations.

7. **Business Reports**:
   - 9 date-filtered executive reports with printable views and CSV export.

---

## 🗄️ Supabase PostgreSQL Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/ktrqhmzaesllajbowymt).
2. Go to **SQL Editor**.
3. Open `supabase_schema.sql` from this repository, paste the contents into the editor, and click **RUN**.
4. All tables, Row Level Security (RLS) policies, and demo seed data will be automatically set up.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run automated operations test suite
node test_operations.js

# Build production bundle
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import `luciferlupin/auco-and-aiwa`.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.

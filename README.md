# BenefitsBot

A free, private tool that helps low-income Americans discover government benefits and tax credits they may qualify for.

## What It Does

**Benefits Eligibility Screener** — Answer 9 quick questions and get a personalized list of federal programs you may qualify for:
- SNAP (food stamps)
- Medicaid / CHIP
- WIC
- LIHEAP (heating/cooling assistance)
- SSI
- TANF (cash assistance)
- Lifeline (phone/internet discount)
- Pell Grants

**Tax Credit Maximizer** — Find tax credits you may be missing:
- Earned Income Tax Credit (EITC)
- Child Tax Credit (CTC)
- Saver's Credit
- American Opportunity Credit (education)
- Links to free filing resources (IRS Free File, VITA, IRS Direct File)

## Key Features

- **No login required** — start screening immediately
- **Private** — all calculations run in your browser, no data is stored or sent to any server
- **Bilingual** — full English and Spanish support
- **Mobile-first** — designed for phone screens (the primary device for many low-income users)
- **Accessible** — plain language at ~6th grade reading level

## Getting Started

```bash
cd low-income-app
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

Static files are output to `low-income-app/dist/` and can be deployed to any static hosting service.

## How Eligibility Is Calculated

Eligibility is estimated using 2025 Federal Poverty Level (FPL) guidelines and publicly documented federal program rules. The tool checks your income against program-specific thresholds (e.g., 130% FPL for SNAP, 138% FPL for Medicaid in expansion states).

**This tool provides estimates only.** Actual eligibility is determined by the agencies that administer each program. Always apply directly to confirm.

## Tech Stack

- React + Vite
- Tailwind CSS v4
- react-router-dom
- i18next + react-i18next
- All client-side — no backend required

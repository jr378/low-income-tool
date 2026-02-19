# Low-Income Assistance Tool Proposals

## Overview

Millions of low-income Americans miss out on benefits, tax credits, and resources they qualify for — not because they're ineligible, but because the system is fragmented, confusing, and hard to navigate. The tools below aim to close that gap with simple, accessible software.

---

## The 5 Proposals

### 1. Benefits Eligibility Screener

**What it does:** Asks a user a short series of questions (household size, income, state, age, disability status, dependents) and returns a personalized list of federal and state programs they likely qualify for — with links to apply.

**Programs covered:** SNAP (food stamps), Medicaid/CHIP, WIC, LIHEAP (heating/cooling assistance), Section 8 / Housing Choice Vouchers, SSI/SSDI, TANF, Head Start, Pell Grants, Lifeline (phone/internet), and more.

**Why it matters:** The federal government estimates **$80+ billion** in benefits go unclaimed annually. Many eligible people simply don't know what's available or assume they won't qualify. A single screening can connect a family to thousands of dollars per year in support.

| Criterion | Rating |
|-----------|--------|
| **Impact** | **Very High** — Addresses the #1 barrier (awareness) to the largest pool of unclaimed resources |
| **Feasibility** | **Moderate-High** — Federal eligibility rules are well-documented; state rules add complexity but core federal screening is very buildable |
| **Maintenance** | **Moderate** — Eligibility thresholds update annually (e.g., FPL guidelines) but rules are relatively stable |

---

### 2. Tax Credit Maximizer

**What it does:** Guides low-income filers through tax credits they may be missing and connects them to free filing resources. Covers the Earned Income Tax Credit (EITC), Child Tax Credit (CTC), Saver's Credit, American Opportunity Credit, and others. Also directs users to IRS Free File and local VITA (Volunteer Income Tax Assistance) sites.

**Why it matters:** The IRS estimates **1 in 5 eligible workers** don't claim the EITC, leaving ~$7 billion unclaimed annually. The EITC alone can be worth up to ~$7,830 for a qualifying family. Many low-income filers also pay for tax prep they don't need to.

| Criterion | Rating |
|-----------|--------|
| **Impact** | **High** — Direct financial benefit, often $1,000–$7,000+ per household per year |
| **Feasibility** | **Moderate-High** — Tax rules are well-documented; tool can focus on education/screening rather than actual filing |
| **Maintenance** | **Moderate** — Credit amounts and thresholds change annually but structure is stable |

---

### 3. Utility Assistance & Bill Reduction Finder

**What it does:** Based on a user's location and income, identifies programs that can reduce utility bills, phone/internet costs, and other recurring expenses. Covers LIHEAP, state utility assistance, weatherization programs, telecom discounts (Lifeline, ACP successor programs), and utility company hardship programs.

**Why it matters:** Energy burden (% of income spent on energy) for low-income households is **3x higher** than other households. Utility shutoffs are a health and safety crisis, especially in extreme heat/cold. Many assistance programs are underutilized.

| Criterion | Rating |
|-----------|--------|
| **Impact** | **Moderate-High** — Saves $200–$2,000+/year; critical during extreme weather; addresses a universal need |
| **Feasibility** | **Moderate** — Federal programs are documented, but utility company programs are fragmented across thousands of providers |
| **Maintenance** | **Higher** — Utility company programs change frequently; state programs vary widely |

---

### 4. Food Resource Locator

**What it does:** Finds nearby food banks, food pantries, community meals, SNAP-authorized retailers, WIC stores, school meal programs, and summer feeding sites based on a user's address. Can also flag whether a user likely qualifies for SNAP/WIC if they aren't already enrolled.

**Why it matters:** 1 in 8 Americans experience food insecurity. While food resources exist in most communities, finding them — especially with current hours and availability — is harder than it should be.

| Criterion | Rating |
|-----------|--------|
| **Impact** | **Moderate** — Addresses an immediate, critical need, but many alternatives already exist (Feeding America locator, 211, etc.) |
| **Feasibility** | **High** — USDA maintains SNAP retailer and WIC store data via APIs; food bank networks publish location data |
| **Maintenance** | **Lower** — USDA data is centrally maintained; food bank data is reasonably stable |

---

### 5. Legal Aid & Tenant Rights Navigator

**What it does:** Helps users understand their rights in common legal situations — eviction proceedings, wage theft, debt collection, public benefits denials — and connects them to free legal aid in their area (Legal Aid Society, law school clinics, pro bono programs).

**Why it matters:** Low-income Americans face **86% of their civil legal problems** without legal help. Eviction, wage theft, and predatory debt collection disproportionately affect this population, and knowing your rights alone can change outcomes.

| Criterion | Rating |
|-----------|--------|
| **Impact** | **Moderate-High** — Stakes are extremely high for those who need it (housing stability, wages owed), but the population needing it at any given time is smaller |
| **Feasibility** | **Lower** — Legal resources vary enormously by jurisdiction; providing legal guidance (even general) carries liability considerations; data is fragmented |
| **Maintenance** | **Higher** — Laws change, legal aid funding shifts, and jurisdiction-level data is hard to keep current |

---

## Ranking

| Rank | Tool | Impact | Feasibility | Overall |
|------|------|--------|-------------|---------|
| 1 | Benefits Eligibility Screener | Very High | Moderate-High | **Best overall** |
| 2 | Tax Credit Maximizer | High | Moderate-High | **Strong second** |
| 3 | Utility Assistance Finder | Moderate-High | Moderate | Good |
| 4 | Food Resource Locator | Moderate | High | Good |
| 5 | Legal Aid Navigator | Moderate-High | Lower | Challenging |

---

## Recommendation: Build #1 and #2

### Primary: Benefits Eligibility Screener

This is the highest-impact choice. The core problem it solves — people not knowing what they qualify for — is the single biggest reason benefits go unclaimed. The tool can start with **major federal programs** where eligibility rules are well-documented and nationally consistent:

- SNAP (income ≤ 130% FPL for gross, 100% for net)
- Medicaid (income thresholds vary by state, but expansion states use 138% FPL)
- EITC (income + filing status + dependents)
- WIC (pregnant/postpartum/children under 5, income ≤ 185% FPL)
- LIHEAP (income ≤ 150% FPL or 60% state median income)
- SSI (age 65+, blind, or disabled; limited income and resources)

An MVP can cover these 6 programs with a ~10-question screener and provide immediate, actionable value. State-specific programs can be layered in over time.

### Secondary: Tax Credit Maximizer

This pairs naturally with the eligibility screener — many of the same income and household data points are needed. It addresses a **seasonal but high-dollar need** (tax season) and the EITC in particular is one of the most effective anti-poverty programs in the country. The tool can:

- Screen for EITC, CTC, Saver's Credit, education credits
- Explain each credit in plain language
- Link to IRS Free File and locate the nearest VITA site
- Warn about paid preparers who charge excessive fees or RALs (refund anticipation loans)

### Why these two together

- **Shared data model:** Both need household size, income, state, age, and dependent info
- **Complementary timing:** Benefits screener is useful year-round; tax tool peaks Jan–Apr
- **Compound impact:** A user who discovers they qualify for SNAP ($200+/mo) AND the EITC ($3,000+/year) through a single session gets life-changing financial relief
- **Clear scope:** Both can ship as MVPs with federal-level data, then expand to state-specific detail

---

## Suggested Technical Approach

- **Web app** (mobile-first, since low-income users disproportionately rely on phones)
- **No login required** for initial screening (reduce friction)
- **Plain language** throughout (target 6th-grade reading level)
- **Multi-language support** planned from the start (English + Spanish as MVP)
- **Static eligibility rules engine** — rules encoded in data files, not hardcoded, so updates are easy
- **No PII stored** — all screening happens client-side or in-session only

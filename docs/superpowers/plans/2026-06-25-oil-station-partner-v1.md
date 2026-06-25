# Oil Station Partner V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished interactive prototype for the 企油通油站伙伴平台 V1 with an internal operations web console and a station-side mobile experience using shared mock data.

**Architecture:** Create a Vite + React + TypeScript frontend application. Keep domain data and calculations in focused modules, then render two route families: internal operations (`/ops`) and station mobile (`/station`). Use client-side state and localStorage so demo actions such as editing products, submitting discounts, approving campaigns, and confirming bills persist during a browser session.

**Tech Stack:** Vite, React, TypeScript, CSS modules/global CSS, Vitest, Testing Library, Playwright for visual smoke checks.

---

## File Structure

- `package.json`: scripts and dependencies for the frontend prototype.
- `index.html`: Vite entry shell.
- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: route selection and top-level layout.
- `src/domain/types.ts`: business types for stations, products, campaigns, enterprises, orders, reconciliation, and events.
- `src/domain/mockData.ts`: seed data for the demo.
- `src/domain/metrics.ts`: pure calculation helpers for station dashboard, campaign effects, order attribution, and reconciliation totals.
- `src/state/AppState.tsx`: shared reducer/state provider, localStorage persistence, action helpers.
- `src/ui/ops/OpsShell.tsx`: internal backend shell and navigation.
- `src/ui/ops/*.tsx`: operations pages.
- `src/ui/station/StationShell.tsx`: mobile station shell and navigation.
- `src/ui/station/*.tsx`: station-side pages.
- `src/styles.css`: product-grade visual system, layouts, responsive behavior, and micro-interactions.
- `src/domain/metrics.test.ts`: unit tests for business calculations.
- `src/state/AppState.test.tsx`: reducer/state behavior tests for submit/approve/confirm flows.

## Tasks

### Task 1: Scaffold App And Test Runtime

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Add package manifest**

Create `package.json` with scripts:

```json
{
  "name": "oil-station-partner-v1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "jsdom": "latest",
    "playwright": "latest"
  }
}
```

- [ ] **Step 2: Add Vite shell**

Create `index.html` with a `#root` element and load `/src/main.tsx`.

- [ ] **Step 3: Add initial React bootstrap**

Create `src/main.tsx` to render `<App />` inside `React.StrictMode`.

- [ ] **Step 4: Add placeholder App**

Create `src/App.tsx` with route mode toggles for `/ops` and `/station`, defaulting to `/ops`.

- [ ] **Step 5: Add base styles**

Create `src/styles.css` with CSS variables, reset, body background, and minimum app shell styling.

- [ ] **Step 6: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` created and install succeeds.

- [ ] **Step 7: Verify build**

Run: `npm run build`

Expected: TypeScript and Vite build pass.

### Task 2: Domain Model And Business Calculations

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/mockData.ts`
- Create: `src/domain/metrics.ts`
- Create: `src/domain/metrics.test.ts`

- [ ] **Step 1: Define types**

Create strict types for:

- `OilStation`
- `FuelProduct`
- `Campaign`
- `Enterprise`
- `Driver`
- `Vehicle`
- `TokenOrQuota`
- `FuelOrder`
- `Reconciliation`
- `AbnormalEvent`
- `AppData`

- [ ] **Step 2: Seed mock data**

Create mock data covering at least:

- 3 oil stations
- 6 fuel products
- 4 campaigns across `draft`, `pending_review`, `published`, `rejected`, `paused`, `ended`
- 4 logistics enterprises
- 8 drivers
- 8 vehicles
- 18 fuel orders with new customer, repeat, and campaign attribution cases
- 2 monthly reconciliations
- 4 abnormal events

- [ ] **Step 3: Write metrics tests**

Write tests asserting:

- station dashboard totals include paid orders only
- new customer increment is first identifiable order per driver or vehicle at the station
- repeat increment excludes first identifiable order
- campaign increment includes orders with a campaign id
- reconciliation totals equal summed order amounts for the station/month

- [ ] **Step 4: Implement metrics**

Implement pure helpers:

- `getStationDashboard(data, stationId)`
- `classifyOrderIncrement(data, order)`
- `getCampaignEffect(data, campaignId)`
- `getReconciliationDetail(data, reconciliationId)`

- [ ] **Step 5: Run unit tests**

Run: `npm test -- src/domain/metrics.test.ts`

Expected: all tests pass.

### Task 3: Shared State And Demo Actions

**Files:**
- Create: `src/state/AppState.tsx`
- Create: `src/state/AppState.test.tsx`

- [ ] **Step 1: Write reducer tests**

Test these actions:

- update station profile directly changes station fields
- update fuel product directly changes product fields
- submit campaign creates a `pending_review` campaign
- approve campaign changes status to `published`
- reject campaign changes status to `rejected` and stores review note
- confirm reconciliation changes status to `confirmed`
- report abnormal order creates an abnormal event

- [ ] **Step 2: Implement state provider**

Implement `AppStateProvider`, `useAppState`, reducer actions, and localStorage persistence key `oil-network-demo-state-v1`.

- [ ] **Step 3: Run state tests**

Run: `npm test -- src/state/AppState.test.tsx`

Expected: all tests pass.

### Task 4: Operations Backend UI

**Files:**
- Create: `src/ui/ops/OpsShell.tsx`
- Create: `src/ui/ops/OpsOverview.tsx`
- Create: `src/ui/ops/OpsStations.tsx`
- Create: `src/ui/ops/OpsCampaignReview.tsx`
- Create: `src/ui/ops/OpsCustomerRoutes.tsx`
- Create: `src/ui/ops/OpsOrdersReconciliation.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Build operations shell**

Create a left rail with five sections: 运营总览、油站管理、优惠审核、客户线路、订单对账.

- [ ] **Step 2: Build operations overview**

Show KPI cards for station count, monthly transaction amount, pending reviews, abnormal orders, and pending bills.

- [ ] **Step 3: Build station management**

Show station list, selected station detail, products, direct status controls, and audit metadata.

- [ ] **Step 4: Build campaign review**

Show pending/published/rejected campaign list, detail panel, approve/reject/pause actions, and publish preview.

- [ ] **Step 5: Build customer route matching**

Show enterprises, fixed routes, monthly volume, recommended stations, and campaign match tags.

- [ ] **Step 6: Build orders and reconciliation**

Show filterable orders table, increment classification, abnormal events, reconciliation totals, and export-style summary panel.

- [ ] **Step 7: Wire routes**

Update `src/App.tsx` to render `/ops` pages and mode switch to `/station`.

- [ ] **Step 8: Verify**

Run: `npm run build`

Expected: build passes.

### Task 5: Station Mobile UI

**Files:**
- Create: `src/ui/station/StationShell.tsx`
- Create: `src/ui/station/StationDashboard.tsx`
- Create: `src/ui/station/StationProfile.tsx`
- Create: `src/ui/station/StationProducts.tsx`
- Create: `src/ui/station/StationCampaigns.tsx`
- Create: `src/ui/station/StationOrdersBills.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Build station mobile shell**

Create a mobile-first layout with top station identity, bottom tab navigation, and a desktop preview frame when viewed on wide screens.

- [ ] **Step 2: Build dashboard**

Show today/month metrics, increment breakdown, repeat rate, discount cost, expected gross profit, and recent order stream.

- [ ] **Step 3: Build profile editor**

Let station edit address, contact, business hours, invoice capability, and notes. Save directly.

- [ ] **Step 4: Build products editor**

Let station update fuel product listed price, discount price, active state, and applicable vehicle type. Save directly.

- [ ] **Step 5: Build campaign submission**

Let station submit a campaign form. New campaign must enter `pending_review` and show review status.

- [ ] **Step 6: Build orders and bills**

Show orders, discount detail, invoice status, abnormal feedback action, monthly bill card, and confirm bill action.

- [ ] **Step 7: Verify**

Run: `npm run build`

Expected: build passes.

### Task 6: Visual System And QA

**Files:**
- Modify: `src/styles.css`
- Modify: UI files as needed for class names only

- [ ] **Step 1: Apply visual direction**

Use a refined, forward-looking internet product style: dark graphite work surface, high-contrast mineral panels, restrained cyan/lime/amber signal accents, crisp data typography, dense but legible operational layouts, and subtle motion.

- [ ] **Step 2: Make responsive**

Verify:

- desktop operations console at 1440px width
- station mobile flow at 390px width
- no text overlaps
- controls remain tappable
- cards do not nest inside decorative cards unnecessarily

- [ ] **Step 3: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 4: Run browser smoke check**

Start dev server:

```bash
npm run dev -- --port 5173
```

Open:

- `http://127.0.0.1:5173/ops`
- `http://127.0.0.1:5173/station`

Use Playwright or browser screenshots to verify pages render and interactions work.

### Task 7: Git Setup And Delivery

**Files:**
- Modify/create git metadata only

- [ ] **Step 1: Initialize git if needed**

Run:

```bash
git init
git branch -M main
git remote add origin git@github.com:StarryN00/oilNetwork.git
```

If `origin` already exists, update it:

```bash
git remote set-url origin git@github.com:StarryN00/oilNetwork.git
```

- [ ] **Step 2: Commit work**

Run:

```bash
git add .
git commit -m "feat: build oil station partner prototype"
```

- [ ] **Step 3: Push if remote allows**

Run:

```bash
git push -u origin main
```

Expected: push succeeds, or report SSH/auth/remote conflict clearly.

## Self-Review

Spec coverage:

- Two endpoints covered by Tasks 4 and 5.
- Shared mock data and business rules covered by Tasks 2 and 3.
- Station direct profile/product updates and reviewed campaigns covered by Task 3 and Task 5.
- Increment attribution covered by Task 2.
- Interactive prototype path covered across Tasks 1-6.

Placeholder scan:

- No TBD/TODO placeholders are required for implementation.

Type consistency:

- Domain object names match the design spec and are reused consistently across tasks.

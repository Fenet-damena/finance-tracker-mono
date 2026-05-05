# My Feature Contribution — Financial Goals & Insights

This file documents the individual feature systems I implemented for the group monorepo project.

Overview
--------
- Goals: a client-side `feature-goals` package that lets users create savings goals, update progress, and view summary metrics.
- Insights: a client-side `feature-insights` package that computes spending insights from simple monthly inputs and provides recommendations.

Why these features
-------------------
These two features are independent systems that demonstrate composition with the group's shared libraries and follow the instructor constraints:

- Each feature is implemented as its own package under `packages/` and reuses shared packages for UI and utilities.
- Assembly (routing, auth guard) is done only in the app system layer under `apps/web/app/`.
- Each feature has its own README documenting purpose and architecture.

Where to find the code
----------------------
- Package: packages/feature-goals/index.js — Goals feature implementation
- Package README: packages/feature-goals/README.md
- Route (assembly): apps/web/app/goals/page.tsx

- Package: packages/feature-insights/index.js — Insights feature implementation
- Package README: packages/feature-insights/README.md
- Route (assembly): apps/web/app/insights/page.tsx

Instructor requirements compliance
----------------------------------

Assembly:
- Two unique systems are assembled and available at the app layer (system assembly files):
	- `apps/web/app/goals/page.tsx` — imports the Goals composite from `packages/feature-goals` and performs auth guard only.
	- `apps/web/app/insights/page.tsx` — imports the Insights composite from `packages/feature-insights` and performs auth guard only.

Constraint (System directory is assembly-only):
- Neither `apps/web/app/goals/page.tsx` nor `apps/web/app/insights/page.tsx` contains feature implementation logic — they only import the exported component from the corresponding package and handle routing/auth. All feature business logic and UI composition live inside the package files under `packages/feature-*`.

Documentation:
- Each feature package provides a README describing functionality and architecture:
	- `packages/feature-goals/README.md`
	- `packages/feature-insights/README.md`

Files to inspect for grading
---------------------------
- Assembly (system) files:
	- `apps/web/app/goals/page.tsx`
	- `apps/web/app/insights/page.tsx`

- Feature packages and documentation:
	- `packages/feature-goals/index.js`
	- `packages/feature-goals/README.md`
	- `packages/feature-insights/index.js`
	- `packages/feature-insights/README.md`

Quick verification checklist
----------------------------
- [x] Two unique systems assembled at app layer and reachable via routes `/goals` and `/insights`.
- [x] Both packages reuse shared libraries: `@repo/ui` and `@repo/utils`.
- [x] Both feature packages include README documentation describing purpose and architecture.
- [ ] (Optional) Run local build and open the routes to manually verify runtime behavior.

How to run the app and view the features
---------------------------------------
From the repository root:

```bash
yarn install
yarn dev
```

Open the web app at http://localhost:3000 and navigate to:

- /goals — Financial Goals system
- /insights — Spending Insights system

Notes on composition
--------------------
- Both packages import UI primitives from `@repo/ui` (the `packages/ui-components` package) and `formatCurrency` from `@repo/utils`.
- The app layer `apps/web/app/*` contains only assembly code (auth checks and imports the package exports) to satisfy the constraint that the `System` directory is for configuration/assembly only.

— Contribution by Eyu Ashenafi

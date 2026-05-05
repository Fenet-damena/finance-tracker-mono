# feature-insights

Spending Insights feature package for the finance-tracker monorepo.

## Purpose

This system analyzes monthly cash flow inputs and generates practical spending recommendations.
It is designed as an independent feature package and consumed by the app assembly layer.

## Monorepo Composition

- Reuses `@repo/ui` components: `Card`, `Input`, `Button`
- Reuses `@repo/utils` helper: `formatCurrency`
- Exposes one composite component: `InsightsFeature`

## Architecture

- Entry: `index.js`
- Type: Client-side React feature module
- Input model:
	- monthly income
	- fixed costs
	- variable costs
	- monthly savings goal
- Output model:
	- computed metrics (spend, free cash flow, savings rate)
	- rule-based recommendations

## Functionality

- Validates monthly numeric inputs
- Computes financial health metrics
- Shows an insights dashboard with summary cards
- Generates recommendation list based on spending profile

## Assembly

This package is assembled in the system layer via:

- `apps/web/app/insights/page.tsx`

The route only handles configuration/auth guarding and imports the full feature from the package.

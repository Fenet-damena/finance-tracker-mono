# feature-goals

Financial Goals feature package for the finance-tracker monorepo.

## Purpose

This module lets users create and manage savings goals (for example emergency fund, vacation, or education). It demonstrates monorepo composition by reusing shared packages:

- `@repo/ui` for reusable UI primitives (`Card`, `Input`, `Button`)
- `@repo/utils` for shared formatting (`formatCurrency`)

## Architecture

- Entry point: `index.js`
- Storage model: browser localStorage (`finance-tracker-goals-v1`)
- Render model: fully client-side React component
- Public export: default `GoalsFeature` component

Goal object shape:

```js
{
	id: string,
	name: string,
	targetAmount: number,
	savedAmount: number,
	createdAt: number
}
```

## Features

- Add a new financial goal with target and initial saved amount
- Update progress (saved amount) per goal
- Remove goals
- View summary cards:
	- Total target
	- Total saved
	- Overall completion percentage

## Integration

- Consumed by the web app route `apps/web/app/goals/page.tsx`
- Route protected using shared auth adapter (`apps/web/lib/auth.ts`)

## Why this is a valid monorepo contribution

- Implements a new, isolated `feature-*` package
- Reuses shared component and utility packages instead of duplicating logic
- Keeps assembly and routing inside the app layer while feature logic remains in the package

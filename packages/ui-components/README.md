# @repo/ui (ui-components)

Shared, framework-light React components used by every feature in the
monorepo. All components are pure presentation — no Firebase, no business
logic — so any feature package can consume them without pulling unrelated
dependencies.

## Exports

### Group baseline (Fenet)

- `Button` — primary action button with hover state
- `Input` — single-line text input with consistent styling
- `Card` — centered, padded container with shadow

### Composites contributed by Yabets

These are net-new generic primitives. They don't replace anything that was
already here — they're shared building blocks that any feature in the
monorepo can adopt.

| Component     | Props                                                   | Suggested consumers                                                                  |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Pill`        | `{ children, tone? }` — neutral/info/success/warning/danger | Any feature that needs a status tag (active/paused, on track/over budget, …)         |
| `EmptyState`  | `{ title?, description?, action? }`                     | Replaces every ad-hoc "No items yet" string in feature-goals, feature-recurring, … |
| `ProgressBar` | `{ value, max, label?, tone?, showPercent? }`           | feature-budget (utilization), feature-goals (`Progress: 50%` text → real bar), feature-insights |
| `StatTile`    | `{ label, value, hint?, tone? }`                        | KPI tiles — feature-insights, feature-reports, feature-recurring, dashboard          |
| `Stack`       | `{ direction?, gap?, align?, justify?, wrap? }`         | Replaces most one-off `display: flex` style blocks across the codebase               |
| `Section`     | `{ title?, description?, action?, children }`           | Standardized "title + body + optional action" section header                         |
| `Banner`      | `{ children, tone?, title? }` — info/success/warning/danger | Replaces inline `notice` / `error` paragraphs in every feature                       |

## Usage

```jsx
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Pill,
  ProgressBar,
  Section,
  Stack,
  StatTile,
} from "@repo/ui";

<Card>
  <Stack direction="row" justify="space-between" wrap gap={12}>
    <h2>Budget</h2>
    <Pill tone="success">On track</Pill>
  </Stack>

  <StatTile label="Spent" value="$120.00" hint="of $500 budget" tone="info" />
  <ProgressBar value={120} max={500} tone="success" />

  <Section title="Recent items">
    {items.length === 0 ? (
      <EmptyState title="Nothing yet" description="Add your first item." />
    ) : (
      items.map(...)
    )}
  </Section>

  <Banner tone="success">Saved successfully.</Banner>
</Card>;
```

## Why this composites set

Per the assignment: *"Each group member is expected to contribute
significantly to the group packages in addition to their features."*

Every primitive above appears in at least one teammate's feature as
duplicated inline JSX/CSS today (status pills, empty placeholders,
notice/error paragraphs, KPI tiles, manual `display: flex` blocks, and so
on). Lifting them into `@repo/ui` lets the rest of the team delete that
duplication later without changing behavior — and `feature-recurring` ships
using all of them, so they're proven against a real feature.

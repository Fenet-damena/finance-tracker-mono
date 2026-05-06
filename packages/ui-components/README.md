# @repo/ui (ui-components)

Shared, framework-light React components used by every feature in the
monorepo. All components are pure presentation — no Firebase, no business
logic — so any feature package can consume them without pulling unrelated
dependencies.

## Exports

### Original primitives (group baseline)

- `Button` — primary action button with hover state
- `Input` — single-line text input with consistent styling
- `Card` — centered, padded container with shadow

### Added with `feature-recurring`

These are net-new, generic primitives. They don't replace anything that
was already here.

- `Pill` — `{ children, tone? }` where `tone` is one of `neutral`, `info`,
  `success`, `warning`, `danger`. Useful for status tags like "Active",
  "Paused", "Every month".
- `EmptyState` — `{ title?, description?, action? }`. Friendly placeholder
  shown when a list/table has no rows yet.

## Usage

```jsx
import { Button, Card, Input, Pill, EmptyState } from "@repo/ui";

<Card>
  <Pill tone="success">Active</Pill>
  <Pill tone="warning">Paused</Pill>

  {items.length === 0 ? (
    <EmptyState
      title="No items yet"
      description="Add your first item above."
    />
  ) : (
    items.map(...)
  )}
</Card>;
```

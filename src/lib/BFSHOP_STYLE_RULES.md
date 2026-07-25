# BFshop Style Rules (Exact)

Use this as the strict, human-readable BFshop style reference for portal and documentation pages.

This file mirrors the exact system already implemented in code.

## 1) Objective

Recreate BFshop pages with consistent visual language by using the exact tokens, exact utility names, and exact usage rules below.

Do not treat this as a request to clone one exact page composition unless explicitly instructed.

## 2) Exact Tokens

### Background tokens

- `--bg-subtle-start: #050505`
- `--bg-subtle-mid: #0a0a0a`
- `--bg-subtle-end: #121212`

### Surface tokens

- `--surface-base-bg: rgba(255, 255, 255, 0.04)`
- `--surface-base-border: rgba(255, 255, 255, 0.12)`
- `--surface-base-shadow: 0 8px 24px rgba(0, 0, 0, 0.25)`

- `--surface-raised-bg: rgba(255, 255, 255, 0.08)`
- `--surface-raised-border: rgba(255, 255, 255, 0.2)`
- `--surface-raised-shadow: 0 16px 40px rgba(0, 0, 0, 0.34)`

- `--surface-spotlight-bg: rgba(255, 255, 255, 0.12)`
- `--surface-spotlight-border: rgba(255, 255, 255, 0.28)`
- `--surface-spotlight-shadow: 0 24px 56px rgba(0, 0, 0, 0.42)`

- `--surface-interactive-bg: rgba(255, 255, 255, 0.08)`
- `--surface-interactive-border: rgba(255, 255, 255, 0.2)`
- `--surface-interactive-shadow: 0 16px 40px rgba(0, 0, 0, 0.34)`
- `--surface-interactive-hover-bg: rgba(255, 255, 255, 0.11)`
- `--surface-interactive-hover-border: rgba(255, 255, 255, 0.32)`
- `--surface-interactive-hover-shadow: 0 24px 56px rgba(0, 0, 0, 0.46)`

### Shared shape token

- `--surface-radius: 16px`

### Accent token

- `--accent-electric-blue: #38bdf8`

### Macro spacing tokens

- `--space-header-tight: 0.75rem`
- `--space-header-loose: 2rem`
- `--space-section-gap: 3rem`

## 3) Exact Utility Classes

### Background utility

`bg-subtle-dark-gradient`

Exact recipe:

```css
background-color: #000000;
background-image:
	radial-gradient(1200px 500px at 15% -10%, rgba(255, 255, 255, 0.06), transparent 60%),
	linear-gradient(180deg, #050505 0%, #0a0a0a 45%, #121212 100%);
```

### Surface utilities

`surface-base`
- border: `1px solid rgba(255,255,255,0.12)`
- radius: `16px`
- background: `rgba(255,255,255,0.04)`
- shadow: `0 8px 24px rgba(0,0,0,0.25)`

`surface-raised`
- border: `1px solid rgba(255,255,255,0.2)`
- radius: `16px`
- background: `rgba(255,255,255,0.08)`
- shadow: `0 16px 40px rgba(0,0,0,0.34)`

`surface-spotlight`
- border: `1px solid rgba(255,255,255,0.28)`
- radius: `16px`
- background: `rgba(255,255,255,0.12)`
- shadow: `0 24px 56px rgba(0,0,0,0.42)`

### Light surface utilities

`surface-base-light`
- border: `1px solid rgba(23, 23, 23, 0.1)`
- background: `rgba(255, 255, 255, 0.92)`
- shadow: `0 2px 10px rgba(0, 0, 0, 0.04)`

`surface-raised-light`
- border: `1px solid rgba(23, 23, 23, 0.14)`
- background: `rgba(255, 255, 255, 0.98)`
- shadow: `0 12px 28px rgba(0, 0, 0, 0.08)`

`surface-spotlight-light`
- border: `1px solid rgba(23, 23, 23, 0.18)`
- background: `linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 246, 229, 0.95) 100%)`
- shadow: `0 18px 40px rgba(0, 0, 0, 0.12)`

### Interaction utilities

`is-interactive`
- transition: `transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease`

`is-interactive:hover`
- transform: `translateY(-2px)`
- border-color: `var(--interactive-accent-border, rgba(234, 88, 12, 0.8))`
- box-shadow: `0 8px 24px rgba(0, 0, 0, 0.1)`

`is-interactive:focus-visible`
- outline: `2px solid var(--interactive-accent-border, rgba(234, 88, 12, 0.8))`
- outline-offset: `2px`

Required BFshop rule:

- For BFshop interactive elements, set `--interactive-accent-border` to a blue value such as `rgba(56, 189, 248, 0.5)` or `rgba(56, 189, 248, 0.6)`.

### Accent utilities

`accent-electric-blue`
- color: `#38bdf8`

`hover-accent-electric-blue-border:hover`
- border-color: `rgba(56, 189, 248, 0.5)`

## 4) Exact Typography Utilities

### Fonts

- UI/body font: Inter
- display accent font when needed: Bebas Neue equivalent

### `card-eyebrow`

- font-family: Inter
- font-size: `0.75rem`
- font-weight: `600`
- letter-spacing: `0.14em`
- text-transform: `uppercase`

### `card-title`

- font-family: Inter
- font-size: `clamp(1.25rem, 1.1rem + 0.8vw, 1.5rem)`
- font-weight: `700`
- line-height: `1.15`

### `card-body`

- font-family: Inter
- font-size: `clamp(0.875rem, 0.84rem + 0.18vw, 1rem)`
- line-height: `1.65`

### `card-meta`

- font-family: Inter
- font-size: `0.75rem`
- line-height: `1.45`

## 5) Exact Spacing Utilities

### `card-stack`

- `display: flex`
- `flex-direction: column`
- `gap: 0.75rem`

### `card-stack-tight`

- `display: flex`
- `flex-direction: column`
- `gap: 0.5rem`

### `card-cluster-gap`

- base gap: `1rem`
- md+ gap: `1.5rem`

### `page-header-stack`

- `display: flex`
- `flex-direction: column`

### `page-header-tight`

- base gap: `0.75rem`
- md+ gap: `1rem`

### `page-header-loose`

- base margin-top: `2rem`
- md+ margin-top: `2.5rem`

### `page-section-gap`

- base margin-top: `3rem`
- md+ margin-top: `4rem`

### `page-section-stack`

- base gap: `3rem`
- md+ gap: `4rem`

## 6) Exact Usage Rules

### Accent usage

Use `#38BDF8` as BFshop's only accent.

Use accent on:

- eyebrow labels
- back links
- small status text/pills
- hover/focus borders
- compact action text

Do not use accent on:

- long-form body copy
- large background fills
- every border by default
- entire heading blocks without purpose

### Surface usage

- Tier indicates visual prominence.
- Interactivity indicates behavior.
- A component may combine a surface tier with `is-interactive`.
- Use `surface-raised` for standard dark documentation panels.
- Use `surface-spotlight` only for strongest focal panel/node.

### Card structure

Standard card order:

1. Eyebrow
2. Title
3. Body
4. Meta
5. Action

### Text density

- Keep titles concise.
- Keep first body line short where possible.
- Split long content into bullets/subsections.
- Avoid manual `<br />` for layout spacing.

## 7) Page Shell Patterns

### Documentation pages

Required shell pattern:

1. Back link above page header
2. Centered page title
3. Centered subtitle
4. Main rectangular content container or rectangular card grid

Typical wrapper:

- `min-h-screen bg-subtle-dark-gradient text-white`
- centered max-width container
- `page-header-stack page-header-tight`
- `page-section-gap`

Back link should use the `BackPillLink` pattern:

- dark restrained pill
- blue-accent text/hover behavior
- stable on small screens

### Portal pages

Allowed:

- one dominant focal hub
- circular navigation nodes
- concise labels

Not allowed:

- long-form documentation text inside circles
- competing accent systems
- cluttered hero behavior

Circle rule:

- Circles are for navigation/focal elements only.
- Rectangles are default for dense content.

## 8) Interaction Rules

Allowed:

- slight lift or slight scale
- blue hover/focus border shift
- subtle shadow increase

Avoid:

- orange hover states in BFshop context
- glow-heavy effects
- large bounce animations
- exaggerated transform distances

## 9) Quick Reproduction Checklist

Before approving a BFshop page, verify:

- dark canvas uses `bg-subtle-dark-gradient`
- accent is exactly `#38BDF8`
- surfaces follow tier intent (`surface-raised` vs `surface-spotlight`)
- interactive elements use blue `--interactive-accent-border`
- card roles use `card-eyebrow`, `card-title`, `card-body`, `card-meta`
- spacing uses `page-header-tight`, `page-section-gap`, `card-stack` or `card-stack-tight`
- documentation pages are structured and rectangular
- portal circles are navigation/focal only

# BFshop AI Styling System Spec

Use this document when asking another AI to reproduce the BFshop visual system in a different project.

This file is a literal styling-system reference. It defines exact tokens, exact utility names, and exact usage rules.

It is not a spec for cloning one exact page.

## 1) Objective

Replicate the BFshop styling system exactly enough that another AI can reproduce the same visual language across new pages.

This means reproducing:

- colors
- spacing
- surface tiers
- typography roles
- hover/focus behavior
- page-shell structure
- documentation vs portal behavior

Do not treat this as a request to copy one exact composition unless explicitly instructed.

## 2) Exact Tokens

These are the exact core values currently used in the project.

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

These utility names already exist and should be reproduced with the same intent.

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
- border-color: `var(--interactive-accent-border, rgba(56, 189, 248, 0.8))`
- box-shadow: `0 8px 24px rgba(0, 0, 0, 0.1)`

`is-interactive:focus-visible`
- outline: `2px solid var(--interactive-accent-border, rgba(56, 189, 248, 0.8))`
- outline-offset: `2px`

Important implementation rule:

- If a BFshop element is interactive, set `--interactive-accent-border` to a blue value such as `rgba(56, 189, 248, 0.5)` or `rgba(56, 189, 248, 0.6)`.

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

### Background rule

Default BFshop pages should use `bg-subtle-dark-gradient`.

### Accent rule

Use `#38BDF8` as the only BFshop accent.

Use it for:

- eyebrow labels
- back links
- small pills
- hover/focus borders
- small action text

Do not use it for:

- long-form body copy
- page-wide paragraph coloring
- large surface fills

### Surface rule

Use:

- `surface-raised` for standard dark content panels
- `surface-spotlight` for the strongest focal panel/node

Do not randomly mix multiple surface styles in the same small component cluster.

### Card structure rule

Standard card order should be:

1. eyebrow
2. title
3. body
4. meta
5. action

### Text density rule

- Use concise titles.
- Keep first body line short where possible.
- Split longer content into bullets or subsections.
- Avoid manual `<br />` spacing for layout.

## 7) Documentation Page Shell

Documentation pages should use this pattern:

1. Back link above header
2. Centered page title
3. Centered subtitle
4. Main rectangular content container or rectangular card grid underneath

Typical wrapper:

- `min-h-screen bg-subtle-dark-gradient text-white`
- centered max-width container
- `page-header-stack page-header-tight`
- `page-section-gap`

Back link style should be equivalent to the existing `BackPillLink` pattern:

- dark pill
- blue-accent text or hover
- small and restrained

## 8) Portal Page Rules

Portal pages may be more graphic than documentation pages.

Allowed:

- circles
- central hub node
- surrounding navigation nodes

Not allowed:

- long-form documentation text inside circles
- multiple competing accents
- marketing-style hero clutter

Circle rule:

- Circles are for portal/navigation/focal elements only.
- Rectangles remain the default for dense content and documentation.

## 9) Documentation Mode vs Portal Mode

### Documentation mode

Characteristics:

- calmer
- more structured
- rectangular
- information-first

### Portal mode

Characteristics:

- one dominant focal element
- surrounding navigation elements may be circular
- still restrained, not flashy

## 10) Interaction Rules

Use restrained interaction only.

Allowed:

- slight scale up on key focal nodes
- slight lift on standard interactive surfaces
- blue border change on hover/focus
- subtle shadow increase

Avoid:

- orange hover states
- strong glow bursts
- large bounce animations
- dramatic transform distances

## 11) Forbidden Patterns

Do not introduce:

- orange as the BFshop interaction accent
- purple gradient styling
- oversaturated multi-color palettes
- old generic blog framing
- large light documentation shells as the default
- long paragraphs inside circular nodes
- decorative effects without structural purpose

## 12) Exact Reproduction Checklist

Another AI reproducing this system must ensure:

- dark layered background using the exact gradient recipe
- accent color exactly `#38BDF8`
- utility equivalents for `surface-raised`, `surface-spotlight`, `card-eyebrow`, `card-title`, `card-body`, `card-meta`, `card-stack`, `card-stack-tight`, `page-header-tight`, `page-section-gap`
- interactive hover/focus border controlled via `--interactive-accent-border`
- documentation pages use rectangular structured layouts
- portal pages may use circles for navigation only
- hover/focus colors are blue, not orange

## 13) Copy-Paste Prompt For Another AI

```text
Recreate the BFshop styling system exactly enough to match its general visual language, but do not clone one specific page layout unless asked.

Use these exact tokens and patterns:

Background:
- #050505 -> #0A0A0A -> #121212 vertical gradient
- top-left radial glow rgba(255,255,255,0.06)

Accent:
- #38BDF8 only

Dark surfaces:
- base: bg rgba(255,255,255,0.04), border rgba(255,255,255,0.12)
- raised: bg rgba(255,255,255,0.08), border rgba(255,255,255,0.20)
- spotlight: bg rgba(255,255,255,0.12), border rgba(255,255,255,0.28)
- default radius: 16px

Typography roles:
- eyebrow: 12px uppercase, weight 600, tracking 0.14em
- title: clamp(1.25rem, 1.1rem + 0.8vw, 1.5rem), weight 700, line-height 1.15
- body: clamp(0.875rem, 0.84rem + 0.18vw, 1rem), line-height 1.65
- meta: 12px equivalent, quieter support text

Spacing:
- tight stack gap 0.5rem
- normal stack gap 0.75rem
- header gap 0.75rem base / 1rem md+
- section gap 3rem base / 4rem md+

Interaction:
- use subtle lift/scale only
- hover/focus border must use --interactive-accent-border with a blue rgba value
- never use orange hover accents

Usage rules:
- documentation pages are rectangular and structured
- portal/navigation pages may use circles for hub/nav elements
- circles must not contain long-form documentation content
- keep the overall design dark, technical, restrained, and readable
```
- spotlight bg: `rgba(255,255,255,0.12)`
- spotlight border: `rgba(255,255,255,0.28)`

Suggested radius:

- standard radius: `16px`

## 7) Typography System

### Fonts

Use:

- Inter or equivalent for UI/body
- a condensed display font equivalent to Bebas Neue for occasional focal words if desired

### Text roles

Every piece of text in a UI card or content block should map to one role:

- Eyebrow
- Title
- Body
- Meta

### Eyebrow

Use for:

- category
- context label
- status label
- small emphasis marker

Style target:

- 12px
- uppercase
- weight 600
- letter spacing around `0.14em`

### Title

Use for:

- main statement of a card or content block

Style target:

- approximately 20px to 24px for standard cards
- weight 700
- line-height around `1.15`

### Body

Use for:

- explanation text
- descriptive copy

Style target:

- approximately 14px to 16px
- line-height around `1.65`

### Meta

Use for:

- status
- time
- date
- small action text
- supporting detail

Style target:

- around 12px

## 8) Spacing System

### Micro spacing

Use repeatable internal spacing inside cards and content blocks.

Recommended rhythm:

- eyebrow to title: `8px`
- title to body: `12px`
- body to meta/action: `16px`

### Macro spacing

Use repeatable page-level spacing between major page regions.

Recommended rhythm:

- title to subtitle: tight
- subtitle to first major content block: larger
- major block to next major block: consistent and noticeable

### Practical utility intent

If expressing this as utilities, the system should map to concepts like:

- vertical stack
- tight vertical stack
- page header stack
- page section gap

## 9) Content Structure Rules

For standard BFshop cards, use this content order where possible:

1. Eyebrow
2. Title
3. Body
4. Meta
5. Action

Rules:

- keep one main idea per title
- keep first body line concise
- break long copy into bullets or subsections
- avoid manual line-break spacing as a layout technique

## 10) Page Shell Rules

BFshop documentation-style pages should generally follow this pattern:

1. Back link
2. Title
3. Subtitle
4. Main content block or card grid

Back link rules:

- small pill button
- placed above the page header
- aligned consistently inside the page container
- should use the accent in a restrained way

## 11) Interaction Rules

Hover/focus should be visible but restrained.

Allowed interaction behavior:

- slight translate or scale
- accent border shift
- subtle shadow change
- subtle background change

Avoid:

- large motion jumps
- bouncy transitions
- strong glow effects
- multiple competing hover colors

Important:

- BFshop interaction accent should be blue, not orange

## 12) Circle Usage Rules

Circles are allowed in the BFshop system, but only for the right job.

Use circles for:

- portal hub elements
- navigation nodes
- short-label feature items
- graphic focal objects

Do not use circles for:

- long-form documentation content
- dense explanatory text blocks
- article bodies

Rule:

- circles are for portal/navigation surfaces
- rectangles are for documentation/content surfaces

## 13) Documentation vs Portal Distinction

The BFshop system has two related page modes.

### Documentation mode

Used for:

- technical explanation pages
- data/entity pages
- progress logs
- slice breakdowns

Characteristics:

- calmer
- more structured
- rectangular content surfaces
- stronger readability priority

### Portal mode

Used for:

- project hub pages
- central navigation surfaces

Characteristics:

- stronger focal point
- more graphic composition allowed
- circles or unusual composition allowed
- still restrained and clean

## 14) Copy Tone Rules

BFshop copy should sound:

- direct
- technical
- clear
- grounded

Avoid:

- marketing hype
- vague filler
- playful product fluff
- exaggerated claims

## 15) Forbidden Patterns

Do not introduce:

- orange as the primary BFshop interaction accent
- purple gradients
- oversaturated multi-color palettes
- generic blog styling from the older site system
- large light backgrounds for BFshop documentation pages
- long paragraphs inside circular nodes
- decorative effects with no structural purpose

## 16) AI Reproduction Checklist

Another AI recreating this system must ensure:

- dark layered background
- white headings
- zinc/grey body text
- electric-blue accent `#38BDF8`
- three dark surface tiers
- interactivity treated separately from tier
- eyebrow/title/body/meta roles used consistently
- repeatable micro and macro spacing
- documentation pages use structured rectangular content surfaces
- portal/navigation pages may use circles for focal/nav elements only
- hover/focus accents use blue, not orange

## 17) Copy-Paste AI Prompt

Use this when asking another AI to reproduce the BFshop style system:

```text
Recreate the BFshop styling system, not one exact page layout.

Use a dark, technical, restrained visual language with:
- black/near-black gradient background
- white headings
- zinc-grey body text
- one electric-blue accent: #38BDF8

Build a reusable system with:
- three surface tiers: base, raised, spotlight
- interaction as a separate modifier
- typography roles: eyebrow, title, body, meta
- consistent micro spacing inside cards and macro spacing between page sections

Documentation pages should use:
- back link above header
- centered title
- centered subtitle
- rectangular content blocks or card grids

Portal/navigation pages may use circles for hub/navigation items, but long-form content should remain rectangular.

Hover/focus behavior should use the blue accent, subtle lift/scale, and restrained shadow changes.

Do not use orange as the main BFshop accent, do not use generic blog styling, and do not place long-form content inside circles.
```

## 18) Copy-Paste globals.css Block

Use this block in the other project globals.css file.

If that file already has other global rules, merge carefully and keep only one copy of each class.

```css
:root {
  --bg-subtle-start: #050505;
  --bg-subtle-mid: #0a0a0a;
  --bg-subtle-end: #121212;

  --surface-base-bg: rgba(255, 255, 255, 0.04);
  --surface-base-border: rgba(255, 255, 255, 0.12);
  --surface-base-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

  --surface-raised-bg: rgba(255, 255, 255, 0.08);
  --surface-raised-border: rgba(255, 255, 255, 0.2);
  --surface-raised-shadow: 0 16px 40px rgba(0, 0, 0, 0.34);

  --surface-spotlight-bg: rgba(255, 255, 255, 0.12);
  --surface-spotlight-border: rgba(255, 255, 255, 0.28);
  --surface-spotlight-shadow: 0 24px 56px rgba(0, 0, 0, 0.42);

  --surface-interactive-bg: rgba(255, 255, 255, 0.08);
  --surface-interactive-border: rgba(255, 255, 255, 0.2);
  --surface-interactive-shadow: 0 16px 40px rgba(0, 0, 0, 0.34);
  --surface-interactive-hover-bg: rgba(255, 255, 255, 0.11);
  --surface-interactive-hover-border: rgba(255, 255, 255, 0.32);
  --surface-interactive-hover-shadow: 0 24px 56px rgba(0, 0, 0, 0.46);

  --surface-radius: 16px;
  --accent-electric-blue: #38bdf8;

  --space-header-tight: 0.75rem;
  --space-header-loose: 2rem;
  --space-section-gap: 3rem;
}

.bg-subtle-dark-gradient {
  background-color: #000000;
  background-image:
    radial-gradient(
      1200px 500px at 15% -10%,
      rgba(255, 255, 255, 0.06),
      transparent 60%
    ),
    linear-gradient(
      180deg,
      var(--bg-subtle-start) 0%,
      var(--bg-subtle-mid) 45%,
      var(--bg-subtle-end) 100%
    );
}

.surface-base {
  border: 1px solid var(--surface-base-border);
  border-radius: var(--surface-radius);
  background: var(--surface-base-bg);
  box-shadow: var(--surface-base-shadow);
}

.surface-raised {
  border: 1px solid var(--surface-raised-border);
  border-radius: var(--surface-radius);
  background: var(--surface-raised-bg);
  box-shadow: var(--surface-raised-shadow);
}

.surface-spotlight {
  border: 1px solid var(--surface-spotlight-border);
  border-radius: var(--surface-radius);
  background: var(--surface-spotlight-bg);
  box-shadow: var(--surface-spotlight-shadow);
}

.surface-interactive {
  border: 1px solid var(--surface-interactive-border);
  border-radius: var(--surface-radius);
  background: var(--surface-interactive-bg);
  box-shadow: var(--surface-interactive-shadow);
  transition: transform 180ms ease, border-color 180ms ease,
    background-color 180ms ease, box-shadow 180ms ease;
}

.surface-interactive:hover {
  transform: translateY(-2px);
  border-color: var(--surface-interactive-hover-border);
  background: var(--surface-interactive-hover-bg);
  box-shadow: var(--surface-interactive-hover-shadow);
}

.surface-base-light {
  border: 1px solid rgba(23, 23, 23, 0.1);
  border-radius: var(--surface-radius);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.surface-raised-light {
  border: 1px solid rgba(23, 23, 23, 0.14);
  border-radius: var(--surface-radius);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.surface-spotlight-light {
  border: 1px solid rgba(23, 23, 23, 0.18);
  border-radius: var(--surface-radius);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.99) 0%,
    rgba(255, 246, 229, 0.95) 100%
  );
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
}

.is-interactive {
  transition: transform 180ms ease, border-color 180ms ease,
    box-shadow 180ms ease, background-color 180ms ease;
}

.is-interactive:hover {
  transform: translateY(-2px);
  border-color: var(--interactive-accent-border, rgba(56, 189, 248, 0.8));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.is-interactive:focus-visible {
  outline: 2px solid var(--interactive-accent-border, rgba(56, 189, 248, 0.8));
  outline-offset: 2px;
}

.accent-electric-blue {
  color: var(--accent-electric-blue);
}

.hover-accent-electric-blue-border:hover {
  border-color: rgba(56, 189, 248, 0.5);
}

.card-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.card-title {
  font-size: clamp(1.25rem, 1.1rem + 0.8vw, 1.5rem);
  font-weight: 700;
  line-height: 1.15;
}

.card-body {
  font-size: clamp(0.875rem, 0.84rem + 0.18vw, 1rem);
  line-height: 1.65;
}

.card-meta {
  font-size: 0.75rem;
  line-height: 1.45;
}

.card-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-stack-tight {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-cluster-gap {
  gap: 1rem;
}

.page-header-stack {
  display: flex;
  flex-direction: column;
}

.page-header-tight {
  gap: var(--space-header-tight);
}

.page-header-loose {
  margin-top: var(--space-header-loose);
}

.page-section-gap {
  margin-top: var(--space-section-gap);
}

.page-section-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-section-gap);
}

@media (min-width: 768px) {
  .card-cluster-gap {
    gap: 1.5rem;
  }

  .page-header-tight {
    gap: 1rem;
  }

  .page-header-loose {
    margin-top: 2.5rem;
  }

  .page-section-gap {
    margin-top: 4rem;
  }

  .page-section-stack {
    gap: 4rem;
  }
}
```

# BFshop Animation and Motion Specification

## Purpose

BFshop should feel professional, sleek and responsive rather than static. Animation must communicate arrival, movement, change or relationship. It must never delay access to information or exist only to make the interface look active.

## Core principles

- Motion should have a clear informational purpose.
- Animation should be brief, restrained and consistent.
- Content must remain understandable without animation.
- Repeated or persistent motion should be avoided unless it represents an active process.
- Interaction feedback should begin immediately after the user's action.
- Motion must respect the user's reduced-motion preference.

## Page entrance

- Page titles and introductory subtitles should appear immediately and should not animate.
- Main content areas may fade in once after the page loads.
- Entrance motion may combine opacity with a very small upward movement.
- Page-load animation should normally last between 200ms and 350ms.
- Related content should enter together. Avoid animating every heading, paragraph or control separately.
- Entrance animation must not replay because of an ordinary component update, theme change or return to an already visible section.

### Main project portal

- Leave a short pause after the static title and introduction appear.
- Reveal the central Analysis Machine first.
- Reveal the two supporting side panels together after the central panel.
- Use a slightly more visible upward movement and a smooth 700ms ease-in-out transition for this staged entrance.

## Scroll reveals

- Content below the initial viewport may reveal when it first enters the viewport.
- Each section should reveal only once during that page visit.
- Returning to a previously viewed section must not replay its animation.
- Closely related elements should reveal as a group.
- Scroll reveals should use the same restrained fade and slight upward movement as page entrance.
- The main portal's Architecture section uses a subtle 500ms ease-in-out reveal.

## Interactive workspaces

Interactive spaces such as the Order Hub and Intelligence Interface should visibly respond to commands and incoming information.

- Merchant page headers and navigation appear immediately once the correct theme is resolved.
- The primary workspace reveals once as a single group using a subtle 500ms fade and small upward movement.
- Merchant workspace panels should not use staggered page-entry animation.
- Movement should show where an item came from and where it went.
- Orders changing status should transition between their previous and new locations.
- Panels, evidence and charts should expand or appear smoothly without delaying access.
- Loading states should indicate that work is taking place without creating decorative or indefinite motion.
- An interaction should never animate so slowly that the user waits for the interface.

## Changing values

- Updated values should use a brief crossfade, restrained transition or temporary highlight.
- Avoid lengthy counting animations because they temporarily show incorrect values.
- Directional indicators may be used when an increase or decrease is meaningful.
- Motion must not imply that a value is live unless it is actually being updated.

## New information

- New orders, messages, findings and other incoming items should be visually distinguishable.
- A new item may receive a subtle glow, background highlight or accent that settles into its normal appearance.
- The new-state treatment should be temporary and normally last between 800ms and 1600ms.
- Persistent glow, pulsing or looping animation should be avoided because it creates noise and false urgency.

## Context guides

- A page guide opens automatically only on the user's first visit to that page.
- Its first automatic appearance begins 650ms after the page is reached and dismisses after five seconds.
- After its first appearance, the guide remains available through a small, consistent control beside the theme switch.
- Guides open as compact dropdowns and must not block the rest of the interface.
- Opening and closing use a smooth 400ms fade with minimal vertical movement.
- Guides close through their dismissal action, the Escape key or a click outside.

## Timing and easing

- Small interaction feedback: 120–180ms.
- Content entrance and reveal: normally 200–500ms; up to 700ms for the main portal's staged entrance.
- Layout movement or panel expansion: 250–400ms.
- Temporary new-item emphasis: 800–1600ms before settling.
- Entrances and movements should normally use an ease-out curve.
- Elements that move together should use matching timing and easing.

## Reduced motion

- Respect `prefers-reduced-motion: reduce`.
- Remove translation, scaling and non-essential movement when reduced motion is requested.
- Content should appear immediately or use an effectively instant opacity change.
- State changes must remain clear through text, colour, borders or other non-motion indicators.

## Avoid

- Animating page titles or introductory subtitles.
- Replaying scroll reveals.
- Large entrance distances.
- Long staggered sequences.
- Continuous glow, bounce, pulse or floating effects.
- Animating every individual piece of text.
- Using animation to conceal slow processing.
- Allowing visual polish to interfere with keyboard use, focus or readability.

## Governing rule

> Animation in BFshop should communicate arrival, movement, change or relationship. It should never delay access to information or exist only to make the interface look active.

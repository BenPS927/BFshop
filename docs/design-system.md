# BF Shop Design System Source of Truth

## Layout Principles
- Use CSS grid for macro layout structure.
- Use flexbox for micro layout and component internals.
- Avoid one-off measurements (for example ad hoc margin-top values used only once).
- Use shared spacing and typography scales across surfaces.

## Responsive Breakpoints
1. Small: 0 to 639px
2. Medium: 640 to 1023px
3. Large: 1024px and up

## Spacing Scale
1. Page gutter (left/right outer padding)
- Mobile: px-4
- Tablet: md:px-6
- Desktop: lg:px-8

2. Section padding (top/bottom for major blocks)
- Mobile: py-6
- Tablet: md:py-8
- Desktop: lg:py-12

3. Card or panel padding
- Mobile: p-4
- Tablet/Desktop: md:p-6

4. Form/input group spacing
- Wrapper: p-4 md:p-6
- Field vertical spacing: gap-3 md:gap-4

5. List spacing
- Tight list: space-y-2
- Normal content list: space-y-3
- Feature list/cards: gap-4 md:gap-6

6. Heading to body spacing
- h1 to next text: mb-4 md:mb-6
- h2 to next text: mb-3 md:mb-4
- h3 to next text: mb-2 md:mb-3

7. Block-to-block spacing
- Mobile: space-y-6
- Tablet: md:space-y-8
- Desktop: lg:space-y-12

8. Nav/header padding
- Mobile: px-4 py-3
- Desktop: lg:px-8 lg:py-4

9. Footer padding
- Mobile: px-4 py-6
- Desktop: lg:px-8 lg:py-8

10. Grid/card gaps
- Mobile: gap-4
- Tablet: md:gap-6
- Desktop: lg:gap-8

## Typography System
1. Display or page title (h1)
- Class: font-bebas text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide
- Usage: page hero titles only

2. Section title (h2)
- Class: font-inter font-semibold text-2xl md:text-3xl lg:text-4xl leading-snug
- Usage: major section headings

3. Subsection title (h3)
- Class: font-inter font-semibold text-xl md:text-2xl lg:text-3xl leading-snug
- Usage: card or section subheadings

4. Card title or strong label (h4)
- Class: font-inter font-medium text-lg md:text-xl lg:text-2xl leading-snug
- Usage: panel titles and item headings

5. Body text
- Class: font-inter text-base md:text-lg lg:text-lg leading-relaxed
- Usage: default paragraph content

6. Secondary body text
- Class: font-inter text-sm md:text-base lg:text-base leading-relaxed text-gray-600
- Usage: support text, descriptions, timestamps

7. Caption/meta text
- Class: font-inter text-xs md:text-sm lg:text-sm leading-normal text-gray-500
- Usage: metadata, legal text, fine print

8. Button text
- Class: font-inter font-medium text-sm md:text-base lg:text-base leading-none
- Usage: button labels

9. Input text
- Class: font-inter text-base md:text-base lg:text-lg leading-none
- Usage: entered values and form fields

10. Nav links
- Class: font-inter font-medium text-sm md:text-base lg:text-base leading-none
- Usage: header or sidebar navigation

## Merchant Layout Rule
- Implement one mobile rendering path and one large-screen rendering path.
- Use one shared columns array as the data source for both render paths.
- Mobile: one column visible at a time.
- Large: all columns visible simultaneously.

## Consistency Rule
Any new component should map to this scale first. If a new spacing or typography value is required, update this document before use in product code.

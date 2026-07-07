---
name: Academic Excellence System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#444650'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#757682'
  outline-variant: '#c5c6d2'
  surface-tint: '#435b9f'
  primary: '#00113a'
  on-primary: '#ffffff'
  primary-container: '#002366'
  on-primary-container: '#758dd5'
  inverse-primary: '#b3c5ff'
  secondary: '#345da4'
  on-secondary: '#ffffff'
  secondary-container: '#8ab0fe'
  on-secondary-container: '#0f4187'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#00174a'
  on-primary-fixed-variant: '#2a4386'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#15458b'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 32px
  gutter: 24px
  card-gap: 24px
  section-margin: 48px
---

## Brand & Style

The design system is engineered for high-stakes academic environments, prioritizing clarity, authority, and efficiency. It adopts a **Corporate Modern** aesthetic—blending the structured reliability of enterprise software with the refined sensibilities of modern SaaS. 

The visual language is characterized by intentional whitespace, a sophisticated "Naval" color palette, and high-legibility typography. Every interface element is designed to reduce cognitive load for educators and administrators, ensuring that complex data management feels orderly and professional. The emotional response is one of stability and intellectual rigor, avoiding decorative flourishes in favor of functional precision.

## Colors

The palette is anchored by **Deep Naval Blue**, establishing an immediate sense of institutional trust. This is used for primary structural elements like sidebars and headers. **Sky Blue** serves as the functional interactive color, providing clear visual cues for hover states and secondary navigation.

**Aureate Gold** is reserved strictly for primary Calls to Action (CTAs) and critical highlights, providing a prestigious contrast that guides the user's eye to the most important actions. The background utilizes a crisp **Light Gray** to differentiate the canvas from the **Pure White** surface cards, creating a clear "layered" effect that organizes information without the need for heavy borders.

## Typography

This design system utilizes **Inter** across all levels to ensure maximum legibility and a systematic, utilitarian feel. The type scale is optimized for data-dense environments.

- **Headlines:** Use Bold and Semi-Bold weights with tight letter-spacing to create a strong visual anchor for page titles.
- **Body:** Standardized at 16px for optimal reading on desktop, falling back to 14px for dense data tables or secondary meta-info.
- **Labels:** Small caps or bolded 12-14px weights are used for table headers and form labels to distinguish them clearly from user input and body text.
- **Hierarchy:** Maintain a clear vertical rhythm by ensuring line heights are consistently 1.4x to 1.5x the font size.

## Layout & Spacing

The system employs a **Fixed Grid** philosophy for desktop (1280px max-width) and a **Fluid Grid** for tablet and mobile devices. 

- **Sidebar:** Fixed at 280px on desktop to provide a persistent, high-contrast navigation anchor.
- **Grid:** A 12-column grid with 24px gutters ensures alignment across complex dashboard layouts.
- **Rhythm:** An 8px linear scale governs all padding and margins. Use 16px (2x) for internal component padding and 24px-32px (3x-4x) for major layout spacing.
- **Responsiveness:** On mobile, the sidebar collapses into a hamburger menu, and the 32px container padding reduces to 16px to maximize screen real estate.

## Elevation & Depth

Visual hierarchy is achieved primarily through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Light Gray (#F8F9FA) – the base canvas.
- **Level 1 (Cards/Content):** White (#FFFFFF) – uses a subtle 1px border (#E9ECEF) instead of heavy shadows to maintain a clean, academic look.
- **Level 2 (Modals/Dropdowns):** White (#FFFFFF) – utilizes an ambient, extra-diffused shadow (0px 10px 30px rgba(0, 0, 0, 0.05)) to suggest height without appearing "heavy."
- **Interaction:** Hover states on interactive cards should slightly deepen the border color rather than increasing shadow depth, keeping the UI grounded.

## Shapes

The design system uses a **Rounded** shape language to soften the "industrial" feel of a data-heavy CMS while maintaining professional boundaries. 

- **Standard Elements:** 0.5rem (8px) for buttons, input fields, and small cards.
- **Large Containers:** 1rem (16px) for main content cards and modal containers.
- **Badges/Chips:** Full pill-shape (999px) to contrast against the more structured rectangular elements of the grid.

## Components

- **Buttons:** Primary buttons use Aureate Gold with white text for maximum prominence. Secondary buttons use a Deep Naval Blue outline. Transitions should be a subtle 200ms ease-in-out.
- **Sidebar:** High-contrast (Naval Blue background). Active states use a Sky Blue left-accent border (4px) and a subtle background tint.
- **Tables:** Use a "Zebra" striping or subtle 1px horizontal dividers. Table headers must be sticky with a 12px Label-MD typography style.
- **Badges:** Used for statuses (e.g., "Active," "Pending"). Use low-opacity tints of the status colors (Success, Error, Warning) with high-contrast text for accessibility.
- **Input Fields:** 8px rounded corners with a 1px border (#CED4DA). On focus, the border transitions to Sky Blue with a soft 2px glow.
- **Summary Cards:** Placed at the top of dashboards to show key metrics. Use large Headline-LG for the primary number and Body-SM for the descriptor.
- **Modals:** Centered with a semi-transparent dark overlay (60% opacity). Use a 32px internal padding for a spacious, high-end feel.
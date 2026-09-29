# Personal Blog Design System

> Design direction for a personal digital space built around **Index / Writing / Fragments / Projects / Finder / News / Now**.
>
> The goal is not to reproduce any reference website. The three reference systems are treated as design research: take their strongest ideas, remove what does not fit, and recombine them into a quieter, more personal system.

---

# 1. Design Thesis

The site should feel like:

> **A quiet editorial notebook with the precision of a technical instrument.**

It should be minimal without feeling empty, technical without feeling like a dashboard, and personal without becoming decorative.

The visual system should prioritize:

1. **Content before chrome**
2. **Typography before cards**
3. **Whitespace before separators**
4. **Interaction before decoration**
5. **Functional color before brand color**
6. **Motion with purpose**
7. **Different information density for different pages**

The site is primarily a place to read, think, explore, and discover.

---

# 2. What We Take From the Three References

## From antfu.me

The strongest ideas to retain are:

- Narrow, comfortable reading width
- Strong vertical rhythm
- Near-monochrome visual system
- Transparent list and project surfaces instead of heavy cards
- Hierarchy created through opacity and typography
- Very restrained use of accent color
- Flat visual depth without unnecessary shadows
- Light and dark themes that keep the same structural language
- Simple technical content presentation
- Responsive layouts that simplify rather than shrink

### Translation into this site

Use whitespace, opacity, text hierarchy, and subtle borders as the default tools.

Do not wrap every piece of content inside a filled card.

Interactive color should appear mainly on hover, active state, live state, or semantic information.

---

## From AX

The strongest ideas to retain are:

- Strong text-first technical identity
- Dense information can still feel calm when aligned to one grid
- Hairline borders are useful for technical or data-heavy modules
- Sticky navigation can become more useful after scrolling
- Compact labels, filters, timestamps, and data panels work well together
- Technical dashboards do not need gradients or heavy shadows
- Dark mode can feel like a technical workspace rather than simply an inverted page
- Tables, charts, search, and metadata can live in the same visual system

### Translation into this site

Use this higher-density language mainly for **News**, Finder utilities, search, filters, and technical project details.

Do not let this density leak into Writing.

The reading experience and the information-monitoring experience should use the same design system but different density levels.

---

## From Paul Stamatiou

The strongest ideas to retain are:

- Warm editorial atmosphere
- Large areas of calm neutral background
- Reading layouts that feel closer to print than SaaS
- Typography creates more personality than UI decoration
- Media is allowed to become visually dominant when appropriate
- Different content modes can have different visual intensity
- Large rounded media can coexist with restrained editorial UI
- Desktop and mobile can reorganize navigation rather than mechanically scale it

### Translation into this site

The default light theme should feel slightly warm instead of pure white.

Writing can have a more editorial rhythm.

Projects may allow large imagery and wider layouts, while the rest of the site remains narrow and quiet.

---

# 3. The Resulting Design Personality

The design should not feel like:

- a SaaS dashboard
- a component-library demo
- a traditional portfolio template
- a news portal
- a glassmorphism experiment
- an animation showcase

It should feel like:

- a personal notebook
- a small independent publication
- a developer's workbench
- a curated internet library
- a live AI signal monitor

A useful mental model:

```text
Editorial calm
      +
Technical precision
      +
Personal curiosity
      =
This site
```

---

# 4. Visual Principles

## 4.1 Quiet by Default

The default state of the interface should be visually calm.

Use:

- neutral backgrounds
- restrained contrast
- transparent surfaces
- subtle borders
- low-emphasis metadata
- generous spacing

Interaction should increase contrast.

For example:

```text
Default item
opacity / contrast: medium

Hover item
opacity / contrast: high

Active item
accent or stronger surface
```

---

## 4.2 Flat Before Elevated

Avoid traditional floating cards.

Default hierarchy:

```text
Whitespace
→ Typography
→ Opacity
→ Hairline border
→ Subtle surface
→ Shadow only when functionally necessary
```

Shadows should be rare.

Dialogs, previews, or temporarily floating UI may use a very soft shadow.

Content lists should not.

---

## 4.3 Color Is Information

The site should not rely on a strong brand color everywhere.

Accent color is reserved for:

- active navigation
- links that need emphasis
- current / live state
- selected filters
- interactive hover states
- News status
- visualization semantics

Most pages should remain mostly neutral.

---

## 4.4 Typography Is the Main Visual Element

Headings, paragraphs, metadata, code, and labels should create the hierarchy.

Do not solve hierarchy by adding more containers.

---

# 5. Color System

These values are original tokens for this site rather than copies of the reference sites.

## Light Theme

```text
Canvas          #F6F5F1
Surface         #FBFAF7
Heading         #1B1B18
Body            #5F5E58
Muted           #8A8982
Border          rgba(27, 27, 24, 0.12)
Border Strong   rgba(27, 27, 24, 0.20)
Hover Surface   rgba(27, 27, 24, 0.045)
Code Surface    #EEEDE8
```

The light theme should feel like warm paper rather than pure white.

---

## Dark Theme

```text
Canvas          #111210
Surface         #171815
Heading         #F1F0E9
Body            #C4C3BB
Muted           #85847D
Border          rgba(241, 240, 233, 0.12)
Border Strong   rgba(241, 240, 233, 0.20)
Hover Surface   rgba(241, 240, 233, 0.055)
Code Surface    #1B1C19
```

The dark theme should feel soft and technical rather than pure black.

---

## Accent

Primary interactive accent:

```text
Signal          #6B8CFF
Signal Soft     rgba(107, 140, 255, 0.12)
```

Semantic live state:

```text
Live            #56C596
Warning         #E2A84A
Critical        #DF6C75
```

Accent colors should never dominate large page areas.

---

# 6. Typography

## Primary UI Typeface

Recommended direction:

```text
Geist Sans
+
Noto Sans SC / system CJK fallback
```

Used for:

- navigation
- UI
- metadata
- lists
- Finder
- News
- Projects

---

## Editorial Typeface

For Writing, an optional serif layer can add personality.

Recommended direction:

```text
Newsreader / Source Serif
+
Noto Serif SC
```

Use serif only for long-form reading if it performs well with mixed Chinese and English.

If bilingual rendering feels inconsistent, keep the whole site sans-serif.

---

## Monospace

```text
Geist Mono
+
system monospace fallback
```

Used for:

- code
- timestamps
- technical IDs
- tiny News metadata where useful

---

## Type Scale

```text
Display         40–48px
Page Title      32–36px
Section Title   22–24px
Card/List Title 17–20px
Body            16–18px
Metadata        13–14px
Micro Label     11–12px
```

Long-form body should use generous line height:

```text
1.7–1.8
```

Short UI text should be tighter:

```text
1.3–1.5
```

---

# 7. Layout System

## Reading Width

Writing and long-form content:

```text
max-width: 680px
```

Fragments:

```text
max-width: 720px
```

General Index content:

```text
max-width: 760px
```

Projects / Finder / News may expand:

```text
max-width: 1080–1200px
```

The site should not use the same width for every page.

---

## Gutters

Desktop:

```text
32px minimum
```

Tablet:

```text
24px
```

Mobile:

```text
20–24px
```

---

## Vertical Rhythm

Prefer large gaps between conceptual sections rather than card borders.

Typical rhythm:

```text
Section gap     72–96px
Group gap       32–48px
Item gap        16–24px
Inline gap      8–12px
```

---

# 8. Shape Language

The system should avoid both completely square SaaS UI and excessive roundness.

Recommended radius scale:

```text
xs      4px
sm      8px
md      12px
lg      18px
media   24px
pill    999px
```

Usage:

- text rows: usually no container radius
- controls: 8–12px
- panels: 12–18px
- project media: 18–24px
- filter chips: pill
- article code: 8–12px

Do not use large 30–50px radius on every section.

---

# 9. Navigation

Primary navigation:

```text
Writing
Fragments
Projects
Finder
News
```

Secondary destinations:

```text
Now
```

Logo / name returns to:

```text
Index
```

## Desktop

Navigation should begin lightweight and transparent.

After scrolling, it may become:

- sticky
- slightly blurred
- separated by a subtle hairline
- more compact

Primary navigation should use text.

Lucide icons should mainly be used for utility actions:

- theme
- search
- external link
- menu
- RSS
- GitHub

---

## Mobile

Do not simply shrink the desktop navigation.

Use a compact navigation layout:

- fewer visible destinations
- optional menu / command surface
- 44px minimum touch target
- horizontal scrolling only if intentional

---

# 10. Motion System

All animation uses **Motion**.

Motion should feel responsive and quiet.

## Principles

Use animation to explain:

- where content came from
- what changed
- which element is active
- how two views relate

Do not animate simply because an element exists.

---

## Timing

```text
Micro interaction    120–180ms
UI transition        180–260ms
Page transition      220–320ms
Large layout change  spring-based
```

---

## Default Movement

Prefer:

```text
opacity
translateY 4–12px
scale 0.98–1
layout transitions
```

Avoid:

- large flying transitions
- long easing sequences
- scroll hijacking
- constant parallax
- continuous ambient animation on reading pages

---

## Signature Motion By Page

### Index

Very small staged entrance for:

- identity
- navigation
- recent activity

### Writing

Almost no decorative motion.

Reading should remain stable.

### Fragments

Small layout transitions when filtering or opening related notes.

### Projects

Shared-layout transitions between project preview and detail are encouraged.

### Finder

This is one of the strongest interaction surfaces.

Use:

- folder transition
- selection movement
- preview expansion
- shared layout animation

### News

New information can use a brief, subtle live-state animation.

Never make the whole feed constantly move.

### Now

Soft content replacement / date update.

---

## Reduced Motion

Respect:

```text
prefers-reduced-motion
```

Reduced mode should remove:

- entrance translations
- spring movement
- shared element motion

and preserve:

- opacity changes
- immediate state updates

---

# 11. Icon System

Use **Lucide** exclusively.

Rules:

- icons are functional, not decorative
- default stroke width should remain consistent
- icon size should usually be 16–20px
- avoid icon + label when the label alone is clearer
- primary page navigation remains text-first

Recommended examples:

```text
Finder       Folder / FolderOpen
News         Newspaper / Activity
External     ArrowUpRight
Theme        Sun / Moon
Search       Search
RSS          Rss
GitHub       Github
Time         Clock
Live         RadioTower
```

---

# 12. Core Component Language

All core components are custom-built.

## Text Link

Default:

- neutral foreground
- subtle underline or opacity difference

Hover:

- stronger foreground
- optional Signal accent for meaningful external or active links

---

## Content Row

Used for:

- Writing
- Fragments
- recent Index entries
- Finder entries

Default:

- transparent background
- strong title
- muted metadata

Hover:

- slightly stronger contrast
- optional `Hover Surface`
- no large shadow

---

## Chip

Used for:

- filters
- topics
- states
- sources

Style:

- thin hairline border
- transparent or very subtle surface
- compact typography
- pill shape where interaction is filter-like

Do not turn every metadata value into a chip.

---

## Panel

Used only when the information benefits from grouping.

Good uses:

- News statistics
- Finder preview
- project technical metadata
- search controls

Bad uses:

- every article
- every paragraph
- every navigation item

---

# 13. Index

## Purpose

Index is the front door to the personal digital space.

It should answer:

```text
Who is this?
What is happening recently?
Where can I go?
```

## Structure

Recommended:

```text
Identity
Navigation
Currently
Recent
Selected Work
```

Do not use a traditional portfolio hero.

No giant:

```text
Hello, I'm ...
Frontend Developer
[Hire Me]
```

Instead use a quiet personal introduction.

Recent content can mix:

- Essay
- Fragment
- Work
- News highlight

with clear type labels.

---

# 14. Writing

## Personality

The calmest page on the site.

Design goal:

> Remove everything that competes with reading.

## List View

Prefer chronological text rows.

Each item may contain:

- title
- date
- description
- reading time
- topic

Avoid large image cards by default.

---

## Article View

Recommended:

```text
680px reading width
generous line height
strong typography
quiet code blocks
optional desktop TOC
```

Article images may intentionally break out wider than the prose column.

Interactive MDX modules should visually feel embedded in the article rather than external widgets.

---

# 15. Fragments

## Personality

More compact and exploratory than Writing.

Fragments should feel like a working notebook.

Possible information:

- title
- updated date
- status
- related fragments
- topic

The page may use slightly higher information density than Writing.

No need for long descriptions on every list item.

---

# 16. Projects

## Personality

The Projects section is where the layout can become wider and more visual.

It includes:

- full projects
- tools
- UI experiments
- visualization experiments
- WebGL experiments
- smaller prototypes

## Layout

Desktop may use:

```text
2-column editorial grid
```

Selected work can use a larger feature item.

Cards should not look like SaaS product cards.

Prefer:

- image / preview
- title
- one-line context
- status
- year

Project detail pages may use large media with rounded corners.

---

# 17. Finder

## Personality

Finder is a curated personal internet library.

It should borrow the **idea** of a file browser without visually cloning macOS Finder.

## Desktop Layout

Recommended:

```text
Category / folder rail
        |
Content list
        |
Optional preview pane
```

Possible categories:

- Design
- Engineering
- Tools
- Reading
- Inspiration
- Websites

## Entry

Each item may include:

- title
- source / domain
- note
- date added
- category
- external link

The personal note is more important than metadata.

## Interaction

Finder is a suitable place for richer Motion transitions:

- active folder indicator
- list transition
- preview opening
- back navigation
- keyboard navigation later

---

# 18. News

## Purpose

News is a live AI information surface.

This page has the highest information density on the site.

It should feel like:

> a calm signal monitor, not a noisy news portal.

## Content

Possible groups:

- News
- Models
- Products
- Research
- Open Source
- Companies
- Tools

## Feed Item

Each item should contain only useful information:

```text
timestamp
source
category
headline
short summary
external link
```

Optional:

```text
importance
language
related item
```

## Visual Language

News should borrow the technical density of a dashboard while preserving the site's calm style.

Use:

- hairline separators
- small labels
- timestamps
- compact filters
- subtle live indicators
- flat data panels

Avoid:

- giant news cards
- thumbnail-heavy layouts
- aggressive breaking-news colors
- constant pulsing animations

## Real-time State

New items may briefly use:

```text
Live color
+
soft background transition
```

Then settle back into the normal neutral feed.

---

# 19. Now

Now should feel temporary and alive.

Possible sections:

```text
Building
Learning
Reading
Listening
Thinking
```

It should remain simple.

No dashboard.

No progress rings unless they provide real value.

A visible "Updated" timestamp is useful.

---

# 21. Theme Strategy

Both light and dark themes are first-class.

Do not design light mode first and simply invert it.

Both themes should preserve:

- hierarchy
- contrast relationships
- border subtlety
- code readability
- accent semantics

Theme preference should respect:

```text
prefers-color-scheme
```

and user choice should persist.

---

# 22. Responsive Strategy

Responsive design should change structure when necessary.

## Desktop

Allow:

- wider Projects
- Finder multi-pane layout
- News filters and metadata side-by-side
- Essay TOC

## Mobile

Prefer:

- single column
- less chrome
- simplified navigation
- stacked metadata
- Finder drill-down instead of three panes
- News filters in horizontal scroll or expandable controls
- no desktop-only sidebars

Do not compress desktop interfaces until they become tiny.

---

# 23. Accessibility

Minimum requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient text contrast
- 44px mobile touch targets
- reduced motion support
- accessible names for icon-only actions
- no information conveyed only through color

Focus states should be intentionally designed, not removed.

---

# 24. Design Rules

## Do

- Use whitespace aggressively
- Keep long-form reading narrow
- Use transparent list structures
- Let type create hierarchy
- Use hairline borders for dense technical UI
- Keep color contextual
- Allow Projects to become visually wider
- Let News become denser without becoming noisy
- Use Motion to explain state change
- Keep mobile layouts structurally simple

## Don't

- Wrap every section in a card
- Add shadows to every interactive object
- Use gradients as default decoration
- Fill every empty area
- Use many global accent colors
- Animate every scroll event
- Make every page use the same information density
- Clone macOS Finder literally
- Make News look like a generic news website
- Turn Projects into a startup portfolio template

---

# 25. Technical Mapping

The design system maps to the chosen technical stack:

```text
Astro
→ page structure and content

Tailwind CSS
→ tokens, spacing, layout, responsive states

Custom Astro Components
→ core UI components

React Islands
→ only complex stateful interactions

Motion
→ all animation

Lucide
→ all icons

Markdown / MDX
→ Writing, Fragments, Projects content
```

No general-purpose UI component library is required.

---

# 26. Final Design Sentence

If a design decision is unclear, use this sentence as the filter:

> **Keep the reading experience editorial, the interaction precise, the information calm, and the personality visible through details rather than decoration.**

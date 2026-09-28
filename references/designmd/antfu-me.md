---
version: alpha
name: Anthony Fu public site design analysis
description: "Evidence-based visual analysis of eight English public page types at desktop and narrow widths, including an explicit dark-theme cross-check."

colors:
  light-canvas: "#FFFFFF"
  dark-canvas: "#050505"
  body: "#555555"
  heading: "#000000"
  secondary-heading: "#222222"
  muted: "#888888"
  dark-body: "#BBBBBB"
  dark-secondary: "#DDDDDD"
  dark-heading: "#FFFFFF"
  border-subtle: "rgba(136, 136, 136, 0.27)"
  chip-surface: "rgba(136, 136, 136, 0.133)"
  project-hover-surface: "rgba(136, 136, 136, 0.067)"
  prose-rule: "#7D7D7D4D"
  selection: "#8884"
  code-surface: "#FAFAFA"
  code-ink: "#393A34"
  code-dark-surface: "#0E0E0E"
  inline-code-surface: "rgba(170, 170, 170, 0.094)"
  accent-blue: "#60A5FA"
  accent-blue-surface: "#60A5FA1A"
  accent-rose: "#FB7185"
  accent-rose-surface: "#FB71851A"
  accent-amber: "#FBBF24"
  accent-amber-surface: "#FBBF241A"
  accent-lime: "#A3E635"
  accent-lime-surface: "#A3E6351A"
  scrollbar-light: "#EEEEEE"
  scrollbar-light-hover: "#BBBBBB"
  scrollbar-dark: "#111111"
  scrollbar-dark-hover: "#222222"

typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: normal
  navigation:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: normal
  page-title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "40px"
    letterSpacing: normal
  section-tab:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: "36px"
    letterSpacing: normal
  article-h2:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "31.9999px"
    letterSpacing: normal
  article-h3:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: normal
  article-h4:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: normal
  post-title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "21.6px"
    letterSpacing: normal
  metadata:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: normal
  project-title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif"
    fontSize: "17.6px"
    fontWeight: 400
    lineHeight: "26.4px"
    letterSpacing: normal
  magic-chip:
    fontFamily: "\"Roboto Condensed\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: normal
  code:
    fontFamily: "\"DM Mono\", \"Input Mono\", \"Fira Code\", monospace"
    fontSize: "14.4px"
    fontWeight: 400
    lineHeight: "20.16px"
    letterSpacing: normal

rounded:
  chip: "4px"
  action: "4px"
  project-card: "6px"
  code-block: "6px"
  terminal: "12px"
  avatar: "50%"
  control-pill: "9999px"
  scrollbar: "10px"

spacing:
  main-inset: "40px 28px"
  navigation-inset: "32px"
  navigation-gap: "19.2px"
  prose-width: "min(65ch, 100%)"
  prose-paragraph-rhythm: "20px"
  archive-row: "8px 0px 24px"
  project-grid-gap: "16px"
  project-card-inset: "8px 14px 14px"
  code-inset: "12.3429px 16.4572px"

components:
  site-nav:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    padding: "{spacing.navigation-inset}"
    gap: "{spacing.navigation-gap}"
    display: grid
    gridTemplateColumns: auto max-content
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    opacity: "0.6"
    transition: opacity 0.2s
  nav-link-hover:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    opacity: "1"
    transition: opacity 0.2s
  nav-link-focus:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    opacity: "0.6"
    outline: "rgb(55, 65, 81) none 3px"
    outlineOffset: "1px"
  prose-link:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    transition: border 0.3s ease-in-out
  prose-link-hover:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    transition: border 0.3s ease-in-out
  magic-chip:
    backgroundColor: "{colors.chip-surface}"
    textColor: "{colors.muted}"
    typography: "{typography.magic-chip}"
    padding: "4px 6px"
    gap: "4px"
    rounded: "{rounded.chip}"
    display: inline-flex
    alignItems: center
  sponsor-cta:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    padding: "8px 8px 8px 12px"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.action}"
    opacity: "0.5"
    transition: border 0.3s ease-in-out
  sponsor-cta-hover:
    backgroundColor: "{colors.accent-rose-surface}"
    textColor: "{colors.accent-rose}"
    typography: "{typography.body}"
    padding: "8px 8px 8px 12px"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.action}"
    opacity: "1"
    transition: border 0.3s ease-in-out
  project-quick-link:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    padding: "4px 10px"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.action}"
    opacity: "0.5"
    transition: "all 0.2s cubic-bezier(0, 0, 0.2, 1)"
  project-quick-link-hover:
    backgroundColor: "{colors.accent-blue-surface}"
    textColor: "{colors.accent-blue}"
    typography: "{typography.body}"
    padding: "4px 10px"
    border: "1px solid {colors.border-subtle}"
    rounded: "{rounded.action}"
    opacity: "1"
    transition: "all 0.2s cubic-bezier(0, 0, 0.2, 1)"
  post-row:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    margin: "{spacing.archive-row}"
    opacity: "0.6"
  post-row-hover:
    backgroundColor: transparent
    textColor: "{colors.heading}"
    typography: "{typography.body}"
    margin: "{spacing.archive-row}"
    opacity: "1"
  project-card:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.project-title}"
    padding: "{spacing.project-card-inset}"
    rounded: "{rounded.project-card}"
    opacity: "0.6"
    display: flex
    alignItems: center
    transition: "0.2s ease-out"
  project-card-hover:
    backgroundColor: "{colors.project-hover-surface}"
    textColor: "{colors.body}"
    typography: "{typography.project-title}"
    padding: "{spacing.project-card-inset}"
    rounded: "{rounded.project-card}"
    opacity: "1"
    display: flex
    alignItems: center
    transition: "0.2s ease-out"
  sponsor-tab:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    opacity: "0.5"
  sponsor-tab-active:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    opacity: "0.75"
  code-block:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.code-ink}"
    typography: "{typography.code}"
    padding: "{spacing.code-inset}"
    margin: "7.2px 0px"
    rounded: "{rounded.code-block}"
    display: block
  photo-tile:
    backgroundColor: transparent
    width: "100%"
    aspectRatio: "1 / 1"
    objectFit: cover
    rounded: "0px"
---

> Source: https://antfu.me/ · Captured: 2026-09-28 · Locale: en
> Public-page design analysis. Claims, scope, and confidence are evidence-bound.

## Overview

The sampled public site is a quiet, monochrome technical-editorial system. A narrow 65ch prose column, generous vertical rhythm, and opacity-based links create a calm reading surface; lists and transparent project cards expand that vocabulary instead of introducing heavy card chrome. Light mode is white with a sparse generative canvas underneath, while an explicit toggle maps the same structure to #050505 and inverts the canvas. Code articles add DM Mono/Shiki panels and a left table of contents, and the Photos page turns the grid into square, cover-cropped media. This is an evidence-bound analysis, not an official design-system export.

## Colors

The light system is almost entirely grayscale: #FFFFFF canvas, #000 headings/strong links, #555 body and navigation, #222 article H2s, and #888 muted chips. Hairlines use rgba(136,136,136,.27); chips use rgba(136,136,136,.133). Dark mode replaces the canvas with #050505 and the prose ramp with #BBB/#DDD/#FFF while retaining gray hairlines. Contextual accents appear on hover: #60A5FA with #60A5FA1A on the sampled GitHub action, #FB7185 with #FB71851A on sponsor actions; CSS also declares amber and lime variants. Code uses #FAFAFA/#393A34 in light mode and a declared #0E0E0E dark surface. Preserve alpha values and do not promote photographic placeholder gradients to brand colors.

| Token | CSS value | Role / context | Evidence |
| --- | --- | --- | --- |
| light-canvas | `#FFFFFF` | Fresh light canvas on every sampled route. | [HOMELIGHT](#evidence-homelight), [CSS](#evidence-css) |
| dark-canvas | `#050505` | Observed after local dark toggle and declared by html.dark. | [HOMEDARK](#evidence-homedark), [CSS](#evidence-css) |
| body | `#555555` | Default prose and navigation gray in light mode. | [HOMELIGHT](#evidence-homelight), [NAVDESKTOP](#evidence-navdesktop) |
| heading | `#000000` | Strongest light-mode text/link color. | [HOMETYPE](#evidence-hometype) |
| secondary-heading | `#222222` | Article h2 color in light mode. | [ARTICLE](#evidence-article) |
| muted | `#888888` | Magic chips and TOC/secondary text. | [HOMELIGHT](#evidence-homelight), [CSS](#evidence-css) |
| dark-body | `#BBBBBB` | Dark-mode prose token. | [HOMEDARK](#evidence-homedark), [CSS](#evidence-css) |
| dark-secondary | `#DDDDDD` | Dark-mode deeper prose token. | [HOMEDARK](#evidence-homedark), [CSS](#evidence-css) |
| dark-heading | `#FFFFFF` | Dark-mode strongest text token. | [HOMEDARK](#evidence-homedark) |
| border-subtle | `rgba(136, 136, 136, 0.27)` | Hairline border on low-emphasis controls. | [HOMELIGHT](#evidence-homelight), [PROJECTQUICK](#evidence-projectquick) |
| chip-surface | `rgba(136, 136, 136, 0.133)` | Translucent backing for compact project/link chips. | [HOMELIGHT](#evidence-homelight) |
| project-hover-surface | `rgba(136, 136, 136, 0.067)` | Project card hover wash. | [PROJECTHOVER](#evidence-projecthover) |
| prose-rule | `#7D7D7D4D` | Resting bottom rule on prose links. | [CSS](#evidence-css) |
| selection | `#8884` | Browser selection wash declared by CSS. | [CSS](#evidence-css) |
| code-surface | `#FAFAFA` | Light Shiki code surface. | [ARTICLE](#evidence-article), [CSSARTICLE](#evidence-cssarticle) |
| code-ink | `#393A34` | Base light code ink. | [ARTICLE](#evidence-article) |
| code-dark-surface | `#0E0E0E` | Declared dark Shiki surface. | [CSSARTICLE](#evidence-cssarticle) |
| inline-code-surface | `rgba(170, 170, 170, 0.094)` | Inline code chip in prose. | [ARTICLE](#evidence-article) |
| accent-blue | `#60A5FA` | Observed GitHub quick-link hover color. | [PROJECTQUICK](#evidence-projectquick), [CSS](#evidence-css) |
| accent-blue-surface | `#60A5FA1A` | Translucent backing for the observed blue quick-link hover. | [PROJECTQUICK](#evidence-projectquick) |
| accent-rose | `#FB7185` | Observed sponsor CTA hover color. | [SPONSORCTA](#evidence-sponsorcta), [CSS](#evidence-css) |
| accent-rose-surface | `#FB71851A` | Translucent backing for the observed rose sponsor-action hover. | [SPONSORCTA](#evidence-sponsorcta) |
| accent-amber | `#FBBF24` | Declared amber quick-link hover color. | [CSS](#evidence-css) |
| accent-amber-surface | `#FBBF241A` | Declared translucent backing for amber quick-link hover. | [CSS](#evidence-css) |
| accent-lime | `#A3E635` | Declared lime quick-link hover color. | [CSS](#evidence-css) |
| accent-lime-surface | `#A3E6351A` | Declared translucent backing for lime quick-link hover. | [CSS](#evidence-css) |
| scrollbar-light | `#EEEEEE` | Light scrollbar thumb declared by CSS. | [CSS](#evidence-css) |
| scrollbar-light-hover | `#BBBBBB` | Light scrollbar hover thumb declared by CSS. | [CSS](#evidence-css) |
| scrollbar-dark | `#111111` | Dark scrollbar thumb declared by CSS. | [CSS](#evidence-css) |
| scrollbar-dark-hover | `#222222` | Dark scrollbar hover thumb declared by CSS. | [CSS](#evidence-css) |

## Typography

Inter carries the sampled UI and editorial text: 16px/400/28px body copy, 36px/800/40px page titles, 24px/700 article H2s, 20px/600 H3s, 16px/600 H4s, 18px/21.6px archive titles, and 14px/20px metadata/footer. Global navigation is 16px/24px; large archive section tabs are 30px/36px with active versus inactive opacity. Compact project-name chips render Roboto Condensed at 16px/16px. Article code renders DM Mono at 14.4px/20.16px on #FAFAFA. The stylesheet declares multiple subsetted WOFF2 files for Inter, DM Mono, Roboto Condensed, and Bad Script; Bad Script was not observed as the rendered face in these samples.

| Token | Font family | Size | Weight | Line height | Tracking | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| body | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 16px | 400 | 28px | normal | [HOMETYPE](#evidence-hometype), [ARTICLE](#evidence-article) |
| navigation | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 16px | 400 | 24px | normal | [NAVDESKTOP](#evidence-navdesktop) |
| page-title | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 36px | 800 | 40px | normal | [HOMETYPE](#evidence-hometype), [ARTICLE](#evidence-article) |
| section-tab | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 30px | 400 | 36px | normal | [POSTS](#evidence-posts) |
| article-h2 | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 24px | 700 | 31.9999px | normal | [ARTICLE](#evidence-article) |
| article-h3 | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 20px | 600 | 32px | normal | [ARTICLE](#evidence-article) |
| article-h4 | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 16px | 600 | 24px | normal | [ARTICLE](#evidence-article) |
| post-title | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 18px | 400 | 21.6px | normal | [POSTDETAIL](#evidence-postdetail) |
| metadata | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 14px | 400 | 20px | normal | [POSTDETAIL](#evidence-postdetail) |
| project-title | Inter, ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif | 17.6px | 400 | 26.4px | normal | [PROJECTS](#evidence-projects) |
| magic-chip | "Roboto Condensed", sans-serif | 16px | 400 | 16px | normal | [HOMELIGHT](#evidence-homelight) |
| code | "DM Mono", "Input Mono", "Fira Code", monospace | 14.4px | 400 | 20.16px | normal | [ARTICLE](#evidence-article) |

## Layout

At 1440px, main uses 40px vertical and 28px horizontal padding while the prose rule constrains copy to min(65ch,100%), measured as a 656.09px centered column from x=391.95. The global header is a 90px grid with 32px nav padding; at 390px it is 88px and the main column is 334px with 28px side margins. Archive rows put title and date in a desktop row and stack them at 390px. Projects use a 16px-gap grid: three 350px columns at 1440px and one at 390px. The article adds a 300px left table of contents. Photos use square 334px cover tiles: four columns at 1440px and one at 390px, again with 16px gaps. Saved CSS also contains min-width rules at 640, 768, 1024, 1280, and 1536px; only 390px and 1440px behavior was directly sampled.

### Spacing Tokens

| Token | Value | Evidence |
| --- | --- | --- |
| main-inset | 40px 28px | [HOMELIGHT](#evidence-homelight), [HOMEMOB](#evidence-homemob) |
| navigation-inset | 32px | [NAVDESKTOP](#evidence-navdesktop) |
| navigation-gap | 19.2px | [CSS](#evidence-css) |
| prose-width | min(65ch, 100%) | [HOMELIGHT](#evidence-homelight), [HOMEMOB](#evidence-homemob) |
| prose-paragraph-rhythm | 20px | [HOMETYPE](#evidence-hometype) |
| archive-row | 8px 0px 24px | [POSTS](#evidence-posts) |
| project-grid-gap | 16px | [PROJECTS](#evidence-projects) |
| project-card-inset | 8px 14px 14px | [PROJECTS](#evidence-projects) |
| code-inset | 12.3429px 16.4572px | [ARTICLE](#evidence-article) |

## Elevation & Depth

Depth is intentionally flat. Sampled navigation, archive rows, project cards, and photo tiles have no drop shadow; hierarchy comes from whitespace, 1px low-alpha borders, opacity, and monochrome contrast. The generative canvas sits in a fixed, pointer-events-none wrapper at z-index -1 and inverts in dark mode. Code blocks are quiet flat panels, while the source terminal-window rule has a 12px radius and a faint rgba(0,0,0,.05) shadow. CSS defines a staged 1s slide-enter from 10px lower and disables it under reduced-motion; static captures do not prove all animation timing in practice.

## Shapes

Most editorial surfaces are square. The recurring radii are 4px for chips and outlined actions, 6px for project cards and Shiki blocks, 12px for terminal frames, and circular 50% project icon avatars. Photo tiles remain square with object-fit: cover rather than rounded thumbnails. Scrollbars use 10px radii, and a small view-switch control is pill-shaped.

| Token | Value | Evidence |
| --- | --- | --- |
| chip | 4px | [HOMELIGHT](#evidence-homelight) |
| action | 4px | [SPONSORCTA](#evidence-sponsorcta) |
| project-card | 6px | [PROJECTS](#evidence-projects) |
| code-block | 6px | [ARTICLE](#evidence-article) |
| terminal | 12px | [CSSARTICLE](#evidence-cssarticle) |
| avatar | 50% | [PROJECTS](#evidence-projects) |
| control-pill | 9999px | [PHOTOS](#evidence-photos) |
| scrollbar | 10px | [CSS](#evidence-css) |

## Components

The global shell is a logo plus Blog/Projects/Talks/Sponsors destinations, secondary icon links, and a theme toggle; desktop links are text at opacity .6, while the 390px sample exposes icons. Prose links use a faint bottom rule; compact project links become gray translucent chips. Outlined sponsor and project quick actions rest at opacity .5 and gain contextual color on hover. Archives combine a small language control, 30px section tabs, year markers, and rows whose opacity changes from .6 to 1. Projects use transparent icon/title/description cards in 16px-gapped responsive grids; Sponsors uses text tabs with .5 inactive and .75 selected opacity. Articles add a 300px TOC and flat Shiki panels. Photos use square cover tiles. The measured desktop Blog focus state had no visible outline, so accessibility behavior should not be generalized from this preview.

### Component Token Index

| Component token | Role / context | Evidence |
| --- | --- | --- |
| site-nav | Global logo/destination/theme header; text on desktop and icons on narrow sample. | [NAVDESKTOP](#evidence-navdesktop), [NAVMOBILE](#evidence-navmobile) |
| nav-link | Global navigation link at reduced opacity. | [NAVDESKTOP](#evidence-navdesktop) |
| nav-link-hover | Hover state restores full opacity. | [NAVHOVER](#evidence-navhover) |
| nav-link-focus | Measured keyboard state retained no visible outline. | [NAVFOCUS](#evidence-navfocus) |
| prose-link | Editorial inline link using a subtle bottom rule rather than a filled button. | [HOMELIGHT](#evidence-homelight), [CSS](#evidence-css) |
| prose-link-hover | See the component analysis above | [CSS](#evidence-css) |
| magic-chip | Compact icon-plus-label link chip. | [HOMELIGHT](#evidence-homelight) |
| sponsor-cta | Low-opacity outlined sponsor action. | [HOMELIGHT](#evidence-homelight) |
| sponsor-cta-hover | See the component analysis above | [SPONSORCTA](#evidence-sponsorcta) |
| project-quick-link | Projects header action with contextual hover color. | [PROJECTS](#evidence-projects) |
| project-quick-link-hover | See the component analysis above | [PROJECTQUICK](#evidence-projectquick) |
| post-row | Archive row whose opacity carries the default/hover distinction. | [POSTS](#evidence-posts) |
| post-row-hover | See the component analysis above | [POSTHOVER](#evidence-posthover) |
| project-card | Transparent icon-title-description list item in responsive project grids. | [PROJECTS](#evidence-projects) |
| project-card-hover | See the component analysis above | [PROJECTHOVER](#evidence-projecthover) |
| sponsor-tab | Sponsors local tab; active/inactive opacity differs. | [SPONSORTAB](#evidence-sponsortab) |
| sponsor-tab-active | See the component analysis above | [SPONSORTAB](#evidence-sponsortab) |
| code-block | Light Shiki code panel with DM Mono. | [ARTICLE](#evidence-article) |
| photo-tile | Square cover-cropped photography grid cell. | [PHOTOS](#evidence-photos), [PHOTOSMOB](#evidence-photosmob) |

## Do's and Don'ts

Do preserve the near-monochrome palette, 65ch reading width, 16px/28px body rhythm, alpha-only grays, opacity-based default states, and light/dark token remapping. Do keep the sparse canvas behind content, transparent list/card structures, square photography, and quiet code panels. Use contextual hover color sparingly. Do not add conventional heavy cards, saturated global accents, or shadows where the source uses whitespace and hairlines; do not flatten rgba values, mistake photo placeholder gradients for UI tokens, or redistribute the source WOFF2 fonts in a derivative preview.

## Responsive Behavior

At 390px, the header retains the same destinations but exposes icon controls rather than desktop text labels; main retains 28px side padding and a 334px content column. Large 30px section tabs stack, archive metadata stacks beneath titles, project cards become one per row, and photographs become a single-column square grid. The sampled 1440px layout uses three project columns, four photo columns, a centered prose column, and the article TOC. Exact behavior between the saved 640/768/1024/1280/1536px media-query boundaries was not measured.

## Iteration Guide

1. Build a light technical homepage with Inter 16/28 prose, a 36/40 title, a centered min(65ch,100%) column, a 90px transparent header, opacity-.6 links, and a dark #050505 toggle that maps text to #BBB/#DDD/#FFF.
2. Build an archive with 30/36 section tabs (active opacity 1, inactive .2), 18/21.6 titles, 14/20 metadata at opacity .5/.4, and rows that stack title over metadata at 390px.
3. Build Projects with transparent 350px icon-title-description cards, 6px radius, 16px grid gaps, opacity .6, and a hover state that reaches opacity 1 over rgba(136,136,136,.067); collapse three desktop columns to one at narrow width.

## Known Gaps

Eight public English templates were successfully captured at 1440x900 and 390x844: Home, Posts, Projects, Talks, Sponsors, Podcasts, Photos, and one blog article; this is a representative sample rather than full-site coverage. The discovered Demos route returned 403 and is not represented. The long article, Photos, and mobile Projects samples exceeded the scroll budget; Photos coverage is especially incomplete, so deeper photographs are not claimed reviewed. The bounded resource ledgers defer 732 main-capture items and 144 article-capture items (chiefly images/scripts/chunks), while evidence checks report no failed requests. Embedded Twitter iframes are treated as third-party content, not site UI. Hover, local tab, dark-toggle, and one desktop keyboard-focus path were tested; touch, form, search, language switching, all focus states, and dynamic Canvas behavior remain untested. Bad Script is declared but not observed rendered. This sample does not establish WCAG compliance.

### Scope & Evidence

- https://antfu.me/
- https://antfu.me/posts
- https://antfu.me/projects
- https://antfu.me/talks
- https://antfu.me/sponsors-list
- https://antfu.me/podcasts
- https://antfu.me/photos
- https://antfu.me/posts/pluggable-extensible-playful-devtools

<a id="evidence-homelight"></a>
- **HOMELIGHT — measured**: https://antfu.me/; `html, body, main h1, first prose paragraph, magic-link chip`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Fresh light session: #fff canvas, #000 h1, #555 body, local prose variables, chip styles, and 656.09px prose box.
<a id="evidence-homedark"></a>
- **HOMEDARK — measured**: https://antfu.me/; `html, body, main h1, first prose paragraph after local theme toggle`; 1440x900; dark toggle; [capture](states/dark-toggle/state.json). Real click on title='Toggle Color Scheme'; html class became dark and local storage recorded dark.
<a id="evidence-navdesktop"></a>
- **NAVDESKTOP — measured**: https://antfu.me/; `#app header nav and child links`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). 90px header; grid columns 842.94px/533.06px; text links 16px/24px at opacity .6.
<a id="evidence-navmobile"></a>
- **NAVMOBILE — measured**: https://antfu.me/; `#app header nav and child links`; 390x844; default; [capture](evidence/pages/page-01.mobile.json). 88px header; grid columns 114.94px/211.06px; primary text labels become icon-only controls.
<a id="evidence-navhover"></a>
- **NAVHOVER — measured**: https://antfu.me/; `#app header nav a[title='Blog']`; 1440x900; hover; [capture](states/nav-hover/state.json). Browser hover changes opacity from .6 to 1 over .2s.
<a id="evidence-navfocus"></a>
- **NAVFOCUS — observed**: https://antfu.me/; `nav a[title='Blog']`; 1440x900; keyboard focus-visible; [capture](states/keyboard-nav-focus/state.json). Third real Tab press focused Blog; :focus-visible matched but computed outline was none.
<a id="evidence-canvas"></a>
- **CANVAS — measured**: https://antfu.me/; `main canvas and fixed parent wrapper`; 1440x900; light and local dark toggle; [capture](states/canvas/state.json). 1440x900 pointer-events-none canvas in z-index -1 wrapper; dark wrapper filter invert(1); pixel channel average 1.204 in light sample.
<a id="evidence-hometype"></a>
- **HOMETYPE — measured**: https://antfu.me/; `main h1, body paragraphs, footer`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Inter h1 36px/800/40px, prose 16px/400/28px, footer 14px/20px.
<a id="evidence-homemob"></a>
- **HOMEMOB — measured**: https://antfu.me/; `header, main, h1, article`; 390x844; default; [capture](evidence/pages/page-01.mobile.json). Main uses 28px side padding; h1/prose column is 334px wide.
<a id="evidence-posts"></a>
- **POSTS — measured**: https://antfu.me/posts; `language control, section tabs, and post rows`; 1440x900; default; [capture](evidence/pages/page-02.desktop.json). Active section tab opacity 1 and inactive .2; 656px rows and 30px section tabs.
<a id="evidence-postsmob"></a>
- **POSTSMOB — measured**: https://antfu.me/posts; `language control, section tabs, and post rows`; 390x844; default; [capture](evidence/pages/page-02.mobile.json). 30px/36px section tabs stack; rows occupy the 334px content column.
<a id="evidence-postdetail"></a>
- **POSTDETAIL — measured**: https://antfu.me/posts; `first post link, li, title, date, duration`; 1440x900; default; [capture](states/post-row-detail/state.json). Title 18px/21.6px; date/duration 14px/20px at opacity .5/.4.
<a id="evidence-posthover"></a>
- **POSTHOVER — measured**: https://antfu.me/posts; `first archive row`; 1440x900; hover; [capture](states/post-row-hover/state.json). Opacity .6 to 1; background remains transparent.
<a id="evidence-projects"></a>
- **PROJECTS — measured**: https://antfu.me/projects; `project grid and representative project cards`; 1440x900; default; [capture](evidence/pages/page-03.desktop.json). 3-column 350px-card grid with 16px gaps; cards are transparent, opacity .6, radius 6px.
<a id="evidence-projectsmob"></a>
- **PROJECTSMOB — measured**: https://antfu.me/projects; `project grid and representative project cards`; 390x844; default; [capture](evidence/pages/page-03.mobile.json). Project grid collapses to one 350px column; document scroll coverage is incomplete.
<a id="evidence-projecthover"></a>
- **PROJECTHOVER — measured**: https://antfu.me/projects; `Devframe project card`; 1440x900; hover; [capture](states/project-card-hover/state.json). Opacity .6 to 1 and background to rgba(136,136,136,.067).
<a id="evidence-projectquick"></a>
- **PROJECTQUICK — measured**: https://antfu.me/projects; `a.btn-blue GitHub quick link`; 1440x900; default and hover; [capture](states/project-github-hover/state.json). Hover changes black/.5 to #60a5fa/1 with #60a5fa1a backing.
<a id="evidence-sponsorcta"></a>
- **SPONSORCTA — measured**: https://antfu.me/; `a.btn-rose sponsor link`; 1440x900; default and hover; [capture](states/sponsor-cta-hover/state.json). Hover changes black/.5 to #fb7185/1 with #fb71851a backing.
<a id="evidence-sponsortab"></a>
- **SPONSORTAB — measured**: https://antfu.me/sponsors-list; `Sponsor Circles / Sponsor Tiers buttons`; 1440x900; default and selected local tab; [capture](states/sponsor-tier-tab/state.json). Selected class op75, inactive op50; mouse-hovered selected tab computed opacity 1.
<a id="evidence-article"></a>
- **ARTICLE — measured**: https://antfu.me/posts/pluggable-extensible-playful-devtools; `h1, prose, TOC, headings, Shiki pre/code`; 1440x900; default; [capture](evidence-article/pages/page-01.desktop.json). 656px reading column; h1 36/800; h2 24/700; h3 20/600; code #fafafa with DM Mono 14.4/20.16.
<a id="evidence-articlemob"></a>
- **ARTICLEMOB — measured**: https://antfu.me/posts/pluggable-extensible-playful-devtools; `article and reading column`; 390x844; default; [capture](evidence-article/pages/page-01.mobile.json). Narrow reading sample retained in the separate article evidence set.
<a id="evidence-photos"></a>
- **PHOTOS — measured**: https://antfu.me/photos; `photos grid and first square images`; 1440x900; default; [capture](evidence/pages/page-07.desktop.json). Four 334px square cover images per row with 16px gaps; photos page scroll is incomplete.
<a id="evidence-photosmob"></a>
- **PHOTOSMOB — measured**: https://antfu.me/photos; `photos grid and square images`; 390x844; default; [capture](evidence/pages/page-07.mobile.json). Narrow sample shows single-column square media; scroll coverage is heavily incomplete.
<a id="evidence-css"></a>
- **CSS — measured**: https://antfu.me/assets/app-CcwtqiuP.css; `root variables, prose rules, nav rules, item rules, Shiki rules`; declared; source CSS; [capture](evidence/assets/855d0dc15226c1923877.css). Saved CSS declarations for theme variables, typography, links, cards, code, and motion.
<a id="evidence-cssarticle"></a>
- **CSSARTICLE — measured**: https://antfu.me/assets/app-CcwtqiuP.css; `font-face, Shiki, prose, and article rules`; declared; source CSS; [capture](evidence-article/assets/855d0dc15226c1923877.css). Article capture's saved copy of the same stylesheet.
<a id="evidence-scopegap"></a>
- **SCOPEGAP — observed**: https://antfu.me/demos; `inventory failure and scroll records`; mixed; capture limitations; [capture](evidence/inventory.json). Demos returned 403; long-page scroll limitations are recorded per snapshot.

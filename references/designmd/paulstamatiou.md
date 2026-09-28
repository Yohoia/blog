---
version: alpha
name: Paul Stamatiou public site design analysis
description: "Evidence-based visual analysis of seven English public page types and a fresh light-theme cross-check for Gear and About, captured 2026-09-24."

colors:
  light-canvas: "#F7F2ED"
  light-heading: "oklch(0.374 0.01 67.558)"
  light-body: "rgba(139, 129, 122, 0.9)"
  light-border: "#E7E3DE"
  light-pill: "#EEE8E1"
  dark-canvas: "oklch(0.185 0.1 120)"
  dark-heading: "oklch(0.9 0.015 140)"
  dark-body: "oklch(0.85 0.012 140 / 0.9)"
  dark-muted: "oklch(0.58 0.015 140)"
  photo-surface: "oklab(0.7 -0.0286788 0.0409576 / 0.1)"
  photo-overlay: "linear-gradient(rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.95))"
  white: "#FFFFFF"

typography:
  site-title:
    fontFamily: "PSC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28.8px"
    fontWeight: 550
    lineHeight: "38.88px"
    letterSpacing: "-0.432px"
  site-intro:
    fontFamily: "PSC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18.4px"
    fontWeight: 500
    lineHeight: "27.6px"
    letterSpacing: normal
  section-label:
    fontFamily: "PSA, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "30px"
    letterSpacing: "-0.4px"
  post-row-title:
    fontFamily: "PSC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "21.6px"
    fontWeight: 600
    lineHeight: "24px"
    letterSpacing: normal
  article-title:
    fontFamily: "PSC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28.8px"
    fontWeight: 550
    lineHeight: "38.88px"
    letterSpacing: "-0.432px"
  article-body:
    fontFamily: "PSC, ui-sans-serif, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: "29.45px"
    letterSpacing: normal
  gear-caption:
    fontFamily: "PSA, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.2px"
    fontWeight: 500
    lineHeight: "18.24px"
    letterSpacing: normal
  photo-hero-desktop:
    fontFamily: "PS1, ui-serif, Georgia, Cambria, serif"
    fontSize: "104px"
    fontWeight: 700
    lineHeight: "109.2px"
    letterSpacing: normal
  photo-hero-mobile:
    fontFamily: "PS1, ui-serif, Georgia, Cambria, serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "50.4px"
    letterSpacing: normal
  about-title:
    fontFamily: "PSAP, ui-sans-serif, system-ui, sans-serif"
    fontSize: "31.2px"
    fontWeight: 550
    lineHeight: "42.12px"
    letterSpacing: "-0.468px"
  subscribe-label:
    fontFamily: "SS3V, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17.6px"
    fontWeight: 450
    lineHeight: "26.4px"
    letterSpacing: normal

rounded:
  home-panel: "48px"
  post-row: "16px"
  gear-tile: "18px"
  photo-tile: "24px"
  photo-hero: "40px"
  subscribe: "13px"

spacing:
  home-panel-inset: "32px 0px 0px 40px"
  post-row-inset: "14px 32px"
  gear-tile-inset: "8px"
  subscribe-inset: "10px 16px"
  article-leading: "29.45px"

components:
  site-nav:
    backgroundColor: transparent
  home-panel:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    border: "3px solid {colors.light-border}"
    rounded: "{rounded.home-panel}"
    padding: "{spacing.home-panel-inset}"
  post-row:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    typography: "{typography.post-row-title}"
    rounded: "{rounded.post-row}"
    padding: "{spacing.post-row-inset}"
  gear-tile:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    rounded: "{rounded.gear-tile}"
    padding: "{spacing.gear-tile-inset}"
  subscribe-input:
    backgroundColor: "oklab(0.709 0.0055544 0.00831557 / 0.05)"
    textColor: "oklch(0.709 0.01 56.259)"
    border: "1px solid oklab(0.869 0.00276943 0.00416296 / 0.75)"
    typography: "{typography.subscribe-label}"
    rounded: "{rounded.subscribe}"
    padding: "{spacing.subscribe-inset}"
  more-pill:
    backgroundColor: "{colors.light-pill}"
    textColor: "{colors.light-heading}"
    padding: "6px 8px 6px 12px"
    rounded: "9999px"
  photo-gallery:
    backgroundColor: "{colors.dark-canvas}"
    textColor: "{colors.dark-body}"
    padding: "24px"
  photo-hero:
    backgroundColor: "{colors.photo-surface}"
    textColor: "{colors.white}"
    rounded: "{rounded.photo-hero}"
    padding: "0px"
  photo-tile:
    backgroundColor: "{colors.photo-surface}"
    textColor: "{colors.white}"
    rounded: "{rounded.photo-tile}"
    padding: "0px"
  article-prose:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    typography: "{typography.article-body}"
    padding: "0px"
  photoset-tab:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    typography: "{typography.section-label}"
    padding: "0px"
  about-portrait:
    backgroundColor: transparent
    textColor: "{colors.light-heading}"
    padding: "0px"
---

> Source: https://paulstamatiou.com/ · Captured: 2026-09-24T00:54:11.673Z · Locale: en
> Public-page design analysis. Claims, scope, and confidence are evidence-bound.

## Overview

The sampled site combines a quiet editorial portfolio with a photography mode. In fresh sessions, Home, Posts, the long-form article, Gear, and About use a warm paper canvas, muted brown-gray type, a slim icon rail, and narrow centered reading columns. The Photos landing and Africa collection switch to a deep olive canvas where large photographs supply most of the color. A manual theme control can move non-photo pages into the dark palette; theme state therefore matters as much as route. This is an evidence-bound public-site analysis, not an official token export.

## Colors

The light canvas is measured as rgb(247,242,237), with warm heading `oklch(0.374 0.01 67.558)`, muted body copy, and a subtle #E7E3DE outline around large cards. Small warm pills use #EEE8E1. The photo surface uses `oklch(0.185 0.1 120)` and light olive-white text. A transparent-to-nearly-black image gradient keeps white photo captions legible. The source CSS also references a fine grain image; photography, not a bright UI accent, provides saturated color. Preserve OKLCH and alpha values rather than forcing hex approximations.

| Token | CSS value | Role / context | Evidence |
| --- | --- | --- | --- |
| light-canvas | `#F7F2ED` | Default warm paper-like canvas on fresh Home, Gear, About, and Posts sessions. | [HOMEBASE](#evidence-homebase), [GEARLIGHT](#evidence-gearlight), [ABOUTLIGHT](#evidence-aboutlight) |
| light-heading | `oklch(0.374 0.01 67.558)` | See source context | [HOMEH1](#evidence-homeh1) |
| light-body | `rgba(139, 129, 122, 0.9)` | See source context | [HOMEINTRO](#evidence-homeintro) |
| light-border | `#E7E3DE` | See source context | [HOMEPANEL](#evidence-homepanel) |
| light-pill | `#EEE8E1` | See source context | [HOMEMORE](#evidence-homemore) |
| dark-canvas | `oklch(0.185 0.1 120)` | Dark olive canvas on Photos and after explicit theme toggle; not intrinsically the Gear/About route. | [PHOTODARK](#evidence-photodark), [THEME](#evidence-theme) |
| dark-heading | `oklch(0.9 0.015 140)` | See source context | [GEARDARKH1](#evidence-geardarkh1) |
| dark-body | `oklch(0.85 0.012 140 / 0.9)` | See source context | [GEARDARKP](#evidence-geardarkp) |
| dark-muted | `oklch(0.58 0.015 140)` | See source context | [GEARDARKSUB](#evidence-geardarksub) |
| photo-surface | `oklab(0.7 -0.0286788 0.0409576 / 0.1)` | See source context | [PHOTOHERO](#evidence-photohero) |
| photo-overlay | `linear-gradient(rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.95))` | Gradient darkening of photographic tiles for readable white labels. | [PHOTOGRAD](#evidence-photograd) |
| white | `#FFFFFF` | See source context | [PHOTOH1](#evidence-photoh1) |

## Typography

The site serves local font files under aliases PSC, PSA, SS3V, PS1, and PSAP. Computed CSS uses PSC for editorial titles and prose, PSA for navigation/card labels, SS3V for the subscribe field, PS1 for the large collection title, and PSAP for About. Chrome identifies PSA as an Averta face and PS1 as a PP Fragment Glare face, but the CDP label for PSC is opaque; this analysis retains CSS aliases instead of guessing a commercial font name. Home title is 28.8px/550/38.88px and intro copy 18.4px/500/27.6px. The long article body is 19px/400/29.45px. Africa’s photo title jumps from 104px desktop to 48px at 390px. Fonts are not redistributed with the preview, so local fallback differs.

| Token | Font family | Size | Weight | Line height | Tracking | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| site-title | PSC, ui-sans-serif, system-ui, sans-serif | 28.8px | 550 | 38.88px | -0.432px | [HOMEH1](#evidence-homeh1) |
| site-intro | PSC, ui-sans-serif, system-ui, sans-serif | 18.4px | 500 | 27.6px | normal | [HOMEINTRO](#evidence-homeintro) |
| section-label | PSA, ui-sans-serif, system-ui, sans-serif | 20px | 600 | 30px | -0.4px | [HOMEPANEL](#evidence-homepanel), [HOMETABS](#evidence-hometabs) |
| post-row-title | PSC, ui-sans-serif, system-ui, sans-serif | 21.6px | 600 | 24px | normal | [HOMEROW](#evidence-homerow) |
| article-title | PSC, ui-sans-serif, system-ui, sans-serif | 28.8px | 550 | 38.88px | -0.432px | [ARTICLEH1](#evidence-articleh1) |
| article-body | PSC, ui-sans-serif, system-ui, sans-serif | 19px | 400 | 29.45px | normal | [ARTICLEBODY](#evidence-articlebody) |
| gear-caption | PSA, ui-sans-serif, system-ui, sans-serif | 15.2px | 500 | 18.24px | normal | [GEARTHUMB](#evidence-gearthumb) |
| photo-hero-desktop | PS1, ui-serif, Georgia, Cambria, serif | 104px | 700 | 109.2px | normal | [PHOTOH1](#evidence-photoh1) |
| photo-hero-mobile | PS1, ui-serif, Georgia, Cambria, serif | 48px | 700 | 50.4px | normal | [PHOTOH1MOB](#evidence-photoh1mob) |
| about-title | PSAP, ui-sans-serif, system-ui, sans-serif | 31.2px | 550 | 42.12px | -0.468px | [ABOUTTITLE](#evidence-abouttitle) |
| subscribe-label | SS3V, ui-sans-serif, system-ui, sans-serif | 17.6px | 450 | 26.4px | normal | [HOMESUB](#evidence-homesub) |

## Layout

At 1440px, the Home and Gear main content column measures 576px wide, centered around x=432px. Home panel shells extend to 664px width with a 3px border, 48px radius, and 40px left inset; the article header/reading region is about 704px. The Africa hero is a 1000px-wide image panel. Desktop navigation is a fixed left icon rail; at 390px it becomes a horizontal control row above the 342px content column (24px side margins). Home panel borders vanish visually in the mobile sample while the content groups remain. Gear and photo tiles form horizontally clipped/scrollable rows.

### Spacing Tokens

| Token | Value | Evidence |
| --- | --- | --- |
| home-panel-inset | 32px 0px 0px 40px | [HOMEPANEL](#evidence-homepanel) |
| post-row-inset | 14px 32px | [HOMEROW](#evidence-homerow) |
| gear-tile-inset | 8px | [GEARTHUMB](#evidence-gearthumb) |
| subscribe-inset | 10px 16px | [HOMESUB](#evidence-homesub) |
| article-leading | 29.45px | [ARTICLEBODY](#evidence-articlebody) |

## Elevation & Depth

The design relies on editorial whitespace, a subtle grain texture, 3px outlines on light content shells, image crops, and dark gradients over photography. Sampled homepage panels have no drop shadow. The dark photo collection uses low-opacity translucent backing around the hero, while picture edges and large type establish hierarchy. Embedded article/social content may carry its own chrome and should not be mistaken for the site-wide elevation system.

## Shapes

Large light content shells use 48px rounded corners on desktop. Individual gear tiles use 18px, post links 16px, and the subscribe field 13px. The Africa hero has a 40px outer radius, while smaller photo cards use 24px. The tiny More control is fully pill-shaped. These values reflect different content roles rather than one global radius ramp.

| Token | Value | Evidence |
| --- | --- | --- |
| home-panel | 48px | [HOMEPANEL](#evidence-homepanel), [HOMEPOSTPANEL](#evidence-homepostpanel) |
| post-row | 16px | [HOMEROW](#evidence-homerow) |
| gear-tile | 18px | [GEARTHUMB](#evidence-gearthumb) |
| photo-tile | 24px | [PHOTOCARD](#evidence-photocard) |
| photo-hero | 40px | [PHOTOHERO](#evidence-photohero) |
| subscribe | 13px | [HOMESUB](#evidence-homesub) |

## Components

The core shell is a four-destination icon navigation plus a theme toggle; desktop and mobile place the same controls differently. Home composes an intro, a small More pill, an email subscribe field, a gear carousel, a bordered post list, and a Photosets/Photostream selector. The post archive is a chronological year list with search. Long-form articles use a narrow serif reading column with supporting metadata and occasional embeds. Gear pages group image-and-caption tiles by category. Photos pages use image-first collection tiles, a full-bleed collection hero, metadata, and smaller destination cards. About adds a locally tinted portrait and prose/timeline. The local theme and photo-tab controls were exercised; no subscribe form was submitted.

### Component Token Index

| Component token | Role / context | Evidence |
| --- | --- | --- |
| site-nav | See the component analysis above | [HOMENAV](#evidence-homenav), [HOMEMOB](#evidence-homemob) |
| home-panel | Large bordered homepage/gear content shell; border visually drops at 390px. | [HOMEPANEL](#evidence-homepanel), [HOMEPANELMOB](#evidence-homepanelmob) |
| post-row | See the component analysis above | [HOMEROW](#evidence-homerow) |
| gear-tile | Small image-plus-caption tile in horizontally scrollable gear rows. | [GEARTHUMB](#evidence-gearthumb), [GEARMOB](#evidence-gearmob) |
| subscribe-input | See the component analysis above | [HOMESUB](#evidence-homesub) |
| more-pill | See the component analysis above | [HOMEMORE](#evidence-homemore) |
| photo-gallery | See the component analysis above | [PHOTODARK](#evidence-photodark), [PHOTOGRID](#evidence-photogrid) |
| photo-hero | Large Africa collection photograph and overlaid display title. | [PHOTOHERO](#evidence-photohero), [PHOTOH1](#evidence-photoh1) |
| photo-tile | See the component analysis above | [PHOTOCARD](#evidence-photocard), [PHOTOGRAD](#evidence-photograd) |
| article-prose | See the component analysis above | [ARTICLEBODY](#evidence-articlebody) |
| photoset-tab | Homepage local Photosets/Photostream selection, tested without navigation. | [HOMETABS](#evidence-hometabs), [PHOTOSELECT](#evidence-photoselect) |
| about-portrait | Tinted About portrait with local palette controls; preview is structural only. | [ABOUTPHOTO](#evidence-aboutphoto) |

## Do's and Don'ts

Do retain the warm paper texture, restrained neutral UI color, serif editorial rhythm, narrow reading width, and clear separation between light editorial and dark photographic contexts. Do use oversized photo media to bring in color and overlaid labels with a darkening gradient. Do not turn the Gear/About dark sequential state into a route-specific default, flatten the photo mode to pure black, add heavy shadows to light panels, or infer a global design token from colors inside photographs. Do not reproduce proprietary font files in a distributable preview without permission.

## Responsive Behavior

At the sampled 390px width, the fixed desktop rail becomes a compact horizontal navigation bar, the main column uses roughly 24px side margins, and the outlined Home panel shells lose visible borders. Gear and photo rows retain horizontal scrolling rather than becoming dense tiny grids. The Home title remains 28.8px in both sampled widths, while the Africa collection title falls from 104px to 48px. These observations establish behavior only at 390px and 1440px; exact breakpoints were not verified.

## Iteration Guide

1. Build a warm editorial homepage with a 576px reading column at 1440px, 48px bordered content panels, a compact icon rail, and a 390px stacked layout with 24px side margins.
2. Build a photo collection on the measured olive canvas with a large rounded hero image, white overlaid display title, translucent metadata panel, and dark gradient caption treatment.
3. Build a Gear category as a horizontally scrollable row of 18px-rounded image/caption tiles, retaining the site’s muted typography and light-theme default.

## Known Gaps

Seven public English page types were captured at 1440×900 and 390×844; Gear and About received separate fresh light-theme samples after the sequential capture inherited the photo section’s dark state. The Posts archive and 2025 article exceed the scroll budget, and desktop Photos also has incomplete scroll coverage; the recorded screenshots for very long pages are viewport-limited, so deep content is not claimed as fully reviewed. A handful of browser runtime requests failed and many image/script references were deferred by the resource budget; key layouts rendered and evidence checks passed. Some CDP font family names are opaque. Only theme and photo-tab state changes were confirmed; other hover/focus, search, image render-setting, and email form states remain untested.

### Scope & Evidence

- https://paulstamatiou.com/
- https://paulstamatiou.com/posts
- https://paulstamatiou.com/2025-year-in-review
- https://paulstamatiou.com/photos
- https://paulstamatiou.com/photos/africa
- https://paulstamatiou.com/gear
- https://paulstamatiou.com/about

<a id="evidence-homebase"></a>
- **HOMEBASE — measured**: https://paulstamatiou.com/; `html, body`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Computed warm canvas rgb(247,242,237); grain2.png is also referenced.
<a id="evidence-homeh1"></a>
- **HOMEH1 — measured**: https://paulstamatiou.com/; `main h1`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). PSC 28.8px/550/38.88px with -0.432px tracking and warm heading color.
<a id="evidence-homeintro"></a>
- **HOMEINTRO — measured**: https://paulstamatiou.com/; `main introductory paragraphs`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). PSC 18.4px/500/27.6px; muted warm gray.
<a id="evidence-homepanel"></a>
- **HOMEPANEL — measured**: https://paulstamatiou.com/; `Recent gear panel`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). 664px outer width, 3px #E7E3DE border, 48px radius, 40px left inset.
<a id="evidence-homepostpanel"></a>
- **HOMEPOSTPANEL — measured**: https://paulstamatiou.com/; `Posts panel`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Same 3px/48px shell around post rows.
<a id="evidence-homerow"></a>
- **HOMEROW — measured**: https://paulstamatiou.com/; `first home post row`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). 16px radius and 14px 32px padding.
<a id="evidence-homesub"></a>
- **HOMESUB — measured**: https://paulstamatiou.com/; `#subscribe`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). 48.39px high, 13px radius, subdued alpha fill and border.
<a id="evidence-homenav"></a>
- **HOMENAV — observed**: https://paulstamatiou.com/; `header icon navigation`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Fixed left icon rail in desktop screenshot.
<a id="evidence-homemob"></a>
- **HOMEMOB — observed**: https://paulstamatiou.com/; `header icon navigation`; 390x844; default; [capture](evidence/pages/page-01.mobile.json). Icon navigation moves to a compact top row; content uses 24px side margin.
<a id="evidence-homepanelmob"></a>
- **HOMEPANELMOB — measured**: https://paulstamatiou.com/; `Recent gear panel`; 390x844; default; [capture](evidence/pages/page-01.mobile.json). Panel outer border disappears at 390px although computed radius remains 48px.
<a id="evidence-homemore"></a>
- **HOMEMORE — measured**: https://paulstamatiou.com/; `More button`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Small warm pill, 27px high.
<a id="evidence-hometabs"></a>
- **HOMETABS — measured**: https://paulstamatiou.com/; `Photosets and Photostream buttons`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). 20px PSA labels; inactive Photostream has substantially reduced opacity.
<a id="evidence-theme"></a>
- **THEME — observed**: https://paulstamatiou.com/; `Toggle light or dark theme button`; 1440x900; clicked; [capture](states/local-controls.json). Local click changes body canvas from rgb(247,242,237) to oklch(0.185 0.1 120).
<a id="evidence-photoselect"></a>
- **PHOTOSELECT — observed**: https://paulstamatiou.com/; `Photostream button`; 1440x900; selected; [capture](states/local-controls.json). Local tab click changes visible photo items.
<a id="evidence-gearthumb"></a>
- **GEARTHUMB — measured**: https://paulstamatiou.com/gear; `Camera / Leica M EV1 gear tile`; 1440x900; default; [capture](evidence-light/pages/page-01.desktop.json). Fresh light-theme sample: 18px radius, 8px inset, 180px tile width.
<a id="evidence-gearlight"></a>
- **GEARLIGHT — measured**: https://paulstamatiou.com/gear; `html, body`; 1440x900; default; [capture](evidence-light/pages/page-01.desktop.json). Fresh session Gear defaults to #F7F2ED, despite darker sequential sample.
<a id="evidence-gearmob"></a>
- **GEARMOB — observed**: https://paulstamatiou.com/gear; `gear thumbnail rows`; 390x844; default; [capture](evidence-light/pages/page-01.mobile.json). Photo tiles become a horizontally clipped carousel in narrow layout.
<a id="evidence-aboutlight"></a>
- **ABOUTLIGHT — measured**: https://paulstamatiou.com/about; `html, body`; 1440x900; default; [capture](evidence-light/pages/page-02.desktop.json). Fresh session About defaults to #F7F2ED.
<a id="evidence-abouttitle"></a>
- **ABOUTTITLE — measured**: https://paulstamatiou.com/about; `About page h1`; 1440x900; default; [capture](evidence-light/pages/page-02.desktop.json). PSAP 31.2px/550/42.12px.
<a id="evidence-aboutphoto"></a>
- **ABOUTPHOTO — observed**: https://paulstamatiou.com/about; `About portrait with render palette controls`; 1440x900; default; [capture](evidence-light/pages/page-02.desktop.json). Large square tinted portrait with local render settings. Specific filters were not interacted with.
<a id="evidence-postslist"></a>
- **POSTSLIST — observed**: https://paulstamatiou.com/posts; `Posts archive year groups`; 1440x900; default; [capture](evidence/pages/page-02.desktop.json). Long chronological archive with search control; first viewport and finite scroll sampled.
<a id="evidence-articleh1"></a>
- **ARTICLEH1 — measured**: https://paulstamatiou.com/2025-year-in-review; `article header h1`; 1440x900; default; [capture](evidence/pages/page-03.desktop.json). PSC 28.8px/550/38.88px.
<a id="evidence-articlebody"></a>
- **ARTICLEBODY — measured**: https://paulstamatiou.com/2025-year-in-review; `article body`; 1440x900; default; [capture](evidence/pages/page-03.desktop.json). PSC 19px/400/29.45px in 704px article header/content region.
<a id="evidence-articlemob"></a>
- **ARTICLEMOB — observed**: https://paulstamatiou.com/2025-year-in-review; `article body`; 390x844; default; [capture](evidence/pages/page-03.mobile.json). Long article reflows to narrow reading column; full body was not scroll-covered.
<a id="evidence-photodark"></a>
- **PHOTODARK — measured**: https://paulstamatiou.com/photos; `html, body`; 1440x900; default; [capture](evidence/pages/page-04.desktop.json). Photo section switches body canvas to oklch(0.185 0.1 120).
<a id="evidence-photogrid"></a>
- **PHOTOGRID — observed**: https://paulstamatiou.com/photos; `#photo-grid`; 1440x900; default; [capture](evidence/pages/page-04.desktop.json). Photo-rich tiles and carousels on dark canvas; desktop scroll was partial.
<a id="evidence-photohero"></a>
- **PHOTOHERO — measured**: https://paulstamatiou.com/photos/africa; `Africa collection hero`; 1440x900; default; [capture](evidence/pages/page-05.desktop.json). 1000px-wide outer panel, 40px radius, image-led presentation.
<a id="evidence-photoh1"></a>
- **PHOTOH1 — measured**: https://paulstamatiou.com/photos/africa; `Africa h1`; 1440x900; default; [capture](evidence/pages/page-05.desktop.json). PS1 104px/700/109.2px over photo on desktop.
<a id="evidence-photoh1mob"></a>
- **PHOTOH1MOB — measured**: https://paulstamatiou.com/photos/africa; `Africa h1`; 390x844; default; [capture](evidence/pages/page-05.mobile.json). PS1 48px/700/50.4px over photo.
<a id="evidence-photocard"></a>
- **PHOTOCARD — measured**: https://paulstamatiou.com/photos/africa; `Rwanda and safari photo tiles`; 1440x900; default; [capture](evidence/pages/page-05.desktop.json). 24px radius on smaller collection cards.
<a id="evidence-photograd"></a>
- **PHOTOGRAD — measured**: https://paulstamatiou.com/photos; `photo-tile overlay gradient`; 1440x900; default; [capture](evidence/pages/page-04.desktop.json). CSS linear-gradient fades transparent to 95%-black for white labels.
<a id="evidence-fontface"></a>
- **FONTFACE — measured**: https://paulstamatiou.com/; `@font-face in globals CSS`; 1440x900; default; [capture](evidence/pages/page-01.desktop.json). Local CSS aliases include PSC, PSA, SS3V, PS1, and PSAP. CDP name for PSC is opaque; do not infer a vendor family.
<a id="evidence-geardarkh1"></a>
- **GEARDARKH1 — measured**: https://paulstamatiou.com/gear; `Gear h1`; 1440x900; default; [capture](evidence/pages/page-06.desktop.json). Sequential dark-theme Gear h1 uses oklch(0.9 0.015 140).
<a id="evidence-geardarkp"></a>
- **GEARDARKP — measured**: https://paulstamatiou.com/gear; `Gear lead paragraph`; 1440x900; default; [capture](evidence/pages/page-06.desktop.json). Sequential dark-theme body uses oklch(0.85 0.012 140 / 0.9).
<a id="evidence-geardarksub"></a>
- **GEARDARKSUB — measured**: https://paulstamatiou.com/gear; `Gear subtitle h2`; 1440x900; default; [capture](evidence/pages/page-06.desktop.json). Sequential dark-theme subtitle uses oklch(0.58 0.015 140).

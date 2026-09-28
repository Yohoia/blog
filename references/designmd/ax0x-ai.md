---
version: alpha
name: AX blog public site design analysis
description: "Evidence-based visual analysis of eight English-entry public page types at desktop and narrow widths, including light-theme, sticky-navigation, hover, article, and dashboard cross-checks."

colors:
  dark-canvas: "#18181B"
  light-canvas: "#FFFFFF"
  dark-heading: "#FFFFFF"
  dark-heading-soft: "#F3F4F6"
  dark-nav: "#F9FAFB"
  dark-body: "#D1D5DB"
  dark-muted: "#9CA3AF"
  dark-label: "#6B7280"
  dark-toc: "#A3A3A3"
  light-heading: "#000000"
  light-heading-soft: "#1F2937"
  light-body: "#374151"
  light-muted: "#6B7280"
  dark-border-strong: "#E5E7EB"
  dark-border: "#4B5563"
  dark-border-deep: "#374151"
  light-border: "#E5E7EB"
  light-border-muted: "#D1D5DB"
  active-inverse-surface: "#F3F4F6"
  active-inverse-ink: "#111827"
  active-dark-surface: "#1F2937"
  active-dark-ink: "#E5E7EB"
  focus-border: "#6B7280"
  link-blue: "#60A5FA"
  translation-rose: "rgba(251, 113, 133, 0.8)"
  translation-rose-border: "rgba(190, 18, 60, 0.5)"
  inline-code-surface: "#1F2937"
  inline-code-ink: "#E5E7EB"
  table-dark-border: "#374151"
  table-hover: "rgba(31, 41, 55, 0.5)"
  sticky-border: "rgba(75, 85, 99, 0.5)"
  light-chart-surface: "#FFFFFF"
  dark-chart-surface: "#18181B"

typography:
  body-article:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: normal
  small-body:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: normal
  micro:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: normal
  eyebrow:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "1.2px"
  nav-desktop:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: normal
  nav-mobile:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "19.5px"
    letterSpacing: normal
  page-title:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: normal
  article-h2:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: normal
  card-title:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "28px"
    letterSpacing: normal
  section-title:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: normal
  panel-title:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: normal
  table:
    fontFamily: "\"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", \"Helvetica Neue\", Helvetica, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", \"Source Han Sans CN\", \"Microsoft YaHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: normal
  mono:
    fontFamily: "SFMono-Regular, Consolas, \"Liberation Mono\", Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: normal

rounded:
  pill: "9999px"
  panel: "12px"
  icon: "4px"
  data-point: "2px"
  editorial-card: "0px"
  table: "0px"

spacing:
  main-width: "672px"
  content-gutter: "16px"
  content-width: "640px"
  mobile-content-width: "358px"
  nav-max-width: "768px"
  nav-padding: "32px 16px"
  nav-height: "65px"
  panel-inset: "12px 16px"
  panel-gap: "12px 16px"
  pill-inset: "6px 12px"
  small-pill-inset: "4px 12px"
  micro-pill-inset: "2px 8px"
  series-grid-gap: "6px 32px"
  card-rhythm: "0px 0px 32px"
  table-cell: "8px"
  article-toc-width: "384px"

components:
  site-nav:
    backgroundColor: transparent
    textColor: "{colors.dark-nav}"
    typography: "{typography.nav-desktop}"
    padding: "{spacing.nav-padding}"
    maxWidth: "{spacing.nav-max-width}"
    display: flex
  site-nav-scrolled:
    backgroundColor: transparent
    textColor: "{colors.dark-nav}"
    typography: "{typography.nav-desktop}"
    padding: "{spacing.nav-padding}"
    width: "100%"
    display: flex
    border: "1px solid {colors.sticky-border}"
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.dark-nav}"
    typography: "{typography.nav-desktop}"
  prompt-panel:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.small-body}"
    padding: "{spacing.panel-inset}"
    gap: "{spacing.panel-gap}"
    display: flex
    border: "1px solid {colors.dark-border-deep}"
    rounded: "{rounded.panel}"
  prompt-pill:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.small-body}"
    padding: "{spacing.pill-inset}"
    gap: "6px"
    display: inline-flex
    border: "1px solid {colors.dark-border-deep}"
    rounded: "{rounded.pill}"
  prompt-pill-hover:
    backgroundColor: transparent
    textColor: "{colors.dark-heading}"
    typography: "{typography.small-body}"
    padding: "{spacing.pill-inset}"
    gap: "6px"
    display: inline-flex
    border: "1px solid {colors.focus-border}"
    rounded: "{rounded.pill}"
  eyebrow:
    backgroundColor: transparent
    textColor: "{colors.dark-label}"
    typography: "{typography.eyebrow}"
    textTransform: uppercase
  archive-card:
    backgroundColor: transparent
    textColor: "{colors.dark-heading-soft}"
    typography: "{typography.card-title}"
    margin: "{spacing.card-rhythm}"
    rounded: "{rounded.editorial-card}"
  archive-summary:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.body-article}"
    rounded: "{rounded.editorial-card}"
  tag-chip:
    backgroundColor: transparent
    textColor: "{colors.dark-muted}"
    typography: "{typography.small-body}"
    padding: "{spacing.small-pill-inset}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.pill}"
  tag-chip-hover:
    backgroundColor: transparent
    textColor: "{colors.dark-heading-soft}"
    typography: "{typography.small-body}"
    padding: "{spacing.small-pill-inset}"
    border: "1px solid {colors.dark-muted}"
    rounded: "{rounded.pill}"
  translation-chip:
    backgroundColor: transparent
    textColor: "{colors.translation-rose}"
    typography: "{typography.micro}"
    padding: "{spacing.micro-pill-inset}"
    border: "1px solid {colors.translation-rose-border}"
    rounded: "{rounded.pill}"
  time-filter-active:
    backgroundColor: "{colors.active-inverse-surface}"
    textColor: "{colors.active-inverse-ink}"
    typography: "{typography.micro}"
    padding: "4px 10px"
    border: "1px solid {colors.active-inverse-surface}"
    rounded: "{rounded.pill}"
  time-filter:
    backgroundColor: transparent
    textColor: "{colors.dark-muted}"
    typography: "{typography.micro}"
    padding: "4px 10px"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.pill}"
  time-filter-hover:
    backgroundColor: transparent
    textColor: "{colors.dark-heading-soft}"
    typography: "{typography.micro}"
    padding: "4px 10px"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.pill}"
  media-filter-active:
    backgroundColor: "{colors.active-dark-surface}"
    textColor: "{colors.active-dark-ink}"
    typography: "{typography.small-body}"
    padding: "{spacing.small-pill-inset}"
    border: "1px solid {colors.dark-border-strong}"
    rounded: "{rounded.pill}"
  media-filter:
    backgroundColor: transparent
    textColor: "{colors.dark-muted}"
    typography: "{typography.small-body}"
    padding: "{spacing.small-pill-inset}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.pill}"
  media-filter-hover:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.small-body}"
    padding: "{spacing.small-pill-inset}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.pill}"
  data-panel:
    backgroundColor: transparent
    textColor: "{colors.dark-heading-soft}"
    padding: "16px"
    border: "1px solid {colors.dark-border-deep}"
    rounded: "{rounded.panel}"
  search-input:
    backgroundColor: "{colors.dark-canvas}"
    textColor: "{colors.dark-heading}"
    typography: "{typography.nav-desktop}"
    padding: "8px 16px"
    width: "100%"
    height: "42px"
    border: "1px solid {colors.dark-border-strong}"
    maxWidth: "640px"
  subscribe-input:
    backgroundColor: transparent
    textColor: "{colors.active-dark-ink}"
    typography: "{typography.small-body}"
    padding: "10px 144px 10px 20px"
    width: "100%"
    height: "42px"
    border: "1px solid {colors.dark-border-deep}"
    rounded: "{rounded.pill}"
    maxWidth: "640px"
  subscribe-input-focus:
    backgroundColor: transparent
    textColor: "{colors.active-dark-ink}"
    typography: "{typography.small-body}"
    padding: "10px 144px 10px 20px"
    width: "100%"
    height: "42px"
    border: "1px solid {colors.focus-border}"
    rounded: "{rounded.pill}"
    maxWidth: "640px"
  article-body:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.body-article}"
    width: "100%"
    maxWidth: "640px"
  article-toc:
    backgroundColor: transparent
    textColor: "{colors.dark-toc}"
    typography: "{typography.small-body}"
    width: "384px"
    padding: "12px 0px 0px 16px"
  data-table:
    backgroundColor: transparent
    textColor: "{colors.dark-body}"
    typography: "{typography.table}"
    width: "100%"
    maxWidth: "640px"
  inline-code:
    backgroundColor: "{colors.inline-code-surface}"
    textColor: "{colors.inline-code-ink}"
    typography: "{typography.mono}"
    padding: "2px 6px"
    rounded: "{rounded.icon}"
---

> Source: https://blog.ax0x.ai/ · Captured: 2026-09-28 · Locale: en-US
> Public-page design analysis. Claims, scope, and confidence are evidence-bound.

## Overview

The sampled site is a dense, dark, text-first technical blog. A near-black #18181B canvas, gray IBM Plex Sans hierarchy, 672px main column, and hairline-bordered modules make many lists and dashboards feel like one continuous terminal-like surface. The global navigation is a blurred sticky bar that starts centered and expands to full width after scroll. Articles add a desktop table of contents; Token Usage adds compact stat grids and categorical charts; Media and Search remain mostly text and pills rather than image cards. A real light-mode toggle remaps the same structure to white and darker gray text. This is an evidence-bound public-page analysis, not an official design-system export.

## Colors

Dark mode dominates the sample: #18181B canvas, #FFFFFF H1, #F3F4F6 card titles, #D1D5DB body prose, #9CA3AF secondary text/tags, and #6B7280 uppercase labels. Hairlines are mostly #374151 for panels, #4B5563 for chips, and #E5E7EB for active or search borders. The observed light toggle changes the canvas to #FFFFFF and maps key text toward #000/#1F2937/#6B7280. Functional color is sparing: article links use #60A5FA and Chinese translation chips use rgba(251,113,133,.8) with a deep rose border. Active filters invert locally—#F3F4F6/#111827 for time filters, #1F2937/#E5E7EB for Media’s All filter. Token charts contain many categorical colors, but this analysis does not promote those data-driven values to brand tokens.

| Token | CSS value | Role / context | Evidence |
| --- | --- | --- | --- |
| dark-canvas | `#18181B` | Default night canvas and dark chart surface. | [HOMEDARK](#evidence-homedark), [CSS](#evidence-css), [SHOTS](#evidence-shots) |
| light-canvas | `#FFFFFF` | Observed light-mode canvas and declared chart surface. | [THEMELIGHT](#evidence-themelight), [CSS](#evidence-css) |
| dark-heading | `#FFFFFF` | Strongest dark-mode H1/TOC link color. | [ARTICLE](#evidence-article) |
| dark-heading-soft | `#F3F4F6` | Card and dashboard titles. | [ARCHIVE](#evidence-archive), [TOKENS](#evidence-tokens) |
| dark-nav | `#F9FAFB` | Desktop navigation destination text. | [HOMEDARK](#evidence-homedark) |
| dark-body | `#D1D5DB` | Primary dark-mode prose and summaries. | [HOMEDARK](#evidence-homedark), [ARTICLE](#evidence-article) |
| dark-muted | `#9CA3AF` | Secondary text, tags, and inactive controls. | [HOMEDARK](#evidence-homedark), [SEARCH](#evidence-search) |
| dark-label | `#6B7280` | Uppercase section labels and icon controls. | [HOMEDARK](#evidence-homedark) |
| dark-toc | `#A3A3A3` | Article TOC body links. | [ARTICLECONTENT](#evidence-articlecontent) |
| light-heading | `#000000` | Light-mode primary text. | [THEMELIGHT](#evidence-themelight) |
| light-heading-soft | `#1F2937` | Observed light-mode latest/list link color. | [THEMELIGHT](#evidence-themelight) |
| light-body | `#374151` | General light-mode body role from theme mapping. | [THEMELIGHT](#evidence-themelight) |
| light-muted | `#6B7280` | Light-mode labels and secondary text. | [THEMELIGHT](#evidence-themelight) |
| dark-border-strong | `#E5E7EB` | Active dark control and search-input border. | [TOKENS](#evidence-tokens), [MEDIA](#evidence-media) |
| dark-border | `#4B5563` | Standard chip/filter hairline. | [TAGHOVER](#evidence-taghover) |
| dark-border-deep | `#374151` | Prompt/panel/input hairline. | [HOMECOMP](#evidence-homecomp) |
| light-border | `#E5E7EB` | See source context | [THEMELIGHT](#evidence-themelight), [CSS](#evidence-css) |
| light-border-muted | `#D1D5DB` | See source context | [THEMELIGHT](#evidence-themelight) |
| active-inverse-surface | `#F3F4F6` | Active time-filter surface. | [TOKENS](#evidence-tokens) |
| active-inverse-ink | `#111827` | Active time-filter text. | [TOKENS](#evidence-tokens) |
| active-dark-surface | `#1F2937` | Active Media All filter surface. | [MEDIA](#evidence-media) |
| active-dark-ink | `#E5E7EB` | Subscribe input and active Media filter text. | [MEDIA](#evidence-media) |
| focus-border | `#6B7280` | See source context | [INPUTFOCUS](#evidence-inputfocus) |
| link-blue | `#60A5FA` | Observed article hyperlink color. | [ARTICLECONTENT](#evidence-articlecontent) |
| translation-rose | `rgba(251, 113, 133, 0.8)` | Chinese translation chip text. | [SEARCH](#evidence-search) |
| translation-rose-border | `rgba(190, 18, 60, 0.5)` | See source context | [SEARCH](#evidence-search) |
| inline-code-surface | `#1F2937` | Inline code backing. | [ARTICLECONTENT](#evidence-articlecontent) |
| inline-code-ink | `#E5E7EB` | See source context | [ARTICLECONTENT](#evidence-articlecontent) |
| table-dark-border | `#374151` | Dark table head/row hairline. | [ARTICLECONTENT](#evidence-articlecontent), [CSS](#evidence-css) |
| table-hover | `rgba(31, 41, 55, 0.5)` | Declared dark table-row hover surface. | [CSS](#evidence-css) |
| sticky-border | `rgba(75, 85, 99, 0.5)` | See source context | [NAVSTICKY](#evidence-navsticky) |
| light-chart-surface | `#FFFFFF` | See source context | [CSS](#evidence-css) |
| dark-chart-surface | `#18181B` | See source context | [CSS](#evidence-css) |

## Typography

IBM Plex Sans Variable is the rendered UI face; the stylesheet also declares Source Serif, but it was not observed as the rendered face in these samples. Page/article H1s are 30px/700/36px. Article H2s are 20px/700/28px; archive/card titles are 20px/500/28px; Media section titles are 18px/600/28px. Long prose and card summaries use 16px/400/32px. Small labels and panel titles use 14px/20; metadata, tags, and controls use 12px/16. Section eyebrows are 12px uppercase with 1.2px tracking. Desktop navigation is 16px/24, while the sampled mobile navigation is 13px/19.5. CJK text falls back to PingFang SC when IBM Plex glyphs are unavailable. Inline code uses a system monospace stack at 14px/20.

| Token | Font family | Size | Weight | Line height | Tracking | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| body-article | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 16px | 400 | 32px | normal | [ARTICLE](#evidence-article), [ARCHIVE](#evidence-archive) |
| small-body | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 14px | 400 | 20px | normal | [HOMECOMP](#evidence-homecomp), [ARTICLECONTENT](#evidence-articlecontent) |
| micro | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 12px | 400 | 16px | normal | [HOMEDARK](#evidence-homedark), [SEARCH](#evidence-search) |
| eyebrow | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 12px | 400 | 16px | 1.2px | [HOMEDARK](#evidence-homedark), [SERIES](#evidence-series) |
| nav-desktop | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 16px | 400 | 24px | normal | [HOMEDARK](#evidence-homedark) |
| nav-mobile | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 13px | 400 | 19.5px | normal | [HOMEMOB](#evidence-homemob) |
| page-title | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 30px | 700 | 36px | normal | [SERIES](#evidence-series), [ARTICLE](#evidence-article) |
| article-h2 | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 20px | 700 | 28px | normal | [ARTICLE](#evidence-article) |
| card-title | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 20px | 500 | 28px | normal | [ARCHIVE](#evidence-archive), [SEARCH](#evidence-search) |
| section-title | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 18px | 600 | 28px | normal | [MEDIA](#evidence-media) |
| panel-title | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 14px | 500 | 20px | normal | [TOKENS](#evidence-tokens) |
| table | "IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif | 14px | 400 | 20px | normal | [ARTICLECONTENT](#evidence-articlecontent) |
| mono | SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace | 14px | 400 | 20px | normal | [ARTICLECONTENT](#evidence-articlecontent) |

## Layout

Desktop main is a centered 672px column with 16px horizontal padding, yielding a 640px content width from x=400. The floating nav is capped around 768px and measured 65px tall; after 600px scroll it becomes a full-width 1440px sticky row with blur and a rgba(75,85,99,.5) bottom hairline. At 390px, main spans the viewport with 16px gutters and content is 358px. Article desktop layout adds a 384px sticky TOC beside the 640px prose; at 390px the TOC collapses and prose remains 358px. Home series entries use two columns with 32px column gaps and 6px row gaps. Token dashboards use three-column stat grids with 12px gaps and 8px-radius bordered panels. Search uses a full-width square input and long horizontally arranged tag cloud.

### Spacing Tokens

| Token | Value | Evidence |
| --- | --- | --- |
| main-width | 672px | [HOMEDARK](#evidence-homedark), [ARTICLELAYOUT](#evidence-articlelayout) |
| content-gutter | 16px | [HOMEDARK](#evidence-homedark), [HOMEMOB](#evidence-homemob) |
| content-width | 640px | [HOMECOMP](#evidence-homecomp), [ARTICLE](#evidence-article) |
| mobile-content-width | 358px | [HOMEMOB](#evidence-homemob), [ARTICLEMOB](#evidence-articlemob) |
| nav-max-width | 768px | [HOMEDARK](#evidence-homedark) |
| nav-padding | 32px 16px | [HOMEDARK](#evidence-homedark) |
| nav-height | 65px | [HOMEDARK](#evidence-homedark), [HOMEMOB](#evidence-homemob) |
| panel-inset | 12px 16px | [HOMECOMP](#evidence-homecomp) |
| panel-gap | 12px 16px | [HOMECOMP](#evidence-homecomp) |
| pill-inset | 6px 12px | [HOMECOMP](#evidence-homecomp) |
| small-pill-inset | 4px 12px | [HOMECOMP](#evidence-homecomp) |
| micro-pill-inset | 2px 8px | [SEARCH](#evidence-search) |
| series-grid-gap | 6px 32px | [HOMEDARK](#evidence-homedark), [HOMECOMP](#evidence-homecomp) |
| card-rhythm | 0px 0px 32px | [ARCHIVE](#evidence-archive) |
| table-cell | 8px | [ARTICLECONTENT](#evidence-articlecontent) |
| article-toc-width | 384px | [ARTICLELAYOUT](#evidence-articlelayout) |

## Elevation & Depth

The interface is almost flat. Editorial cards and list rows have no background, border, radius, shadow, or hover elevation; separation comes from 32px card rhythm, type hierarchy, and whitespace. The sticky nav uses 5px backdrop blur. Prompt launchers and analytics panels use 1px hairlines; prompt panels are 12px-radius, while most controls are full pills. Charts supply the strongest visual depth through categorical color rather than shadows. Long-page screenshots do not prove scroll-linked animation beyond the measured sticky nav transition.

## Shapes

Pills are the dominant control shape: standard tags/filters use 9999px radius and compact 4px/12px or 6px/12px insets. AI prompt and analytics panels use 12px radius. Small icon controls use 4px, chart data points use 2px, and editorial cards/tables/search input remain square. This creates a clear split: controls are rounded, content containers are not.

| Token | Value | Evidence |
| --- | --- | --- |
| pill | 9999px | [HOMECOMP](#evidence-homecomp) |
| panel | 12px | [HOMECOMP](#evidence-homecomp), [TOKENS](#evidence-tokens) |
| icon | 4px | [HOMEDARK](#evidence-homedark), [ARTICLECONTENT](#evidence-articlecontent) |
| data-point | 2px | [TOKENS](#evidence-tokens) |
| editorial-card | 0px | [ARCHIVE](#evidence-archive), [SEARCH](#evidence-search) |
| table | 0px | [ARTICLECONTENT](#evidence-articlecontent) |

## Components

The global shell is a logo, site name, language control, theme control, and text destinations; desktop text becomes 13px compact text on mobile. Home opens with two 640px AI prompt panels (12px radius, #374151 border, 12px/16px inset) containing 14px labels and external AI pills. Latest and Series sections use 12px uppercase eyebrows and square rows. Archive/Search cards are transparent article blocks: 20px/500 title, date on the baseline row, 16px/32 summary, then 12px pill tags; measured card hover changes nothing. Rose translation chips mark bilingual variants. Token Usage uses three-column stat groups, 8px-radius panels, inverse active pills, and categorical charts. Search uses a square white-on-night input. Articles use a 384px sticky TOC and 640px prose; markdown tables use 14px/20, 8px cells, #374151 hairlines, and declared row hover rgba(31,41,55,.5).

### Component Token Index

| Component token | Role / context | Evidence |
| --- | --- | --- |
| site-nav | Centered sticky header with blur; becomes full-width after scroll. | [HOMEDARK](#evidence-homedark), [NAVSTICKY](#evidence-navsticky) |
| site-nav-scrolled | See the component analysis above | [NAVSTICKY](#evidence-navsticky) |
| nav-link | See the component analysis above | [HOMEDARK](#evidence-homedark), [NAVHOVER](#evidence-navhover) |
| prompt-panel | Rounded AI prompt launcher panel. | [HOMECOMP](#evidence-homecomp) |
| prompt-pill | External AI action pill. | [HOMECOMP](#evidence-homecomp) |
| prompt-pill-hover | See the component analysis above | [PILLHOVER](#evidence-pillhover) |
| eyebrow | See the component analysis above | [HOMEDARK](#evidence-homedark), [SERIES](#evidence-series) |
| archive-card | Transparent text-first article card. | [ARCHIVE](#evidence-archive), [SEARCH](#evidence-search) |
| archive-summary | See the component analysis above | [ARCHIVE](#evidence-archive), [SEARCH](#evidence-search) |
| tag-chip | Pill-shaped topic filter. | [HOMECOMP](#evidence-homecomp) |
| tag-chip-hover | See the component analysis above | [TAGHOVER](#evidence-taghover) |
| translation-chip | Rose bilingual translation link. | [SEARCH](#evidence-search) |
| time-filter-active | See the component analysis above | [TOKENS](#evidence-tokens) |
| time-filter | See the component analysis above | [TOKENS](#evidence-tokens) |
| time-filter-hover | See the component analysis above | [TOKENHOVER](#evidence-tokenhover) |
| media-filter-active | See the component analysis above | [MEDIA](#evidence-media) |
| media-filter | See the component analysis above | [MEDIA](#evidence-media) |
| media-filter-hover | See the component analysis above | [MEDIAHOVER](#evidence-mediahover) |
| data-panel | Bordered analytics section with no filled card background. | [TOKENS](#evidence-tokens) |
| search-input | Square full-width search field. | [SEARCH](#evidence-search) |
| subscribe-input | See the component analysis above | [HOMEDARK](#evidence-homedark) |
| subscribe-input-focus | See the component analysis above | [INPUTFOCUS](#evidence-inputfocus) |
| article-body | Narrow long-form prose column. | [ARTICLE](#evidence-article) |
| article-toc | Desktop sticky table of contents. | [ARTICLELAYOUT](#evidence-articlelayout) |
| data-table | Compact markdown data table. | [ARTICLECONTENT](#evidence-articlecontent) |
| inline-code | Monospace inline token chip. | [ARTICLECONTENT](#evidence-articlecontent) |

## Do's and Don'ts

Do preserve the dark #18181B default, tight 672px reading column, IBM Plex hierarchy, gray-only body language, square text cards, pill controls, hairline panels, and local light/dark remapping. Do use #60A5FA links and rose translation chips only for their observed narrow roles. Do not turn every chart color into a brand token, add heavy card shadows to text lists, round article cards, or replace the transparent flat lists with filled cards. Keep the blurred sticky nav and the control-versus-content radius distinction.

## Responsive Behavior

At 390px, the nav becomes a full-width 390x65 row and its text drops from 16px/24 to 13px/19.5. Main changes from centered 672px to full-width with 16px gutters; measured content narrows from 640px to 358px. Article TOC collapses from a 384px desktop region to zero width, while H1 and prose remain in the 358px column. Home series grids collapse from two columns to one. The sampled Token and Media layouts stack their controls and panels. CSS declares min-width boundaries at 640, 768, 1024, 1280, and 1536px, but only 390px and 1440px behavior was directly measured.

## Iteration Guide

1. Build a dark technical blog shell with #18181B canvas, IBM Plex Sans, a blurred 65px sticky nav, 672px main, and 16px gutters; remap to #FFFFFF/#1F2937/#6B7280 on light toggle.
2. Build a text-first archive card as a square transparent article: 20px/500 title, baseline metadata, 16px/32 summary, and 12px pill tags; separate cards by 32px rather than shadows.
3. Build a token dashboard with a three-column stat grid, 12px-gap responsive collapse, 8px-radius #374151-bordered panels, inverse #F3F4F6/#111827 active filters, and categorical chart colors isolated from brand UI tokens.

## Known Gaps

Eight public English-entry templates were captured at 1440x900 and 390x844: Home, Series, Token Usage, Media, Search, archive page 2, one article, and one series detail; discovery was truncated by the representative page budget, so this is not full-site coverage. Media desktop/mobile and the mobile article exceeded the scroll budget, so deeper content is not claimed reviewed; their screenshots are viewport-limited. Runtime evidence records 22 third-party analytics collection failures/cancellations and one 404 fetch to an unselected Next.js series-data URL. The resource manifest stored 39 assets, explicitly excluded 960 candidates, and reported no deferred or failed downloads. Real interactions covered dark/light toggle, sticky scroll, several hovers, and programmatic input focus; search queries, language switching, form submission, chart tooltip/filter behavior, keyboard focus-visible, and touch states remain untested. Source Serif is declared but not observed rendered. This sample does not establish WCAG compliance.

### Scope & Evidence

- https://blog.ax0x.ai/
- https://blog.ax0x.ai/series
- https://blog.ax0x.ai/token-usage
- https://blog.ax0x.ai/media
- https://blog.ax0x.ai/search
- https://blog.ax0x.ai/page/2
- https://blog.ax0x.ai/gpt6-sol-luna-agent-routing
- https://blog.ax0x.ai/series/Shipping%20with%20Claude%20Code

<a id="evidence-homedark"></a>
- **HOMEDARK — measured**: https://blog.ax0x.ai/; `body, sticky nav, prompt panel, latest list, tag chips, subscribe`; 1440x900; default dark; [capture](evidence/pages/page-01.desktop.json). Fresh dark Home sample: #18181B canvas, 672px main, transparent list/card structures, pill controls, and #18181B-dominant screenshot.
<a id="evidence-homemob"></a>
- **HOMEMOB — measured**: https://blog.ax0x.ai/; `sticky nav, main, prompt panel, latest list, grids, chips`; 390x844; default dark; [capture](evidence/pages/page-01.mobile.json). Mobile main spans 390px with 16px gutters; nav becomes a full-width 390x65 row.
<a id="evidence-homecomp"></a>
- **HOMECOMP — measured**: https://blog.ax0x.ai/; `prompt panel/label/pill, eyebrow, series grid, tag chip, subscribe controls`; 1440x900;390x844; default; [capture](states/home-components/state.json). Targeted component measurements for panel radius, padding, gaps, chips, grids, and responsive widths.
<a id="evidence-themelight"></a>
- **THEMELIGHT — measured**: https://blog.ax0x.ai/; `body, nav text, latest link, tag chip, subscribe input before/after theme toggle`; 1440x900; light toggle; [capture](states/theme-light/state.json). Real click on aria-label Switch to light mode; canvas changes #18181B to #FFFFFF and gray roles remap.
<a id="evidence-navsticky"></a>
- **NAVSTICKY — measured**: https://blog.ax0x.ai/; `#sticky-nav before and after 600px scroll`; 1440x900; sticky/scrolled; [capture](states/sticky-nav-scrolled/state.json). Sticky nav uses blur(5px); scrolled state becomes full-width and adds rgba(75,85,99,.5) bottom hairline.
<a id="evidence-navhover"></a>
- **NAVHOVER — measured**: https://blog.ax0x.ai/; `nav Blog link`; 1440x900; hover; [capture](states/nav-hover/state.json). Hover confirmed; measured nav link color and transparent background remain unchanged.
<a id="evidence-pillhover"></a>
- **PILLHOVER — measured**: https://blog.ax0x.ai/; `ChatGPT prompt pill`; 1440x900; hover; [capture](states/ai-pill-hover/state.json). Hover changes text #D1D5DB to #FFFFFF and border #374151 to #6B7280.
<a id="evidence-taghover"></a>
- **TAGHOVER — measured**: https://blog.ax0x.ai/; `AI tag chip`; 1440x900; hover; [capture](states/tag-hover/state.json). Hover changes text #9CA3AF to #E5E7EB and border #4B5563 to #9CA3AF.
<a id="evidence-posthover"></a>
- **POSTHOVER — measured**: https://blog.ax0x.ai/page/2; `first archive article link and children`; 1440x900; hover; [capture](states/post-card-hover/state.json). Archive card hover produced no measured color, background, opacity, or transform change.
<a id="evidence-inputfocus"></a>
- **INPUTFOCUS — measured**: https://blog.ax0x.ai/; `subscribe email input`; 1440x900; programmatic focus; [capture](states/subscribe-input-focus/state.json). Focus changes border #374151 to #6B7280; programmatic focus does not prove :focus-visible.
<a id="evidence-series"></a>
- **SERIES — measured**: https://blog.ax0x.ai/series; `h1, category labels, series entries/grid`; 1440x900; default dark; [capture](evidence/pages/page-02.desktop.json). H1 30/700/36; 12px uppercase tracked labels; two-column compact series grid.
<a id="evidence-seriesmob"></a>
- **SERIESMOB — measured**: https://blog.ax0x.ai/series; `h1, category labels, series entries/grid`; 390x844; default dark; [capture](evidence/pages/page-02.mobile.json). Narrow series sample retains the same hierarchy in one content column.
<a id="evidence-tokens"></a>
- **TOKENS — measured**: https://blog.ax0x.ai/token-usage; `h1, intro, stat grids, data panels, active/inactive filters`; 1440x900; default dark; [capture](evidence/pages/page-03.desktop.json). Dashboard uses 640px content, 3-column stats, 8px-radius bordered panels, inverse active pills, and categorical chart colors.
<a id="evidence-tokensmob"></a>
- **TOKENSMOB — measured**: https://blog.ax0x.ai/token-usage; `dashboard grid and panels`; 390x844; default dark; [capture](evidence/pages/page-03.mobile.json). Narrow dashboard sample retains 16px gutters and stacked data panels.
<a id="evidence-tokenhover"></a>
- **TOKENHOVER — measured**: https://blog.ax0x.ai/token-usage; `7D time filter`; 1440x900; hover; [capture](states/time-filter-hover/state.json). Inactive 7D hover changes text #9CA3AF to #F3F4F6 while border remains #4B5563.
<a id="evidence-media"></a>
- **MEDIA — measured**: https://blog.ax0x.ai/media; `h1, language controls, active filter, media sections/list rows`; 1440x900; default dark; [capture](evidence/pages/page-04.desktop.json). Media index uses active All pill #1F2937/#E5E7EB and long text-first media lists; scroll is incomplete.
<a id="evidence-mediamob"></a>
- **MEDIAMOB — measured**: https://blog.ax0x.ai/media; `h1, controls, media list`; 390x844; default dark; [capture](evidence/pages/page-04.mobile.json). Narrow media sample; full-page screenshot is viewport-limited because the document exceeds capture budget.
<a id="evidence-mediahover"></a>
- **MEDIAHOVER — measured**: https://blog.ax0x.ai/media; `Podcasts filter`; 1440x900; hover; [capture](states/media-filter-hover/state.json). Inactive filter hover changes text #9CA3AF to #D1D5DB; border remains #4B5563.
<a id="evidence-search"></a>
- **SEARCH — measured**: https://blog.ax0x.ai/search; `search input, result cards, tag cloud`; 1440x900; default dark; [capture](evidence/pages/page-05.desktop.json). Search uses square full-width input, square text cards, rose translation chip, and horizontally arranged tag cloud.
<a id="evidence-searchmob"></a>
- **SEARCHMOB — measured**: https://blog.ax0x.ai/search; `search input, result cards, tag cloud`; 390x844; default dark; [capture](evidence/pages/page-05.mobile.json). Narrow search sample uses a 358px input/content column.
<a id="evidence-archive"></a>
- **ARCHIVE — measured**: https://blog.ax0x.ai/page/2; `archive article cards, titles, summaries, chips`; 1440x900; default dark; [capture](evidence/pages/page-06.desktop.json). Archive cards are transparent square article blocks with 20px/500 titles, 16px/32 summaries, and pill tags.
<a id="evidence-article"></a>
- **ARTICLE — measured**: https://blog.ax0x.ai/gpt6-sol-luna-agent-routing; `h1, metadata, TOC, article body, H2, inline code`; 1440x900; default dark; [capture](evidence/pages/page-07.desktop.json). Article H1 30/700/36, body 16/32, desktop TOC, H2 20/700/28, and monospace inline code.
<a id="evidence-articlemob"></a>
- **ARTICLEMOB — measured**: https://blog.ax0x.ai/gpt6-sol-luna-agent-routing; `h1, metadata, article body`; 390x844; default dark; [capture](evidence/pages/page-07.mobile.json). Narrow article body is 358px; full-page screenshot is viewport-limited because the document exceeds capture budget.
<a id="evidence-articlelayout"></a>
- **ARTICLELAYOUT — measured**: https://blog.ax0x.ai/gpt6-sol-luna-agent-routing; `article, H1, metadata nav, TOC, prose wrapper`; 1440x900;390x844; default; [capture](states/article-layout/state.json). Desktop reading area uses a 384px sticky TOC and 640px prose; mobile collapses TOC to zero and body to 358px.
<a id="evidence-articlecontent"></a>
- **ARTICLECONTENT — measured**: https://blog.ax0x.ai/gpt6-sol-luna-agent-routing; `markdown table, inline code, article link, TOC link`; 1440x900; default; [capture](states/article-content/state.json). Tables are 14px/20 with 8px cells and dark hairlines; inline code uses #1F2937/#E5E7EB and system mono.
<a id="evidence-css"></a>
- **CSS — measured**: https://blog.ax0x.ai/_next/static/css/41df9288917343c6.css?dpl=dpl_9LpK42718rQ52nbFgnY6GW8aXCEk; `font-face, theme, nav, focus, table, and chart-surface rules`; declared; source CSS; [capture](evidence/assets/8c1b8ed1b5181ee0e7a6.css). Saved CSS for IBM Plex/Source Serif, day/night surfaces, nav blur, focus states, markdown tables, and chart surfaces.
<a id="evidence-shots"></a>
- **SHOTS — observed**: https://blog.ax0x.ai/; `all 16 captured page screenshots`; 1440x900;390x844; default dark; [capture](evidence/screenshot-audit.json). Pixel audit found #111 bucket dominance around 88.5%-96.9% and no blank white shells; long-page images are viewport-limited where noted.
<a id="evidence-gaps"></a>
- **GAPS — observed**: https://blog.ax0x.ai/; `inventory, runtime network, resource manifest`; mixed; capture limitations; [capture](evidence/inventory.json). Eight pages captured; Media and mobile article scroll incomplete. Runtime records 22 third-party analytics collection failures/cancellations and one 404 fetch to an unselected Next.js series-data URL; resource ledger has 39 stored, 960 excluded, 0 deferred/failed downloads.

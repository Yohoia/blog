# Personal Blog Design System

> Design direction for a personal digital space built around **Index / Writing / Fragments / Projects / Finder / News / Now**.
>
> The goal is not to reproduce any reference website. The three reference systems are treated as design research: take their strongest ideas, remove what does not fit, and recombine them into a quieter, more personal system.

---

# 当前落地规范（2026-09-30）

本节记录当前项目的实际设计与进度；与后文早期建议不同的地方，以本节和对应章节的已落地说明为准。未制作板块的建议仍是后续规划，不代表已实现。

- 已完成中英文 Index、Writing 列表、文章详情模板、News 及 403 / 404 / 500 / 502 插画页。Writing 已接入一篇用户提供的机器学习案例文档，文章详情使用左侧随页面滚动并在顶部停靠的目录；菜单为 Index、Writing、Fragments、Projects、Finder、News、Now；About、Profile 已移除，Fragments、Projects、Finder、Now 栏目页与用户自己的正式文章尚未实现。
- 公共主题仍为暖纸色与柔和暗色，Sans / Mono 从本站托管。小字使用对比度增强的 `--muted-text`、`--signal-text`；颜色、尺寸与动画参数分别由 `src/styles/tokens.css` 和 `src/config/motion.ts` 管理。
- Header 使用磨砂层：纸色 70% 与透明色混合、模糊 `1.25rem`、饱和度 `1.35`。Logo 与操作按钮分置视口两侧，水平边距缩至 `clamp(1rem, 3vw, 3rem)`，桌面 / 窄屏垂直边距分别为 1rem / 0.75rem；右侧依次为菜单、语言、主题。Header 在普通文档流中随页面自然滚动，没有滚动收紧、固定或淡出动画。
- 桌面、移动端统一使用黑色全屏 Type Overlay。原生 dialog 管理焦点，Motion 从菜单按钮中心圆形展开并逐项显示大字号导航；保留关闭、Escape、减少动画与无脚本回退。开关菜单保持阅读位置和页面宽度，菜单可滚动但不显示滚动条。
- 不同栏目切换以及从其他页面点击 Header Logo 返回首页时播放 ASCII 字符网格过渡；语言、正文链接、当前栏目和历史返回不播放。覆盖与退场各约 0.5 秒，结束后清理绘制。
- Index 使用 760px 内容宽度，Writing 列表使用 680px，均从 Header 下沿开始。两页隐藏根滚动条并取消占位，保留滚轮、触控与键盘滚动。其他页面的原生滚动条轨道沿用画布色，随主题同步切换，避免边缘异色。
- 首页为透明平铺的命令与信息，不使用终端窗口外框。绿色 `yohoia`、蓝色 `space`、柔和绿色光标；各部分用 1px 横线分隔，线上下各 12px。仅刷新播放匀速打字与逐行信息，直接访问及站内返回展示完整内容。`whoami` 右侧圆点头像与左侧输出同步结束，保留 Canvas 最后一帧以避免抖动；末尾光标仅在前台且可见时闪烁。
- Writing 按当前参考配置的年 / 月 / 日归档，9 条记录从新到旧排列，移除介绍与顶部统计。年份使用 Space Grotesk 600 字重的浅色描边数字，月份侧栏与每行日期 / 星期组成时间线；标题与次级文件名单行省略，完整文字保留。黄色标题色带保持 `0.72em` 高度，Motion 仅驱动横向进度，首次与后续悬浮一致；最多三个 `#` 标签，悬浮变深并展开下划线。行尾浅色箭头在悬浮文章时显示蓝色圆底并轻移。底部 `cd ../` 返回当前语言的首页，未添加参考记录的虚构正文入口。
- Article View 已落地为从 Header 下沿开始的 680px 居中阅读栏和宽屏左侧目录。标题下方双细线包围日期、可选原文署名、正文估算字词量、阅读时间和标签；可选更新时间、封面读取实际内容。案例条目在标题上方显示标记。正文使用本站托管的 Newsreader 和中文系统宋体回退，标题使用 Sans，代码块使用公共 Code Surface。文章 h1 是页面题目，目录从正文渲染的 h2 / h3 / h4 生成。宽屏目录左缘与 Logo 对齐，宽 240px，带短色线的 “On this page” 标题和目录常显；侧栏随文章滚动，标题顶部接触视口顶部后停住。目录列表随视口可用高度扩展，下方操作区保持可见；列表隐藏滚动条，溢出边缘显示渐进模糊，当前章节以 Signal 色标记。下方细分隔线连接 GitHub 编辑、仓库加星、复制文章及聊天入口；聊天按钮上方弹出宽 240px 的选择菜单，ChatGPT 和 Claude 使用本地品牌 SVG。较窄窗口在页面右侧边缘显示 44px 触摸区的箭头，点击展开靠右的可滚动目录，箭头随面板移至左边缘；Motion 仅驱动面板原地淡入淡出，减少动画即时更新。仅已发布内容生成中英文静态详情，九条无正文参考记录保持无链接；当前有一篇机器学习案例文档，图片使用本地优化资源。
- 可悬浮的精细指针使用本地 SVG 原生光标：普通区域使用 18px 黑色箭头，不使用白色描边；暗色主题与固定黑色的全屏菜单用浅色实心箭头，圆形缩为 24px，填充不透明度 55%。仅悬浮链接、按钮、菜单以及 Writing 文章 / 标签时变为浅黄色圆形，移开后恢复箭头；点击不单独触发。两种主题保持一致的辨识度；纯触控设备不启用，文本输入与禁用控件保留原生状态，不添加持续跟随动画。
- 错误页使用无 Header 的独立全屏布局；响应式插画居中显示，保持比例与暗色可辨认，提供返回首页入口，标记 noindex。真正的服务器错误绑定待部署时配置。

当前公司、履历和统计仍含用户要求暂留的参考内容。News 已接入 AIHOT API；用户自己的正式文章、其余栏目、RSS 与部署均待后续实现，详见 [README.md](README.md)。本地 HTML 原型与参考素材继续保留，不随代码发布。

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

当前桌面与移动端共用 Type Overlay 入口，Header 使用半透明磨砂纸色背景，Logo 与操作按钮分置两侧。Header 随页面自然滚动；一级导航文字放在全屏菜单内，不显示旧版居中的横向导航。

Lucide icons should mainly be used for utility actions:

- theme
- search
- external link
- menu
- RSS
- GitHub

---

## Mobile

移动端保留同一套菜单、语言与主题操作，缩小 Logo 和控件间距，每个操作至少 44px。全屏菜单内容在短视口中自然滚动，隐藏滚动条外观，避免挤压导航文字。

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

当前仅刷新时播放命令匀速打字、信息逐行淡入与同步圆点头像聚合。普通访问、站内返回与历史返回直接展示完整内容；语言切换保留播放进度。悬浮 / 聚焦可重播 Logo 与头像，末尾光标仅在可见且页面处于前台时闪烁。

### Writing

列表保持稳定，使用 Motion 提供标签变色 / 下划线、行尾箭头圆底与轻移，以及底部返回入口的反馈。其他条目只弱化标题，日期与标签保持可读；减少动画时立即更新状态，不播放位移。

### Navigation

全屏菜单使用圆形展开与导航逐项进入。跨栏目和 Header Logo 返回首页使用全屏 ASCII 字符过渡；参数独立于通用 page 时长，语言、正文链接及历史返回不播放。

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

通用界面使用 **Lucide**。首页八个社交渠道按用户要求使用本地 Simple Icons 品牌 SVG，来源与 CC0 许可保存在 `src/assets/icons/social/`；不加载远程徽章或图标运行时。

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

当前首页结构：

```text
Last login（浏览器本地日期时间）
whoami + 圆点头像
cat philosophy.md
claude-code --stats
ls -ltr writing/ | tail -n 6
ls compute-labs/agents/
git log --oneline --reverse career/
pr -2 -t links.md（八个渠道，两列各四个）
末尾空提示符
```

各部分透明平铺，使用公共颜色与等宽字体，用紧凑横线组织信息。姓名与联系方式已替换为 Yohoia；公司、履历、统计仍是暂留参考内容，文章区取参考列表最新六条，不是已发布文章数据。原先 UTC 时钟和 Recently 模块已移除。

---

# 14. Writing

## Personality

The calmest page on the site.

Design goal:

> Remove everything that competes with reading.

## List View

当前为期刊式年份 / 月份归档，使用 680px 公共 reading 容器和 Sans 字体，透明文字行按日期从新到旧排列。页头仅保留 Writing · Yohoia、细线与标题，不显示介绍和顶部统计。

每行标题及次级内容单行显示，超出部分省略；当前次级内容是文件名，未编造摘要或阅读时长。年份采用 Space Grotesk 600，读取公共 --font-year，保留原字号与 1px 浅色描边；仅 Writing 加载拉丁字符集的对应字重，不改变标题和正文的 Geist。年份背景、月份侧栏、每行日与星期一起表达日期，以配置中的 publishedAt 为准并使用 UTC 计算，最多三个 `#` 标签，按标题分类。日期数字、星期与标签统一为公共 text-meta（14px / 21px）和常规字重，日期圆底尺寸随行高计算；标签下划线使用绝对定位，不通过额外底部留白改变文字对齐。手机端月份移至文章上方，日期与标签自然换行。

箭头固定在行尾，默认浅色；悬浮文章时出现蓝色小圆并轻移箭头。标题的黄色色带高度固定为 0.72em，只通过数值型 CSS 变量横向展开，避免动画将计算后的 px 与 em 高度插值。标签悬浮变深，下划线由 Motion 展开。底部普通链接 `cd ../` 返回当前语言的 Index。九条参考记录没有正文，不创建占位详情链接；已发布真实文章另生成详情页并在列表提供入口。

---

## Article View

已落地：

```text
680px reading width
generous line height
strong typography
quiet code blocks
left sticky visible TOC with active section and article actions; narrow screens use a right-edge arrow
```

当前封面与正文图片保持在阅读栏内；更宽的图片布局仍是后续可选设计。

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

## 当前落地（2026-09-29）

News 内容从 Header 下沿开始，期号、选中日期、更新时间与刷新按钮保留在版面元信息行，顶部只保留头版的粗分隔线。右侧日历与分类目录参照 `news-heatmap-v3.html`：日历使用日报 / 周报 / 月报三种点阵视图，容器高度在桌面与窄屏内固定，切换不改变后续版面位置；每个日期或周期以圆点表示，深色为有日报、浅色为无日报，颜色不表示资讯数量。悬浮或聚焦只提示日期，不显示条数；日报按星期排列，周报按季度分四行并兼容 ISO 第 53 周，月报以 12 个月两行排列；周与月点选择对应周期内最新可用日报，无日报周期仍显示浅色点。选择有日报的点加载 `/dailies/{date}`，失败保留原版面，可返回最新资讯。分类包含全部头条与七个主题入口，补齐行业动态与开源入口，采用带两位序号的纵向透明文字行、细分隔线、选中下划线与悬浮轻移，动画来自 motionTokens.news；数量仅显示选中分类已载入条数。已移除搜索入口及交互。下方各分类使用三列网格，平板两列、手机单列；普通新闻卡片统一为 24rem 高度与相同内容宽度，减少底部留白；标题最多三行、简介最多四行；标题自然左对齐，完整文字保留在 DOM 与悬浮提示中。精选与 AI 评分移至卡片左上角，替代分类小标题；时间与来源靠底，保留原有数据；阅读原文位于卡片右上角，与精选及评分对齐，文章标题跳转 AIHOT 导读，来源名称仅展示文字，底部不重复放阅读链接；头条沿用独立版面。页面底部去除来源与语言说明，只保留左侧 cd ../ 返回当前语言首页，不显示箭头。分类加载期间保留最近成功版面，连续切换取消旧请求和过渡；日历模式、筛选与已载入内容随语言切换保留。

News 已实现中英文报纸式页面 `/news/`、`/en/news/`，去除大报头；复用公共导航、1200px wide 容器与主题，展示头条、次要新闻、右侧热力图与分类目录，以及下方按分类分组的三列资讯。AIHOT 匿名只读 API v1 提供最近七天精选与最新日报；构建保存快照，浏览器打开时更新，前台每十分钟条件请求，也可手动刷新。API 当前提供五种分类；行业与商业入口均使用 industry，开源入口使用 q=开源，保留 API 返回的原始分类；24 条一页，游标分页追加；中英切换保留筛选与已载入内容。ETag / 304 复用成功缓存，失败保留最近成功的版面，429 遵守 Retry-After，游标失效重取首屏。标题、摘要、评分和来源均来自 API，不添加虚构期号、标签或新闻；英文优先采用 originalTitle，摘要保留来源语言，所有时间明确使用北京时间。

所有文章结构由 Astro 输出，浏览器复用 Astro 模板与原生控件，不引入 React hydration 或新依赖。文字透明、无阴影、无圆角，以公共 Heading / Border 线分栏；头条摘要在宽屏分两栏，手机单栏，右侧日历与目录在窄屏移入正文。日历模式按钮、分类与操作链接保留 44px 触摸区和键盘焦点；触屏热力格至少 44px，密集周视图局部横向滚动。普通状态通过读屏播报，不占用额外可见行；错误与空结果可见。下文为早期规划，尚未提供的 API 字段与其他交互不视为已实现。

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
→ 通用界面图标；社交品牌使用本地 Simple Icons SVG

Markdown / MDX
→ Writing, Fragments, Projects content
```

No general-purpose UI component library is required.

---

# 26. Final Design Sentence

If a design decision is unclear, use this sentence as the filter:

> **Keep the reading experience editorial, the interaction precise, the information calm, and the personality visible through details rather than decoration.**

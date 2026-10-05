# Personal Blog Design System

> Design direction for a personal digital space built around **Index / Blog / Project / Skill**.
>
> The goal is not to reproduce any reference website. The three reference systems are treated as design research: take their strongest ideas, remove what does not fit, and recombine them into a quieter, more personal system.

---

# 当前落地规范（2026-10-05）

本节记录当前项目的实际设计与进度；与后文早期建议不同的地方，以本节和对应章节的已落地说明为准。未制作板块的建议仍是后续规划，不代表已实现。

- 已完成中英文 Index、Blog 列表、文章详情模板、Project、Skill 及 403 / 404 / 500 / 502 插画页。Blog 已接入《机器学习概述》与《KNN算法》两篇真实文章。Header 显示 Index、Blog、Project、Skill，与页面标题、公开路由 `/`、`/blog`、`/project`、`/skill` 一致；Fragments（碎片）与 Now（近况）已按用户要求移除，旧地址使用自定义 404。About、Profile 同样不属于当前栏目。
- Project 页面当前采用一张完整卡片对应一个项目：薄边框与 radius-lg 圆角包裹 Logo、名称、简介、真实链接、水印式空心两位序号和专属动画，取消章节虚线、嵌套演示外框及重复品牌标题。沿用公共 compact 容器的 720px 内容区，卡片内介绍 / 动画按 42% / 58% 排列，padding、列间距与卡片间距使用 item-gap 的 0.75 倍；上下 padding 使用局部间距的 1.25 倍；窄屏自然堆叠，内容自然撑高。介绍 Logo 为 48px，空心序号保留浅淡水印风格，使用 Space Grotesk 600、font-year 和混合 8% heading 的 1px 描边；与链接横排，编号在左、两个同字号链接在右，互不遮挡。中英文页面均显示“Project”主标题；列表下方不添加横线或 cd ../ 返回区。后续项目统一沿用第 16 节的卡片设计规范。DiDa-todo 用 Typeless 风格深色浮动胶囊与白色细波形演示语音输入 → AI 整理 → 待办生成；单个 Motion 时间轴循环播放，结果停留 3 秒，0.42 秒淡出后重播。结果可勾选，聚焦待办、离开视口或后台时暂停，减少动画直接展示完整结果；中英切换保留状态。不显示分类、技术栈、播放按钮、卡片底栏或倒计时。链接保留 Motion 下划线和箭头反馈。公共主题、字体、导航与 Footer 沿用既有实现，不恢复旧版灵感手稿规范。
- 公共主题仍为暖纸色与柔和暗色，Sans / Mono 从本站托管。小字使用对比度增强的 `--muted-text`、`--signal-text`；颜色、尺寸与动画参数分别由 `src/styles/tokens.css` 和 `src/config/motion.ts` 管理。
- 公共页面背景按用户提供的 `back.html` 使用有机游荡波点：固定视口 Canvas 上每 40px 一个略带随机偏移的锚点，细点在各自锚点附近缓慢游荡；精细鼠标在 120px 内使波点轻微排斥并变亮，边缘径向渐隐。点色读取公共 heading 主题色，背景不接收点击，也不改变原生光标。减少动画或无脚本时显示静态波点；后台、页面替换时停止绘制并清理。SiteLayout 管理常规页面，错误页与独立 BaseLayout 页面保持原画布；此前网格与波浪仅保留在背景探索路径。
- 明暗切换保留现有太阳 / 月亮按钮，复刻 `Theme-change.tsx` 用户选定的 rectangle、blur on、bottom-up：新主题从视口底部向上矩形揭幕，时长 0.7 秒，使用 Expo Out 缓动，模糊由 8px 经 4px 消退至 0px。实现与 `Theme-change.tsx` 相同：原生 View Transition 伪元素播放 CSS Keyframes，旧快照置于下层且不动画，新快照按目标主题选择 keyframes；参数为 `motionTokens.theme`，样式只在主题切换期间生效。减少动画或浏览器不支持时即时切换，快速连点、导航和页面离开时清理；不引入参考 Options 面板或黑白按钮，不改变栏目字符过渡。
- Header 背景透明。Logo 在左，四个文字导航入口与语言、主题按钮在桌面右侧同一行；42rem 以下 Logo 在上，导航与按钮在下一行并排。导航字与图标同为 18px，窄屏压缩间距但保持 44px 触摸高度。水平边距为 `clamp(1rem, 3vw, 3rem)`，24rem 以下为 0.75rem；桌面 / 窄屏垂直边距分别为 1rem / 0.75rem，Header 随普通文档流滚动。悬停或聚焦目标链接时，其他链接淡化、模糊；宽屏目标链接放大并略微上移，窄屏及减少动画时取消位移。
- 公共 Footer 采用用户选定的终端式极简落款：`yohoia@space:~$` 后直接显示版权和备案号，整组水平居中；14px Mono Meta，提示符沿用首页绿 / 蓝语义色，手机端自然换行。透明、无横线、外框、独立品牌名、描述、光标或动画；备案号读取真实配置并链接官方查询入口。
- 四个导航入口是普通链接，无脚本也可访问。当前栏目用下划线和 `aria-current` 标识；不挂载旧全屏 Type Overlay。
- 四个文字导航入口切换不同栏目、从其他页面点击 Header Logo 返回首页时播放 ASCII 字符网格过渡；当前栏目、语言、正文链接和历史返回不播放。覆盖与退场各约 0.5 秒，结束后清理绘制。
- Index 使用 760px 内容宽度，Blog 列表使用 680px，均从 Header 下沿开始。两页隐藏根滚动条并取消占位，保留滚轮、触控与键盘滚动。其他页面的原生滚动条轨道沿用画布色，随主题同步切换，避免边缘异色。
- 首页为透明平铺的命令与信息，不使用终端窗口外框。绿色 `yohoia`、蓝色 `space`、柔和绿色光标；各部分用 1px 横线分隔，线上下各 12px。仅刷新播放更快的匀速打字与每条命令的整块信息浮现，直接访问、站内返回及历史导航展示完整内容；只有主动语言切换保留播放快照。刷新时字体最多等待 1.5 秒，超时后使用回退字体继续，离开页面及时清理等待。`whoami` 右侧圆点头像与左侧输出同步结束，保留 Canvas 最后一帧以避免抖动；末尾光标仅在前台且可见时闪烁。
- Blog 按真实已发布条目的年 / 月 / 日归档，从新到旧排列，移除介绍与顶部统计。年份使用 Space Grotesk 600 字重的浅色描边数字，月份侧栏与每行日期 / 星期组成时间线；标题与正文首段单行省略，完整文字保留；文件名不显示，整张文章卡片可点击进入详情。黄色标题色带保持 `0.72em` 高度，Motion 仅驱动横向进度；最多三个 `#` 标签，悬浮变深并展开下划线。行尾浅色箭头在悬浮文章时显示蓝色圆底并轻移。列表底部不添加返回入口或分隔横线。
- Article View 已落地为参考站比例的宽屏版式：正文纸张与右侧目录 / 快捷栏组成最大 1152px 的内容组合并整体居中；1280px 及以上正文为 920px，右侧栏为 200px，1024–1280px 保留右侧栏并让正文收缩，1024px 以下转为单列并使用右侧边缘箭头打开目录浮层。根滚动条外观隐藏但保留自然滚动。文章标题和下方 meta 行在正文纸张内水平居中；meta 单行展示头像版 Yohoia、YYYY/MM/DD 发布日期、细线索引标签、字数与分钟数，日期 / 标签 / 统计配线性小图标，所有子项继承同一 12px / 1.4 Mono Meta 样式，窄屏允许居中换行；可选更新时间、封面读取实际内容。正文使用本站托管的 Newsreader 和中文系统宋体回退，标题使用 Sans，代码块使用公共 Code Surface。文章 h1 是页面题目，目录从正文渲染的 h2 / h3 / h4 生成；“On this page” 保留 120px 顶部停靠偏移，可见高度约 248px，内部滚动并在溢出边缘显示渐进模糊，当前章节以 Signal 色标记，下方进度与快捷操作位置保持不变。右侧同一栏依次提供阅读进度、回到顶部、本地喜欢、分享、GitHub 更新 / 支持 / 反馈。底部左侧 `cd ../` 返回当前语言 Blog 列表；较窄目录浮层用 Motion 仅原地淡入淡出并尊重减少动画。
- 可悬浮的精细指针使用本地 SVG 原生光标：普通区域使用 18px 黑色箭头，不使用白色描边；暗色主题与固定黑色的全屏菜单用浅色实心箭头，圆形缩为 24px，填充不透明度 55%。仅悬浮链接、按钮、菜单以及 Blog 文章 / 标签时变为浅黄色圆形，移开后恢复箭头；点击不单独触发。两种主题保持一致的辨识度；纯触控设备不启用，文本输入与禁用控件保留原生状态，不添加持续跟随动画。
- 错误页使用无 Header 的独立全屏布局；响应式插画居中显示，保持比例与暗色可辨认，提供返回首页入口，标记 noindex。真正的服务器错误绑定待部署时配置。

首页个人介绍、工具与四阶段教育经历已接入用户资料，在中英文页面均以英文展示；仅 `claude-code --stats` 的统计仍含此前要求暂留的参考内容。Blog 已接入两篇用户提供的正式文章；更多文章、其余栏目、RSS 与部署仍待后续实现，详见 [README.md](README.md)。本地 HTML 原型与参考素材继续保留，不随代码发布。

---

## Footer · 终端式极简落款规范（2026-10-05）

位置规则：短页面贴住视口底部，长页面位于正文末尾，随页面自然滚动。SiteLayout 给 body 添加 `site-document`，使用纵向 Flex 与 `100vh` / `100dvh` 最小高度；Header、主内容与 Footer 不收缩，Footer 上方自动边距吸收剩余空间。正文保留自然高度，不增加内部滚动、固定页脚或高度测量脚本；错误页和探索页的独立 BaseLayout 不受影响。

用户在第三轮方向中选定「终端刊尾」，再将内容收至一行命令式落款，由 `src/components/layout/Footer.astro` 实现，所有常规页面经 SiteLayout 共用。内容为 `yohoia@space:~$ © 年份 Yohoia · 赣ICP备2025075792号-2`；没有独立品牌标题、slogan、光标、打字或其他动画。`/footer-explorer/` 保留第三轮候选，第二轮文件继续保留为历史探索记录。

整组读取 `--font-mono`、`--text-meta`（14px）与公共触摸高度，页面内水平居中。提示符用户名和主机名分别读取 `--terminal-user`、`--terminal-host`，其余使用 `--muted-text` / `--heading`；不写另一套颜色。备案号是整组唯一可点击元素，悬浮 / 聚焦显示 `--signal-text` 与下划线，保留至少 44px 触摸高度和公共键盘焦点。整组最大宽度由视口与公共 gutter 约束，窄屏按内容自然换行并保持居中，备案号本身不拆断。

Footer 外框上下内边距均为 0，不加顶部横线、色块、边框、阴影或外部留白。短页面的自动上边距吸收剩余空间，长页面正文保持自然高度；不固定整体高度或覆盖内容。版权年份按站点时区在构建时生成，站名与备案读取 `siteConfig`，备案链接为 `https://beian.miit.gov.cn/`；中英文页面使用同一格式，不需要额外描述翻译。错误页继续使用独立 BaseLayout，不引入 Footer。

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

Use this higher-density language mainly for technical project details, search, and filters.

Do not let this density leak into Blog.

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

Blog can have a more editorial rhythm.

---

# 3. The Resulting Design Personality

The design should not feel like:

- a SaaS dashboard
- a component-library demo
- a traditional portfolio template
- an information portal
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
- Skills

---

## Editorial Typeface

For Blog, an optional serif layer can add personality.

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
- compact technical metadata where useful

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

Blog and long-form content:

```text
max-width: 680px
```

General Index content:

```text
max-width: 760px
```

Skills may expand:

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

Header display labels (internal sections: Index / Blog / Projects / Skills):

```text
Index
Blog
Project
Skill
```

Logo / name returns to:

```text
Index
```

## Desktop

Header 背景透明，桌面将四项导航与语言、主题按钮作为右侧同一排操作区，Logo 留在左侧。导航文字与 Lucide 图标同为 18px。鼠标悬停或键盘聚焦时，目标项清晰、放大并略微上移，其余项淡化并模糊。当前项用下划线标记；尊重减少动画偏好。

Lucide icons should mainly be used for utility actions:

- theme
- search
- external link
- menu
- RSS
- GitHub

---

## Mobile

42rem 以下 Logo 单独位于上方，四项导航与语言、主题按钮在下一行并排；窄屏收紧横向间距并取消导航放大位移，保留每个入口至少 44px 触摸高度。24rem 以下将水平内边距收至 0.75rem，并缩小 Logo。

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

当前仅刷新时播放命令匀速打字、每条命令的信息整块淡入 / 上浮与同步圆点头像聚合。试行参数：每字符 35ms，输出 0.5 秒、上浮 8px，命令前后停顿适当缩短；输出读取公共 easing，以线性进度保存语言切换快照。普通访问、站内返回与历史返回直接展示完整内容；语言切换保留播放进度。悬浮 / 聚焦可重播 Logo 与头像，末尾光标仅在可见且页面处于前台时闪烁。

圆点头像的桌面宽度不超过 144px，仍根据完整信息高度缩小；网格列与按钮共用 `--avatar-max-size` 上限，避免头像变宽挤压文字后反过来继续放大。ResizeObserver 的尺寸写入合并到下一帧，首行输出前仍同步测量，离开时取消待执行的测量。

### Blog

列表保持稳定，使用 Motion 提供标签变色 / 下划线与行尾箭头圆底、轻移。其他条目只弱化标题，日期与标签保持可读；减少动画时立即更新状态，不播放位移。

### Navigation

文字导航通过 CSS 实现聚焦模糊反馈，不依赖 JavaScript。切换不同栏目与 Header Logo 从其他页面返回首页使用全屏 ASCII 字符过渡；语言、正文链接及历史返回不播放。

### Skills

参考插图卡片保持整体，只用轻微倾斜、插图视差、箭头反馈和短暂入场解释外链交互。减少动画关闭位移，手机不启用指针视差。

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
Skills       Sparkles
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

- Blog
- recent Index entries

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
ls -ltr blog/ | tail -n 6
ls tools/
git log --oneline --reverse education/
pr -2 -t links.md（八个渠道，两列各四个）
末尾空提示符
```

各部分透明平铺，使用公共颜色与等宽字体，用紧凑横线组织信息。姓名、联系方式、个人介绍、工具与教育经历已替换为用户资料。`whoami` 保留姓名及三行英文介绍：AI Application Engineer、Independent Learner & Software Developer、Based in China；不显示旧公司或职场履历。`ls tools/` 每行显示蓝色工具名和一句基础英文简介，保持原双列排版，窄屏自然堆叠；仅展示用户提供的五款工具，名称使用已核对的官方链接，保留蓝色与细虚线下划线，悬浮 / 聚焦变为实线；新标签页打开，窄屏链接保留至少 44px 触摸高度。`git log --oneline --reverse education/` 保留黄色短哈希、年份、学习阶段与白色学校名，四行按 2012、2015、2018、2023 排列；不增加专业或毕业信息。三组内容在中英文页面均使用英文，输出容器统一使用 data-terminal-output，保留整块播放进度。统计仍是此前暂留参考内容；文章区从真实已发布 Blog 条目取最新六条，每行仅显示权限、所有者、日期和可点击文件名，不重复文件名右侧的文章标题；文件名继续定位当前语言的 Blog 条目。原先 UTC 时钟和 Recently 模块已移除。

---

# 14. Blog

## Personality

The calmest page on the site.

Design goal:

> Remove everything that competes with reading.

## List View

当前为期刊式年份 / 月份归档，使用 680px 公共 reading 容器和 Sans 字体，透明文字行按日期从新到旧排列。页头仅保留 Blog · Yohoia、细线与标题，不显示介绍和顶部统计。

每行标题与正文首段单行显示，超出部分省略；文件名不显示，整张真实文章卡片可点击进入详情，不编造预览或阅读时长。年份采用 Space Grotesk 600，读取公共 --font-year，保留原字号与 1px 浅色描边；仅 Blog 加载拉丁字符集的对应字重，不改变标题和正文的 Geist。年份背景、月份侧栏、每行日与星期一起表达日期，以配置中的 publishedAt 为准并使用 UTC 计算，最多三个 `#` 标签，按标题分类。日期数字、星期与标签统一为公共 text-meta（14px / 21px）和常规字重，日期圆底尺寸随行高计算；标签下划线使用绝对定位，不通过额外底部留白改变文字对齐。手机端月份移至文章上方，日期与标签自然换行。

箭头固定在行尾，默认浅色；悬浮文章时出现蓝色小圆并轻移箭头。标题的黄色色带高度固定为 0.72em，只通过数值型 CSS 变量横向展开，避免动画将计算后的 px 与 em 高度插值。标签悬浮变深，下划线由 Motion 展开。列表底部不添加返回入口或分隔横线；仅包含真实已发布文章，整张文章卡片可点击进入详情，不创建占位链接。

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

# 15. Fragments（历史参考，当前已移除）

## Personality

More compact and exploratory than Blog.

Fragments should feel like a working notebook.

Possible information:

- title
- updated date
- status
- related fragments
- topic

The page may use slightly higher information density than Blog.

No need for long descriptions on every list item.

---

# 16. Project · 项目卡片设计规范

本节是用户确认的当前 Projects 设计基线，适用于后续加入博客的真实项目。沿用当前卡片风格，项目特点通过内容与专属演示表达；此前撤销的灵感手稿方案不恢复。

## 页面与卡片布局

- 中文 `/project` 与英文 `/en/project` 共用页面结构、公共 Header、主题和 Footer；主内容保留 `id="main-content"`。
- 页面仅显示当前语言的栏目主标题（中文“项目”、英文“Project”）与项目卡片列表。列表结束后自然进入公共 Footer，不添加列表下方横线或 `cd ../` 返回区。
- 一张卡片对应一个项目。Logo、名称、简介、跳转链接、空心序号与功能演示放在同一个外框内；品牌只显示一次。
- 内容最大宽度为 720px，直接使用公共 `--container-compact`，整体居中；较窄视口保留公共 gutter，卡片自然收缩。
- 桌面卡片为介绍 42% / 演示 58% 的两列，内容垂直居中。卡片左右 padding、两列间距、卡片之间及主标题下方的间距统一使用 `--project-card-gap`；上下 padding 使用其 1.25 倍，为动画和简介保留更多空白。`--project-card-gap` 的值为公共 `--item-gap` 的 0.75 倍。
- 768px 以下为单列：先介绍，后演示。高度由完整文本和演示内容自然撑开，不固定高度、截断简介或隐藏溢出来压缩卡片。
- 卡片使用 1px `--border`、`--radius-lg` 和 `--surface`；悬浮或聚焦时使用 `--border-strong`。卡片外不加章节虚线，演示不再套第二层项目卡片外框。

## 品牌、文案与链接

| 内容 | 统一规则 |
| --- | --- |
| Logo 与名称 | 原始项目 Logo 为 48px；与名称横排，间距 `--inline-gap`。名称是唯一的 h2，使用 `text-section`、Sans 与 600 字重。 |
| 项目简介 | `summary / summaryEn` 使用 `--text-meta`、1.65 行高与公共正文色；简介和编号 / 链接组合行上方间距为 `--inline-gap` 的 0.75 倍。先讲用户能得到什么，再用简短文字说明核心能力；依据真实项目资料，不编造效果、用户数或完成状态。 |
| 跳转链接 | 保留真实产品入口和源码入口，两个链接统一使用 `--text-meta`（14px）与 1.5 行高，文字使用公共 `--signal-text` 或 `--muted-text`；链接在编号右侧，组合行垂直居中，两者间距使用 `--inline-gap`，操作区至少 44px。悬浮与键盘聚焦时展开细下划线、轻移箭头，参数读取 `motionTokens.projects`。 |
| 空心序号 | 依已发布项目的展示顺序自动生成 01、02……，位于介绍区底部编号 / 链接组合行的左侧；链接在右侧，与编号垂直居中对齐。保留浅淡水印风格：`--font-year`（Space Grotesk 600）、透明填充、1px 描边（8% `--heading` 与透明色混合）、48–64px 响应字号、1 行高。采用自然 Flex 布局，不绝对定位叠在链接背后；窄屏链接可在右侧自然换行，始终不覆盖编号。设置 `aria-hidden` 与 `pointer-events: none`，两种主题随 Token 同步。 |

卡片不增加重复的品牌 Header、宣传 h3、分类、技术栈或内部 Footer。简介可按项目特点改写，但保留清晰、简短、自然的语气。品牌素材、字体、颜色、原生光标与主题沿用本站资源。

## 项目专属演示

每个项目选择一个最能说明用途的场景，用实际功能组织“输入 → 变化 → 结果”。统一的是演示在卡片中的位置和播放体验；波形、任务、配色、画布或其他表现应随项目功能变化。新项目不复制 DiDa-todo 的语料、任务列表或语音动画。

- 默认在演示可见且页面处于前台时自动循环，无须点击播放；结果阶段留出阅读时间，当前默认停留 3 秒、0.42 秒淡出后重播。特殊时序按产品特点确定，统一写入 `config/motion.ts`。
- 离开视口、进入后台或焦点进入演示控件时暂停；返回后继续。页面切换与组件断开时清理动画、事件和观察器，每个演示实例独立管理状态。
- 中英切换保留播放进度与已产生的交互状态。尊重减少动画偏好，直接提供完整静态结果；无脚本时也能阅读项目与演示结果。
- 不添加默认播放、重播或计时控制栏。必要的真实示例交互可保留，如待办勾选；装饰元素不伪装成可点击按钮。
- 不因展示动画申请麦克风权限、连接项目账户或调用 AI。示例数据需表达为演示，不使用用户本地任务；动态文字保持可读，读屏按语义阶段播报，循环不反复打断。
- 状态切换共享自然占位，避免卡片跳高；演示使用 DOM / CSS / Canvas 和项目已有 Motion，文字与链接保持可编辑和可访问。

DiDa-todo 是当前实现示例：Typeless 风格的深色语音胶囊与白色细波形 → 逐字转写 → AI 整理 → 三条带明确时间的待办。它说明这一项目的语音与 AI 能力，其他项目按自身功能另做演示。

## 新项目接入与验收

1. 收集真实名称、Logo、简介、双语文案与产品 / 源码 URL，按 `projectSchema` 新增 `src/content/projects/` 条目，设置展示顺序与草稿状态。
2. 复用 `ProjectsPage.astro` 和 `projects.css` 的卡片结构；只为项目专属演示新增 feature 组件、文案与动效配置。当前 demo 标识仅有 `dida`，增加新演示时同步 Schema 与页面选择逻辑，不把未知标识当作已支持。
3. 核对明暗主题、双语长文案、桌面两列与手机堆叠、链接与键盘操作、循环及暂停 / 清理、减少动画和无脚本结果。浏览器未实际检查的部分须如实记录。
4. 执行类型、格式检查和生产构建，同步 README、AGENTS 及本地内容 / 架构 / 进度说明；不把测试样例或未部署能力写成正式项目成果。

---

# 17. Skill · 技能卡片设计规范

已落地（2026-10-05）。本次是在既有博客中新增 Skills，方向由用户提供的 HTML 确定；只迁移技能卡片，不替换公共导航、Footer、主题与页面标题。

## 内容与布局

- Skill 替换原 Finder（发现）入口，中文与英文分别使用 `/skill`、`/en/skill`，两者复用同一 feature 页面；标题均为 Skill。Finder 不保留导航、内容集合、路由或别名。
- 页面复用公共 Container，用 Skills 局部宽度将标题与卡片列表作为一个整体居中（宽屏约 782px 内容宽度），从 Header 下沿开始；只保留公共 display 标题与卡片列表，不迁移原型的独立页头、装饰 Hero、计数条与插图规则。
- 桌面与平板两列，单卡最大宽度约 381px，网格限宽为两张卡片加 0.85 倍 item-gap，与标题左边缘对齐，整个内容区在视口内居中；640px 以下单列，内容区整体居中并限宽约 381px；卡片宽度、内边距、间距、圆角、标题与箭头圆底按 448px 版的 0.85 倍收紧，正文维持 14px、辅助信息维持 12px。目前只有用户提供的一个真实 Skill，保留一张卡片，不补虚构条目。
- 一张卡片是一个可访问的完整外链。上方插图保持原有约 1.29 比例，并铺满整个上部区域，随卡片整体等比缩小；下方为名称与圆形箭头、短标题及简介。内容自然增高，英文允许换行，不固定卡片高度或截断文字。 插图上不添加流程胶囊，文字区不显示类别、编号、GitHub 路径、输入 / 输出及能力标签，卡片高度随精简后的内容自然收紧。

## 素材与文字

- 用户 HTML 内嵌 PNG 原样解码到 `src/assets/images/skills/`，保留原图；Astro Image 生成响应式 WebP。原始 HTML 保存在本地 references/skills，仅作来源记录。
- 复用原有插图、GitHub 链接、名称与简介；英文只翻译原文，不扩展功能与身份。正文内容集中在 skills Content Collection，草稿不公开；URL 仅接受 HTTP(S)。
- 蓝黄插图承担视觉主角，保持原色与公共 illustration-canvas 的纸面背景，暗色不反转插图。文字区读取 surface、heading、body、muted-text、signal-text 与 border；薄边框、media 圆角，无持续动画与额外阴影。
- 卡片名称沿用参考的衬线气质，使用本站托管 Newsreader，约 20px；其他文字使用公共 Sans / Mono。简介使用 text-meta，辅助信息不小于 text-micro（12px）；不复制参考的 6–8px 小字。

## 交互与后续接入

- 整卡跳转原 GitHub 仓库，新标签页保留 noopener / noreferrer；仅使用公共 Lucide 箭头表示外链。键盘焦点有明确轮廓，无脚本仍可访问。
- Motion 管理有限入场、箭头轻移与变色、整幅插图缩放和轻微指针视差。旋转幅度沿用参考约 1° 以内，不拆散或重绘原图；只有可悬浮精细指针启用视差。减少动画立即更新反馈并取消位移，切换主题同步颜色，离开页面清理所有运行资源。
- 参数位于 motionTokens.skills。未来每个真实 Skill 添加一个 Markdown 条目和对应原图，维护中英文简介与真实 URL；不为数量补卡片，不添加没有目标的按钮。

---

# 19. Now（历史参考，当前已移除）

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

- Skills two-column card grid
- Essay TOC

## Mobile

Prefer:

- single column
- less chrome
- simplified navigation
- stacked metadata
- Skills single-column cards with readable metadata
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
→ Blog content
```

No general-purpose UI component library is required.

---

# 26. Final Design Sentence

If a design decision is unclear, use this sentence as the filter:

> **Keep the reading experience editorial, the interaction precise, the information calm, and the personality visible through details rather than decoration.**

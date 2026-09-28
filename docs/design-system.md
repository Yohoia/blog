# 公共设计系统

视觉来源为根目录的 `design.md`。本文件记录已落地的公共接口及使用约定；页面构图、内容密度与板块特有交互仍需在制作对应页面时实现。

整体采用安静的编辑式排版：以字体、留白和细线组织内容，文字列表保持透明，强调色只服务链接、焦点与状态；不把每个条目都包装成带背景和阴影的卡片。

## 文件对应

| 文件                        | 职责                                                    |
| --------------------------- | ------------------------------------------------------- |
| `src/styles/tokens.css`     | 明暗主题、语义颜色、字体、字号、宽度、间距和圆角        |
| `src/styles/global.css`     | Tailwind 与字体入口、基础排版、键盘焦点、Shiki 明暗主题 |
| `src/styles/components.css` | 公共 UI、内容行、容器与布局节奏                         |
| `src/styles/prose.css`      | Markdown / MDX 正文排版                                 |
| `src/config/motion.ts`      | 动画时长、位移、缩放和弹簧参数                          |
| `src/config/icons.ts`       | Lucide 图标尺寸和描边                                   |
| `src/scripts/motion.ts`     | 按需调用的入场动画，兼容减少动画偏好                    |
| `src/scripts/theme.ts`      | 主题持久化、系统偏好与跨标签页同步                      |

`BaseLayout` 已引入全局样式与主题初始化。后续页面使用该布局即可接入整套规范，不需重复导入字体或 CSS。

## 颜色

原始视觉值保留在 CSS 变量中，并通过 Tailwind 语义类使用。

| 角色          | 亮色            | 暗色            | 常用类                 |
| ------------- | --------------- | --------------- | ---------------------- |
| Canvas        | `#F6F5F1`       | `#111210`       | `bg-canvas`            |
| Surface       | `#FBFAF7`       | `#171815`       | `bg-surface`           |
| Heading       | `#1B1B18`       | `#F1F0E9`       | `text-heading`         |
| Body          | `#5F5E58`       | `#C4C3BB`       | `text-copy`            |
| Muted         | `#8A8982`       | `#85847D`       | `text-muted`           |
| Border        | Heading 的 12%  | Heading 的 12%  | `border-border`        |
| Border Strong | Heading 的 20%  | Heading 的 20%  | `border-border-strong` |
| Hover Surface | Heading 的 4.5% | Heading 的 5.5% | `bg-hover-surface`     |
| Code Surface  | `#EEEDE8`       | `#1B1C19`       | `bg-code-surface`      |

Signal 为 `#6B8CFF`，Signal Soft 为其 12% 透明度；Live、Warning、Critical 分别为 `#56C596`、`#E2A84A`、`#DF6C75`。这些状态色需配合文字或图标，不能只靠颜色传递信息。

原始浅色 Muted 和 Signal 在 Canvas 上不足以满足小字号文字的 4.5:1 对比度。公共组件因此使用补充的 `text-muted-text`（亮色 `#706F67`，暗色 `#85847D`）和 `text-signal-text`（亮色 `#405DCB`，暗色 `#6B8CFF`）；前者用于元信息，后者用于链接与焦点。原始颜色仍可用于装饰和状态标记。

`bg-background`、`text-foreground`、`text-accent` 保留为语义别名。`text-body` 表示字号，正文颜色使用 `text-copy`，避免类名混淆。

## 字体与层级

Geist Sans 和 Geist Mono 使用 Fontsource 可变字体包，从本站构建产物加载，并采用 `font-display: swap`。正文 Sans 包含正常与斜体；中文依次回退到本机的 Noto Sans SC、苹方、微软雅黑等字体，不依赖外部字体服务。

| 用途       | Tailwind 类    | 字号 / 行高    |
| ---------- | -------------- | -------------- |
| 首页大标题 | `text-display` | 40–48px / 1.15 |
| 页面标题   | `text-page`    | 32–36px / 1.25 |
| 区块标题   | `text-section` | 22–24px / 1.35 |
| 条目标题   | `text-item`    | 17–20px / 1.4  |
| 正文       | `text-body`    | 16–18px / 1.75 |
| 元信息     | `text-meta`    | 14px / 1.5     |
| 小标签     | `text-micro`   | 12px / 1.4     |

字号随视口平滑变化，保留 rem 单位以适应用户字体设置。日期、阅读时间、版本号等可使用 `font-mono`，不要整段使用等宽字体。

长文默认仍使用 Sans。`Prose` 支持 `editorial="serif"`，但目前没有加载 Newsreader、Source Serif 4 或 Noto Serif SC 的字体文件；启用正式衬线方案前须确认中英文搭配，并补充字体资源。

Markdown / MDX 的 Shiki 已配置 `github-light` / `github-dark` 双主题。直接使用 `astro:components` 的 `Code` 时须显式传入 `themes={{ light: 'github-light', dark: 'github-dark' }}`，该组件不会读取 Markdown 的主题配置；公共样式统一代码块背景并响应 `data-theme`。

## 容器与节奏

`Container` 的 `width` 表示内容最大宽度，不含左右内边距。

| width           | 内容宽度 | 建议用途                 |
| --------------- | -------- | ------------------------ |
| `reading`       | 680px    | Writing 详情             |
| `compact`       | 720px    | Fragments、Profile、Now  |
| `index`（默认） | 760px    | Index、Writing 列表      |
| `feature`       | 1080px   | Projects、Finder、News   |
| `wide`          | 1200px   | 需要更多空间的展示       |
| `full`          | 不限制   | 全宽区域，仍保留页面边距 |

移动端边距 20px，视口 ≥768px 时 24px，≥1024px 时 32px。内容不足最大宽度时自动缩小，不固定页面宽度。

间距统一使用 `gap-section` / `py-section`（72–96px）、`gap-group`（32–48px）、`gap-item`（16–24px）、`gap-inline`（8–12px）；`page-stack` 和 `section-content` 已封装相应纵向节奏。局部网格与页头可按内容调整，不强制每个元素套同一间距。

圆角使用 `rounded-xs` / `sm` / `md` / `lg` / `media` / `pill`，对应 4 / 8 / 12 / 18 / 24 / 999px。`rounded-ui` 为 8px，`rounded-card` 为 12px。文本行默认直角且无阴影；`shadow-floating` 只用于需要层级提示的浮层。

## 公共组件

所有组件均为 Astro 组件，支持常用 HTML 属性与 `class` 扩展。

| 组件                 | 接口与用途                                                                    |
| -------------------- | ----------------------------------------------------------------------------- |
| `layout/Container`   | `as` 设置语义元素，`width` 设置内容宽度                                       |
| `layout/Section`     | 可选 `title`、`description`；提供 `id` 时关联区块标题                         |
| `ui/Button`          | `variant="quiet\|outline\|solid"`；默认 button 类型，触摸高度至少 44px        |
| `ui/TextLink`        | `href` 必填，默认中性颜色和细下划线                                           |
| `ui/ExternalLink`    | 外链箭头；`newTab` 显式开启新标签页并补充安全属性及读屏提示                   |
| `ui/Tag`             | `tone="neutral\|live\|warning\|critical"`；细线胶囊，内容需表达状态           |
| `ui/Panel`           | 分组信息；默认透明，`surface` 开启柔和底色                                    |
| `ui/Divider`         | 语义化细分隔线                                                                |
| `ui/ThemeToggle`     | 明暗切换；复用主题脚本，动态更新可访问名称                                    |
| `content/ContentRow` | `href`、`title` 必填，`description`、`meta` 或 `metadata` Slot 可选           |
| `content/Prose`      | 包裹正文渲染结果，设置标题、列表、引用、代码、表格和图片排版                  |
| `common/SkipLink`    | 默认跳至 `#main-content`；使用时主内容须提供对应 id                           |
| `common/Logo`        | Yohoia SVG 首页链接，支持常用 anchor 属性、`class` 和 `--logo-width` 宽度变量 |
| `layout/Header`      | 透明导航、滚动收紧与毛玻璃、指针 / 焦点胶囊高亮、移动端菜单                   |

只含图标的 `Button` 必须传入 `iconOnly` 和 `aria-label`。`ContentRow` 是完整链接，不在内部嵌套链接或按钮。常规页面使用 `SiteLayout` 复用 Header 与 SkipLink；完整公共 Footer 及其他板块组件按后续需求实现。

以下示例仅说明组件组合，不是已实现页面：

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import Prose from '@/components/content/Prose.astro';
import SkipLink from '@/components/common/SkipLink.astro';
---

<BaseLayout title="文章标题">
  <SkipLink />
  <Container as="main" id="main-content" width="reading" class="py-section">
    <h1 class="text-page font-medium">文章标题</h1>
    <Prose class="mt-group">
      <slot />
    </Prose>
  </Container>
</BaseLayout>
```

## 主题、动画与图标

默认跟随系统，用户选择保存在本地。`ThemeToggle` 提供明暗切换；需要恢复系统模式时调用 `setThemePreference('system')`。主题只使用 `data-theme`，不用另一套 class 或 React 状态管理。无 JavaScript 时 CSS 仍跟随系统主题。

Motion 时长采用 micro 150ms、ui 220ms、page 280ms；位移 4 / 8 / 12px，按压缩放 0.98。`reveal(element)` 为明确需要入场效果的 DOM 提供轻微淡入和位移；系统减少动画时只保留 120ms 透明度变化。不默认给所有区块绑定滚动动画。

React 使用 `motion/react`，读取同一组 Token，并使用 `MotionConfig reducedMotion="user"` 或 `useReducedMotion()`；减少动画时关闭位移、布局弹簧与共享元素过渡。CSS 新增动画也必须处理该系统偏好。

Lucide 尺寸统一为 16 / 18 / 20px，描边 1.75。Astro 使用 `stroke-width={iconTokens.strokeWidth}`，React 使用 `strokeWidth={iconTokens.strokeWidth}`。装饰图标加 `aria-hidden="true"`；控件通过可访问名称表达操作，不只显示无标签图标。

`ui/LanguageToggle` 提供当前页面中英版本的切换链接，使用公共按钮样式和 Languages 图标；实际语言由 URL 决定。

## 多语言与 About

右上角 Languages 图标复用公共安静按钮样式，拥有至少 44px 触摸区域；链接名称使用目标语言表达切换操作，Tooltip 与读屏名称一致。导航和页面文字读取翻译字典，代码标识符保持英文。窄于 384px 时 Logo 缩为 112px 并收紧控件间距，为语言、主题和菜单保留触摸区域。

About 使用 compact 容器、公共页面字号和纵向节奏，以文字和细线组织介绍、记录方式、内容方向及网站说明。内容方向在桌面显示两列，移动端单列；返回首页链接保留当前语言。个人履历与联系方式留待真实资料提供。

### 切换时的布局稳定

桌面主导航每项预留 5.5rem 宽度并居中，保持中英文胶囊和位置一致；时钟地名标签与首页次级入口也保留相同占位。HTML 使用 `scrollbar-gutter: stable`，避免两种语言的页面长度不同导致滚动条出现后容器水平移动。

首页标题与介绍、About 标题 / 简介 / 短段落及内容方向说明，使用 `min-block-size` 和 lh 行高单位预留较长译文需要的空间。预留行数在 576px 与 360px 处按现有中英文短文案调整；正文自然增长，不使用固定高度、隐藏溢出或行数截断。修改译文后应重新检查手机换行；长篇文章无需套用短文案预留值。首页英文标题改为与中文语义接近的简短表达，减少不必要的篇幅差异。

语言切换关闭页面转场动画，使用 ClientRouter 保留主题和当前阅读区块的位置，避免整页刷新与回到页首。Logo 在这种切换中直接显示完整字形，正常访问 / 刷新以及悬浮 / 聚焦仍可播放。

## 后续页面制作

导航来源统一为 `config/navigation.ts`：主导航 Writing、Fragments、Projects、Finder、News、About；Now、Profile 为次级入口，站点标识链接到 Index。

品牌 Logo 迁移自 `yohoia-logo-v3`，保留四条轮廓与五段显现轨迹，使用公共 Heading 色及 `currentColor` 响应主题。默认宽度 136px，比例沿用原始 SVG；导航为其保留 48px 内容高度，滚动收紧不会裁切笔迹。复用时可设置 `style="--logo-width: 10rem"`。

Logo 的 Motion 时序独立保存在 `motionTokens.logo`，保留原作约 2.1 秒书写顺序。每次进入 / 手动刷新页面自动播放一次（仅语言切换保持完整字形），鼠标重新进入链接或键盘聚焦时重播，播放中忽略重复触发，不循环。主题切换只改变颜色，不重启书写。系统减少动画时立即显示完整 Logo；未启用 JavaScript 时也有完整静态字形。组件卸载后清理动画和事件监听器，同页多个实例的遮罩与播放互不干扰。

Header 参照 `references/design-html/nav.html`：桌面最大内宽 960px，顶部透明，滚动超过 20px 后收紧并显示毛玻璃与细线；缩小导航时保留文档高度，避免正文跳动。胶囊高亮同时支持指针和键盘焦点，当前位置采用 `aria-current="page"`。小于 896px 时切换为原生 details 菜单，支持 Escape、点击外部关闭，触摸区域至少 44px。位移、高亮和主题图标动画遵循减少动画偏好。

Index 参照 `references/design-html/index.html`：使用 680px 内容窄栏、80px 上下留白、64px 时钟与介绍间距、32px 标题和透明 Recently 列表。左右边距仍使用公共响应式 Token。时钟显示真实 UTC 时间，介绍集中在 `features/index/config.ts`，没有个人资料时使用中性文案；Recently 接入真实内容，不将参考稿示例文章作为已发布数据。

各板块的布局、媒体、侧栏、过滤器和信息密度遵循 `design.md` 对应章节。中英文 Index、About 和导航已实现，其余栏目页与详情页仍待制作。

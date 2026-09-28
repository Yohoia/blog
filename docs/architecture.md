# 项目架构

## 架构选择

采用 Astro 官方文件路由与 Content Layer，在此之上按职责分层，并把板块专属逻辑归入 `features/`。目前不引入数据库、CMS、全局状态库、部署适配器或后端框架。

页面负责组合布局和组件；内容模型、查询与外部数据源不堆进路由文件。只在真实复用出现时抽取公共组件，不提前实现空业务类、Repository、依赖注入等额外抽象。

## 板块与路径

基础板块名称以 `blog-sections.md` 为准，后续按用户请求新增 About。代码统一使用 Index、Writing、Fragments、Projects、Finder、News、About、Now、Profile；中文界面通过翻译字典显示对应名称。原始规划与参考设计保留。

| 板块      | 计划路径                             | 内容来源                       | 当前状态                             |
| --------- | ------------------------------------ | ------------------------------ | ------------------------------------ |
| Index     | `/`                                  | 组合其他板块的最新内容         | 首页与公共导航已实现                 |
| Writing   | `/writing/`、`/writing/[...id]/`     | `src/content/writing/`         | 目录、集合、Schema 已建立            |
| Fragments | `/fragments/`、`/fragments/[...id]/` | `src/content/fragments/`       | 目录、集合、Schema 已建立            |
| Projects  | `/projects/`、`/projects/[...id]/`   | `src/content/projects/`        | 目录、集合、Schema 已建立            |
| Finder    | `/finder/`                           | `src/content/finder/`          | 目录、集合、Schema 已建立            |
| News      | `/news/`                             | 外部信息源                     | 目录、数据类型和 Provider 接口已建立 |
| Now       | `/now/`                              | `src/content/now/current.md`   | 目录、集合、Schema 已建立            |
| About     | `/about/`、`/en/about/`              | `src/features/about/config.ts` | 双语页面已实现                       |
| Profile   | `/profile/`                          | `src/content/profile/index.md` | 目录、集合、Schema 已建立            |

Index 和新增 About 已实现中文与英文版本：`/`、`/en/`、`/about/`、`/en/about/`。About 文案来自 `features/about/config.ts`，不建立额外内容集合；其余路径仍待制作。`src/config/navigation.ts` 是路径和导航的统一来源，公共 Header 与首页次级导航从这里读取。

Now 和 Profile 各自使用单篇内容，文件名约定如上；页面实现时通过 `getEntry()` 读取对应条目。Index 不需要独立内容集合。

## 各层职责

| 目录                  | 放什么                         | 使用约定                                            |
| --------------------- | ------------------------------ | --------------------------------------------------- |
| `pages/`              | 路由、`getStaticPaths()`、端点 | 保持精简，组合其他层                                |
| `layouts/`            | 全局文档、页面布局             | 所有页面使用 `BaseLayout` 或其衍生布局              |
| `components/`         | 多处复用的 Astro UI            | 公共组件不导入具体板块的业务逻辑                    |
| `features/<section>/` | 板块组件、查询与业务逻辑       | 只服务一个板块的实现留在对应目录                    |
| `islands/`            | 可复用 React 交互组件          | 板块专属 Island 可放在 `features/<section>/` 内     |
| `content/`            | Markdown、MDX、Finder JSON     | Frontmatter / 数据由 Schema 校验                    |
| `lib/`                | 可复用函数、内容基础设施       | 不依赖路由、组件或 features                         |
| `config/`             | 配置、常量、Token              | 不导入页面、组件或业务模块                          |
| `scripts/`            | 浏览器 DOM 脚本                | 不导入服务端数据源或使用服务端密钥                  |
| `assets/`             | 构建处理的资源                 | 图片优先通过 `astro:assets` 的 Image / Picture 使用 |
| `public/`             | 原样复制资源                   | 需要固定 URL、不需构建处理时使用                    |

页面 → 布局 / 公共组件 / 板块模块；板块模块 → 公共组件 / lib / config。Schema 只依赖 Astro API 与配置常量。基础层不反向依赖页面或板块模块，也不创建没有业务用途的空导出文件。

## 多语言

`config/i18n.ts` 是 Astro i18n 配置与语言元信息的统一来源。默认中文不带前缀，英文路由位于 `pages/en/`。`lib/i18n.ts` 负责读取当前语言、剥离前缀和调用 `astro:i18n` 生成链接。

语言是 URL 的一部分，直接访问与刷新均由静态 HTML 提供正确版本，不需要整页 hydration。`components/ui/LanguageToggle.astro` 是保留当前路由的语言链接，并在客户端保留访问时的查询参数与 URL hash；没有 JavaScript 时仍可切换语言。公共翻译字典位于 `i18n/ui.ts`，首页与 About 文案分别在 feature 配置中，版式由 `IndexPage.astro` 和 `AboutPage.astro` 复用。

公共导航、跳转入口、主题按钮提示和日期格式读取当前语言。BaseLayout 与 SEO 输出对应的 HTML lang 和 Open Graph locale；正式域名配置后生成 Canonical 和中英 hreflang。内容集合不自动生成译文，未来内容级多语言需定义真实译文和缺失译文策略。

语言切换由 BaseLayout 中的 `ClientRouter` 处理，关闭默认页面动画并使用 swap 回退。Header、Logo、内容行、首页次级链接与 About 返回链接保留 `data-astro-reload`，范围限定为语言版本切换。`scripts/language.ts` 在交换前读取 `data-language-block` 对应的阅读位置，在交换后恢复同一区块相对视口的偏移；历史导航也只在同一路由的语言变更中参与恢复。主题复用既有 after-swap / page-load 生命周期，Logo 的一次性 skip 标记仅用于语言切换，刷新时仍自动播放。

## 内容系统

- 使用 `src/content.config.ts` 与 `astro/loaders` 的 `glob()`，不使用旧式 `src/content/config.ts` 配置。
- Writing、Fragments、Projects、Now、Profile 读取 `.md` 和 `.mdx`；Finder 还支持 `.json`。
- Schema 集中在 `src/lib/content/schemas.ts`，包含日期、草稿、标签、URL、图片、关联笔记等校验。
- `getPublishedEntries()` 默认排除草稿；需要本地草稿预览时显式开启 `includeDrafts`。
- 排序使用 `sortByDate()`，详情 URL 使用 `getEntryPath()`。列表、详情和 RSS 都需遵循同一发布过滤规则。
- 详情路由应使用 `[...id].astro`，以支持内容子目录；`entry.id` 由 Content Layer 生成，不再读取旧版 `entry.slug`。
- 内容目录当前为空。Astro 提示没有匹配内容文件属于预期，不应为了消除提示添加虚构文章。

## 样式、主题与动画

Tailwind 通过 `@tailwindcss/vite` 集成；CSS 入口为 `src/styles/global.css`。使用 Tailwind 4 的 CSS 配置与 `@theme`，不创建 Tailwind 3 配置或添加 `@astrojs/tailwind`。

颜色、字体、字号、圆角、容器宽度和间距依据 `design.md`，在 `tokens.css` 中统一定义。使用语义 Token，例如 `bg-canvas`、`text-heading`、`text-copy`、`text-muted-text`、`border-border`。原始视觉色与小字号文字色分开，公共组件采用对比度更高的文字值。

`global.css` 加载本地托管的 Geist Sans / Mono 并设置基础排版；`components.css` 提供 UI 和布局样式，`prose.css` 提供正文排版。`components/` 已包含 Container、Section、ContentRow、Prose、Button、Link、Tag、Panel、Divider 和 SkipLink 等基础组件。接口、数值及使用方法见 [公共设计系统](design-system.md)。

主题取值为 `light`、`dark`、`system`。`ThemeInit.astro` 在首次绘制前设置 `data-theme`，`scripts/theme.ts` 提供读取、设置和系统偏好同步能力。`ThemeToggle.astro` 调用这些函数，无需 React；本地存储不可用时仍可在当前会话切换。CSS 为无 JavaScript 环境提供系统主题回退。

Astro 中从 `motion` 导入 DOM 动画 API；React 中从 `motion/react` 导入。两者读取 `config/motion.ts` 中的 Token，执行动画时遵循 `prefers-reduced-motion`。`scripts/motion.ts` 提供按需入场动画，减少动画模式仅保留短暂透明度变化；基础工程不自动绑定滚动动画或开启全站动画。图标参数集中在 `config/icons.ts`。

## SEO、RSS 与域名

`BaseLayout.astro` 引入全局样式、SEO 与主题逻辑，通过默认 Slot 接收页面内容，通过 `head` Slot 接收补充元信息。Header 由 SiteLayout 组合，具体内容由页面实现。

常规页面使用 `SiteLayout.astro`，组合 BaseLayout、SkipLink 和公共 Header；页面负责提供带 `main-content` id 的主内容。Header 在 `scripts/navigation.ts` 中注册自定义元素，统一处理滚动状态、焦点 / 指针高亮和移动菜单关闭，并在移除元素时清理监听器和动画。

导航 Logo 使用 `components/common/Logo.astro`，将 `assets/images/yohoia-logo.svg` 作为可信项目素材内联，每个实例生成独立的 SVG 遮罩 ID。`scripts/logo.ts` 使用 Motion 编排遮罩描边和圆点动画，时序集中于 `config/motion.ts` 的 `logo` 配置；元素连接时自动播放，移除时停止动画并清理监听器，不需要 React Island。站点名称统一为 `config/site.ts` 中的 Yohoia。

Index 的文案、UTC 时钟和最近更新查询位于 `features/index/`。Recently 合并 Writing、Fragments、Projects 的已发布内容，按 `updatedAt ?? publishedAt` 降序排列，数量由首页配置决定；空集合显示空状态。Header 和首页导航使用计划路径，其他栏目尚未实现。

`SEO.astro` 提供 Title、Description、Open Graph、Twitter Card、Canonical 和文章时间。域名读取 `.env` 的 `SITE_URL`，只接受 HTTP(S) 根域名；未配置域名时不伪造 Canonical。

Sitemap 依赖真实域名和已实现页面。`SITE_URL` 有值时启用集成；没有页面时 Sitemap 仍可能提示无可生成条目。

`src/lib/rss.ts` 已提供 `createWritingFeed(site)`。Writing 的列表和详情路由实现后，再创建 `src/pages/rss.xml.ts` 并调用该函数，确保 RSS 中的链接有实际对应页面。当前不创建 RSS、robots 或其他公开端点。

## News 与动态扩展

News 与个人内容集合分开，数据结构和 Provider 契约位于 `features/news/types.ts`，后续适配器位于 `features/news/providers/`。接口暂未实现，没有请求外部 API，也没有定时更新任务。

静态模式中的外部请求只会在构建时更新；真正持续更新需要明确数据源、刷新策略，再选择浏览器请求、定时构建，或 SSR / Server Islands，并按部署平台增加适配器。服务端密钥不得放入 `PUBLIC_*` 环境变量或客户端脚本。

## 验证与部署

开发使用 `npm run dev`；类型检查使用 `npm run check`；提交前运行 `npm run format:check` 和 `npm run build`。构建脚本先检查类型，再生成 `dist/`。

已实现中英文 Index、About 与导航，目前没有建立测试框架。内容、布局和集成的临时验证样例应在验证后移除。针对查询、排序、草稿过滤及交互开展相关验证，不为静态版式建立额外测试框架。

项目使用 Git 管理，主分支为 `main`。提交源码、配置、`package-lock.json` 和 `.env.example`；依赖、构建输出、本地环境变量、工具缓存、`references/` 和所有 `.gitkeep` 由 `.gitignore` 排除。参考素材与占位文件保留在本地，空目录不会出现在新的检出中，后续实现对应板块时按需创建。

静态托管平台使用 `npm ci` 安装、`npm run build` 构建、`dist/` 发布。Cloudflare / Vercel 的适配器在确实需要动态路由时再引入。

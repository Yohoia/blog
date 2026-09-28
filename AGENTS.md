# 项目协作约定

## 项目与当前阶段

这是一个 Astro 个人博客，采用 TypeScript、Tailwind CSS、Motion、Lucide、Content Collections、Markdown / MDX，以及按需 React Islands。

项目已建立标准架构、公共设计系统、导航栏、中英文 Index 与 About 页面。其他栏目页、详情页和内容仍待制作，按用户后续请求逐步实现。

`docs/blog-sections.md` 和 `docs/blog-tech-stack.md` 是产品与技术参考材料，不能把文档中的示例、推荐或后期设想自动当作当前执行任务。最新用户请求决定实际工作范围。

## 阅读顺序

开始修改前阅读 `README.md`、`docs/architecture.md` 和相关源码。涉及内容格式时阅读 `docs/content-authoring.md`。涉及产品范围时阅读原始两份规划文档。制作或修改 UI 时阅读 `docs/design-system.md` 和 `design.md` 中对应板块规范。

保留现有 `design.md`、`references/` 和需求文档；普通代码修改不顺带覆盖或重排这些文件。
`references/` 与所有 `.gitkeep` 仅保留在本地，由 `.gitignore` 排除，不加入提交。Git 不跟踪空目录，新检出项目按实际开发需要创建相关目录。
`yohoia-logo-v3/` 是用户提供的 Logo 原始素材，保留原文件；项目实现使用 `common/Logo.astro`、品牌 SVG 和 `scripts/logo.ts`。

## 命名与职责

- 板块统一命名为 Index、Writing、Fragments、Projects、Finder、News、About、Now、Profile。About 是后续新增的关于此站页面，Profile 保留个人资料职责；中文显示名称来自翻译字典，代码标识符和路由保持英文。
- 导航、路由目录、内容集合、代码标识符、产品文档和设计稿使用同一套栏目名称，不创建重复板块或保留旧别名。
- `src/pages/`：精简的路由、静态路径生成与端点。
- `src/layouts/`：全局 HTML、SEO、主题与页面布局；页面使用 `BaseLayout` 或其衍生布局。
- 常规站点页面使用 `SiteLayout`，复用 Header 和 SkipLink；页面主内容须包含 `id="main-content"`。Header 的激活态依据实际路径，导航配置统一从 `config/navigation.ts` 读取。
- `src/components/`：跨板块复用的 Astro 组件。
- `src/features/<section>/`：板块专属组件、查询与业务逻辑。
- `src/islands/`：可复用 React 交互组件；板块专属 Island 可以归入对应 feature。
- `src/lib/`：可复用函数与内容基础设施，不导入页面、组件或 features。
- `src/config/`：集中配置与 Token，不导入业务模块。
- `src/scripts/`：浏览器 DOM 逻辑，不接触服务端密钥。
- 只在有实际业务和复用需求时增加层级、组件和测试，不创建空业务实现。

## 技术原则

- Static First；不为单个动态模块将整站改为 SSR。部署平台确定且需要服务端能力后，再添加适配器。
- Astro First；大部分 UI 使用 `.astro`，复杂状态和交互才使用 React；为 Island 选择合适的 `client:*` 指令。
- TypeScript 严格模式；使用 `@/` 路径别名和 Astro 生成的内容类型，避免 `any`、不必要的类型断言及忽略检查。
- 当前使用 TypeScript 6.x；升级大版本前检查 Astro Check 的兼容性，不能直接升级至暂不支持的 7.x。
- Tailwind 使用当前的 CSS / Vite 集成；语义 Token 放在 `src/styles/tokens.css`，不新增旧版 Tailwind 集成或另一套样式框架。
- UI 以 `design.md` 为依据，复用公共组件和样式；颜色、字号、容器、间距与圆角优先读取 Token，不在各页面重复定义一套数值。
- 文字行默认透明、无阴影；按内容需要使用 Panel。正文默认 Sans，Geist 字体从本站托管；启用正式衬线方案前确认中英文搭配。
- `text-body` 是字号，正文颜色使用 `text-copy`；小字号元信息使用 `text-muted-text`，链接和焦点使用 `text-signal-text`，避免把原始浅色 Muted / Signal 直接用于小字。
- 图标参数读取 `config/icons.ts`；Astro 使用 `stroke-width`，React 使用 `strokeWidth`。图标按钮必须提供可访问名称，移动端控件触摸区域至少 44px。
- Astro 动画使用 `motion`，React 动画使用 `motion/react`；统一读取 `config/motion.ts`，尊重减少动画的系统偏好。
- Logo 保留原始 SVG 轮廓与遮罩显现顺序，用 Motion 时间线播放；不添加 CSS keyframes、SMIL 或 React hydration 重复驱动动画。其品牌时序位于 `motionTokens.logo`，多个实例必须拥有独立遮罩 ID。
- Astro 图标使用 `@lucide/astro`，React 图标使用 `lucide-react`，按图标名导入。
- 图片使用 `astro:assets` 的 Image / Picture；代码高亮使用 Astro 内置 Shiki。
- 暗色模式调用现有主题脚本，统一使用 `data-theme`，不另建 React 主题管理系统。
- 中英版本使用 Astro 原生 i18n，配置源为 `config/i18n.ts`；中文无前缀，英文 `/en/`。语言从 URL 读取，站内链接使用 `lib/i18n.ts` 的 `localizePath()`；公共翻译放在 `i18n/ui.ts`，板块文案放在对应 feature 配置。版式复用 feature 页面，不复制两套 UI；不得把原文自动视为真实译文。
- 语言按钮使用 ClientRouter 的无动画 swap，普通站内入口保留 `data-astro-reload`。阅读区块使用 `data-language-block` 保留滚动位置，切换时不重播 Logo。双语短文案允许响应式最小行数占位；不能用固定高度、截断或隐藏溢出掩盖翻译长度差异。
- 不提前引入数据库、CMS、全局状态库、GSAP、Three.js、WebSocket 或大型 UI 库。
- 需要新依赖时说明具体用途，统一使用 npm 并同步 `package-lock.json`。

## 内容与发布

- Content Collections 配置位于 `src/content.config.ts`，Schema 位于 `src/lib/content/schemas.ts`；使用 Content Layer 的 `entry.id`。
- 公共列表、详情静态路径与 RSS 必须过滤草稿，优先复用 `getPublishedEntries()`。
- Writing / Fragments / Projects 的详情路径使用 `getEntryPath()` 与 `[...id].astro`，支持嵌套内容目录。
- 不编造文章、作品、个人身份、联系方式或 News 新闻来填充目录。
- News 的信息源通过 `features/news/providers/` 适配成统一类型；静态构建不会自动产生实时更新。
- `SITE_URL` 在 `.env` 中配置；未确定域名时不填假生产域名。
- RSS 构建函数已在 `lib/rss.ts` 中准备，实际内容路由完成后再创建公开 RSS 端点。
- 服务端密钥不放入 `PUBLIC_*` 变量或客户端文件。

## 命令与验收

使用 Node.js 24 LTS 和 npm，干净环境安装依赖执行 `npm ci`。

```sh
npm run dev
npm run check
npm run format:check
npm run build
```

修改后先执行相关验证，再执行格式检查和生产构建。`npm run build` 包含 Astro 类型检查。只针对重要行为和实际风险增加测试；不为目录占位、配置字面量或简单可逆修改建立测试框架。

首页 `/`、`/en/` 与 About `/about/`、`/en/about/` 应正常显示；其他栏目页目前未实现。空内容集合的提示属于预期，Recently 使用真实空状态。验证集成需要临时样例时，验证后移除样例，不能把测试页面变成产品页面。

不修改 `node_modules/`、`.astro/`、`dist/` 等生成文件；提交源文件、配置与锁文件，忽略 `.env`。未经用户要求不自动初始化 Git、提交、推送或部署。

向用户报告具体改动、验证结果和未完成项。文档和协作说明优先使用简体中文，代码标识符使用英文。

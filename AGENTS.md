# 项目协作约定

## 项目与当前阶段

这是一个 Astro 个人博客，采用 TypeScript、Tailwind CSS、Motion、Lucide、Content Collections、Markdown / MDX，以及按需 React Islands。

项目已建立标准架构、公共设计系统、导航栏、中英文 Index 与 Writing 列表。其他栏目页、详情页和内容仍待制作，按用户后续请求逐步实现。

403、404、500、502 中英文错误页面已实现，共用 `features/errors/ErrorPage.astro` 与配置；插图原件保留在 `public/images/`。

`docs/` 中的规划与说明是本地参考材料，不随 Git 上传；不能把文档中的示例、推荐或后期设想自动当作当前执行任务。最新用户请求决定实际工作范围。

## 阅读顺序

开始修改前阅读 `README.md` 和相关源码。制作或修改 UI 时阅读 `design.md` 中对应板块规范，并检查公共组件与 `src/styles/`。本地存在 `docs/` 时，可按需阅读架构、内容编写、设计系统及规划文档；新检出缺少这些本地材料时，以 README、协作约定和源码为依据。

保留现有 `design.md`、`docs/` 和 `references/`；普通代码修改不顺带覆盖或重排这些文件。
`docs/`、`references/` 与所有 `.gitkeep` 仅保留在本地，由 `.gitignore` 排除，不加入提交。Git 不跟踪空目录，新检出项目按实际开发需要创建相关目录。
`yohoia-logo-v3/` 是用户提供的 Logo 原始素材，保留原文件；项目实现使用 `common/Logo.astro`、品牌 SVG 和 `scripts/logo.ts`。

## 命名与职责

- 板块统一命名为 Index、Writing、Fragments、Projects、Finder、News、Now；中文显示名称来自翻译字典，代码标识符和路由保持英文。
- 导航、路由目录、内容集合、代码标识符、产品文档和设计稿使用同一套栏目名称，不创建重复板块或保留旧别名。
- `src/pages/`：精简的路由、静态路径生成与端点。
- `src/layouts/`：全局 HTML、SEO、主题与页面布局；页面使用 `BaseLayout` 或其衍生布局。
- 常规站点页面使用 `SiteLayout`，复用 Header 和 SkipLink；页面主内容须包含 `id="main-content"`。Header 的激活态依据实际路径，导航配置统一从 `config/navigation.ts` 读取。
- Header 的 Logo 与操作按钮分置视口两侧，以公共 Gutter 和 4vw / 64px 上限保留边距；桌面与移动端统一使用 Type Overlay 菜单入口，右侧按钮依次为菜单、中英切换、主题。窄屏适当缩小 Logo，所有图标按钮保持至少 44px，不恢复横向桌面导航或仅限移动端的菜单。
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
- 全屏导航使用 `components/layout/TypeOverlayMenu.astro` 与 `scripts/type-overlay-menu.ts`，原生 `dialog` 提供顶层显示、焦点约束和背景 inert，Tailwind 与公共 Token 定义布局、固定黑色背景和大字号。Motion 从菜单图标中心圆形展开，链接逐项淡入并上移，悬浮和聚焦时右移；参数统一来自 `motionTokens.menu`。支持 Escape、关闭按钮、动画中途关闭、减少动画和无脚本折叠菜单。打开时只锁定根节点滚动，保留页面的滚动条占位，补偿 dialog 的起点并用实际视口像素设置宽高，避免 `100vw` 被占位缩小，关闭时恢复阅读位置；不要修改 body 的 overflow 或边距，否则会改变 sticky 导航的参照并造成跳动。菜单内部使用公共 `scrollbar-hidden` 隐藏滚动条外观，保留内容滚动。页面替换、离开和断开连接时清理动画及滚动锁。不引入 React hydration 或额外动画库，不迁移参考稿中的旧栏目名。
- Logo 保留原始 SVG 轮廓与遮罩显现顺序，用 Motion 时间线播放；不添加 CSS keyframes、SMIL 或 React hydration 重复驱动动画。其品牌时序位于 `motionTokens.logo`，多个实例必须拥有独立遮罩 ID。
- 首页介绍沿用参考稿内容与播放节奏：Astro 输出完整内容，Motion 驱动打字与光标，参数位于 `motionTokens.terminal`。按用户最新要求直接平铺在页面中，使用公共容器、颜色和明暗主题，不添加终端窗口外框、标签栏、状态栏或内部滚动。仅浏览器刷新自动播放，直接访问、站内跳转与历史返回立即展示完整内容；`scripts/page-visit.ts` 结合 Navigation Timing 与 ClientRouter 生命周期判断，不能只检查 Navigation Timing 后在客户端返回时重复播放。语言切换保留当前播放进度、访问时间和页面阅读位置；播放结束后，末尾空提示符的光标继续闪烁；仅在光标可见且页面处于前台时运行，移出视口、进入后台、离开或断开连接时停止，返回后恢复。进入历史缓存前完成内容，减少动画模式立即展示完整内容并保持光标常亮。Logo 的自动播放也仅在刷新时触发，保留悬浮与聚焦重播。
- 首页内容区相对视口居中，正文左对齐，从 Header 下沿开始排布，不额外预留顶部组间距；各部分使用公共边框颜色的 1px 横线分隔，横线上下各 12px，避免恢复原先 32–48px 的大组间距。中英文首页与 Writing 页面通过 `BaseLayout` 的 `hideScrollbar` 属性隐藏根滚动条并取消其占位，保留自然滚动；其他页面保留对称的滚动条占位，保持内容与导航的中心一致。
- 首页提示符的用户名用绿色，主机名用蓝色，光标为柔和绿色；颜色读取公共 Token，并保留浅色主题的文字对比度。命令匀速逐字输入，输出按语义行依次淡入；当前行数与输出阶段也要纳入语言切换快照。输出过程中隐藏下一条空提示符，等整部分输出完毕后再显示分隔线与下一条提示符。每条命令开始时从可见相位重新闪烁，等待下一条输入时保持光标可见；历史命令行不复制光标。
- `whoami` 右侧使用 `features/index/PixelAvatar.astro`，原始头像与 64×64 圆点 SVG 保留在 `src/assets/images/`。首轮聚合从第一行信息开始，与完整输出同步结束；下一部分等待文字和头像都完成。`scripts/pixel-avatar.ts` 使用一个 Motion 时钟驱动 Canvas，参数来自 `motionTokens.avatar`，配色读取公共 Token，完成后保留 Canvas 最后一帧并停止动画，避免 Canvas / SVG 交接造成细点闪变。语言切换保存头像进度，离开页面清理动画和观察器；静态访问、减少动画或无脚本时显示完整 SVG。桌面端默认 144px，隐藏的 identity 行提前保留完整文字高度，聚合开始前同步头像尺寸；手机端使用 128px / 100px，保持命令全宽。不要在逐行输出结束时才测量和缩放头像，不要恢复过大的头像导致左侧底部空白，也不要把本地 HTML 原型的调试控件加入首页。
- 通用界面图标使用 `@lucide/astro` 或 `lucide-react`，按图标名导入。用户明确要求社交渠道使用对应品牌图标，首页 Gmail、QQ、X、小红书、Bilibili、GitHub、微信与 Telegram 使用本地 Simple Icons SVG；来源提交与 CC0 许可位于 `src/assets/icons/social/`，由 Astro 内联并沿用公共尺寸和颜色，不引入远程运行时或徽章样式。
- 图片使用 `astro:assets` 的 Image / Picture；代码高亮使用 Astro 内置 Shiki。
- 错误页按用户要求使用 `BaseLayout` 的独立全屏布局，不显示 Header、Logo、导航或顶部操作区；插图与简短说明在整个视口居中、保持比例，保留返回首页入口。原图保留在 `public/images/`，仅供服务端使用的 `features/errors/images.ts` 静态导入图片，由 `astro:assets` 生成响应式 WebP；不要把公共路径字符串当成已优化的图片，也不要从客户端文案配置导入图片模块。原图的深色字样用公共 `--illustration-canvas` 纸色底保证暗色可辨认，主题继承现有脚本。错误页设为 `noindex` 并从 Sitemap 排除；`404.astro` 是未知地址的兜底入口。静态托管只回传根错误文件时，`scripts/error-page.ts` 从实际 URL 同步文案与返回首页链接的语言。不能把静态预览路由当作已部署的服务器错误拦截；真正的 403 / 500 / 502 由托管服务器绑定，Nginx 示例位于 `deploy/nginx-errors.conf`。
- 站内链接保持目录尾部斜杠；Astro 使用 `trailingSlash: 'ignore'` 接受两种输入，保证无斜杠的未知地址也由自定义 404 接管，不能恢复会让静态预览提前返回默认错误页的严格匹配。
- 暗色模式调用现有主题脚本，统一使用 `data-theme`，不另建 React 主题管理系统。
- 中英版本使用 Astro 原生 i18n，配置源为 `config/i18n.ts`；中文无前缀，英文 `/en/`。语言从 URL 读取，站内链接使用 `lib/i18n.ts` 的 `localizePath()`；公共翻译放在 `i18n/ui.ts`，板块文案放在对应 feature 配置。版式复用 feature 页面，不复制两套 UI；不得把原文自动视为真实译文。
- 语言按钮使用 ClientRouter 的无动画 swap，普通站内入口保留 `data-astro-reload`。全屏菜单的栏目链接与 Header Logo 是例外：`data-navigation-transition` 标记后由 `scripts/navigation-transition.ts` 调用 ClientRouter，先用 Motion 驱动全屏 Canvas 字符噪声网格，完全覆盖后交换页面，再用同一网格退场。菜单控制器在完全覆盖后关闭 dialog；Logo 点击由公共脚本委托处理，普通 Logo 组件的其他实例不自动接入。`common/NavigationTransition.astro` 在 BaseLayout 中以顶层 Popover 持久化，覆盖原生 dialog；颜色与字体读取公共 Token，参数位于 `motionTokens.navigationTransition`。动画只用于不同栏目切换和从其他页面点击 Header Logo 返回首页，不用于语言、正文链接、当前栏目、刷新或历史返回；保留修饰键和无脚本链接行为，减少动画或不支持 Popover 时普通跳转，结束/离开后停止时钟与释放画布。不能同时叠加浏览器 View Transition 快照动画，也不能把尚未实现的栏目包装为已完成页面。
- 主动切换语言时，阅读区块使用 `data-language-block` 保留滚动位置，不重播 Logo；历史前进 / 后退由 ClientRouter 恢复目标记录的滚动位置，不能用离开页面的位置覆盖历史记录。双语短文案允许响应式最小行数占位；不能用固定高度、截断或隐藏溢出掩盖翻译长度差异。
- 导航在 `astro:after-swap` 和 `astro:page-load` 后，通过微任务重新读取恢复后的滚动位置并同步背景与收紧状态。菜单当前栏目由实际路径输出 `aria-current`。不能仅依赖元素连接时的滚动位置或 `scroll` 事件：首页播放内容在替换期间会短暂收起，恢复到原位置时浏览器可能不再触发滚动事件。生命周期监听随导航断开一起清理。
- 不提前引入数据库、CMS、全局状态库、GSAP、Three.js、WebSocket 或大型 UI 库。
- 需要新依赖时说明具体用途，统一使用 npm 并同步 `package-lock.json`。

## 内容与发布

- Content Collections 配置位于 `src/content.config.ts`，Schema 位于 `src/lib/content/schemas.ts`；使用 Content Layer 的 `entry.id`。
- 公共列表、详情静态路径与 RSS 必须过滤草稿，优先复用 `getPublishedEntries()`。
- Writing / Fragments / Projects 的详情路径使用 `getEntryPath()` 与 `[...id].astro`，支持嵌套内容目录。
- 不编造文章、作品、个人身份、联系方式或 News 新闻来填充目录。
- 姓名和联系方式统一读取 `config/site.ts`。首页使用 `pr -2 -t links.md` 与 `features/index/TerminalContacts.astro`，左侧 Email、QQ、X、小红书，右侧 Bilibili、GitHub、微信、Telegram，各四个。邮箱为 `imyohoia@gmail.com`，微信号码为 `13870096885`（点击复制），TG 为 `@Yohoia`（`https://t.me/Yohoia`）；渠道、标签、复制值和目标 URL 集中在 `siteConfig.contactLinks`，刷新播放时每行同时展示两列，不恢复 LinkedIn、简历或旧邮箱。首页公司、履历与统计经用户明确要求暂留参考内容，集中在 `features/index/config.ts`，不能自动视为真实个人资料或已接入的数据；待用户提供资料后替换。
- 首页文章区使用用户确认的 `yohoia@space:~$ ls -ltr writing/ | tail -n 6`，用户名和文件所有者来自 `siteConfig.name`。参考文章集中在 `features/writing/config.ts`，按日期由旧到新排列，同日沿用用户提供顺序；首页取末尾 6 条，Writing 列表显示全部 9 条并按新到旧排列。`Writing — full blog` 跳转到对应语言的本站列表，文件名定位列表条目。保留逐行播放、响应式换行与语言切换进度；参考记录没有正文，不能视为本站已发布文章或已实现的阅读器。
- 首页文章输出不显示 `total 6 posts`；底部入口仅在 `Writing` 文字下显示虚线，`— full blog` 无下划线，整段入口保持可点击。
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

首页 `/`、`/en/`、Writing `/writing/`、`/en/writing/` 应正常显示；其他栏目页目前未实现。空内容集合的提示属于预期。首页当前展示平铺介绍，已移除原 Recently 模块。验证集成需要临时样例时，验证后移除样例，不能把测试页面变成产品页面。

不修改 `node_modules/`、`.astro/`、`dist/` 等生成文件；提交源文件、配置与锁文件，忽略 `.env`。未经用户要求不自动初始化 Git、提交、推送或部署。

向用户报告具体改动、验证结果和未完成项。文档和协作说明优先使用简体中文，代码标识符使用英文。

# 项目协作约定

## 项目与当前阶段

这是一个 Astro 个人博客，采用 TypeScript、Tailwind CSS、Motion、Lucide、Content Collections、Markdown / MDX，以及按需 React Islands。

项目已建立标准架构、公共设计系统、导航栏、中英文 Index、Writing 列表、文章详情模板与 News。Writing 已接入一篇用户提供的机器学习案例文档；其他栏目页和用户自己的正式文章仍待制作，按用户后续请求逐步实现。

进度同步日期：2026-09-30。About、Profile 已按用户要求移除导航、路由和相关信息，不属于当前待制作栏目。现有菜单为 Index、Writing、Fragments、Projects、Finder、News、Now；Fragments、Projects、Finder、Now 仍是计划入口，访问时进入自定义 404；News 已接入 AIHOT API。

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
- Header 的 Logo 与操作按钮分置视口两侧，水平边距为 `clamp(1rem, 3vw, 3rem)`；桌面与移动端统一使用 Type Overlay 菜单入口，右侧按钮依次为菜单、中英切换、主题。Header 使用公共 `--header-surface`、`--header-blur` 与 `--header-saturation` 提供磨砂背景，保留在普通文档流中随页面自然滚动；不添加滚动收紧、固定、淡出或额外 Motion 动画。桌面垂直边距为 1rem，窄屏为 0.75rem；窄屏适当缩小 Logo，所有图标按钮保持至少 44px，不恢复横向桌面导航或仅限移动端的菜单。
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
- 公共鼠标样式由 `styles/cursors.css` 和 `assets/cursors/` 的原生 SVG 提供，读取 `--cursor-default`、`--cursor-interactive`；暗色主题与固定黑色的全屏菜单共用 `--cursor-on-dark`，菜单在局部覆盖默认光标，不改变页面主题。仅对可悬浮的精细指针启用：普通区域是 18px 实心箭头（亮色主题黑色、暗色主题浅色，均无描边），24px 浅黄色圆形（填充不透明度 55%）仅用于链接、按钮、菜单及 Writing 文章 / 标签的悬浮反馈，移开后恢复箭头。通过 CSS :hover 实现，不增加点击或 :active 触发，保留文本输入和禁用状态光标；静态参考文章不增加虚构链接。不引入 DOM 光标、持续跟随时钟或重复事件监听。
- 全屏导航使用 `components/layout/TypeOverlayMenu.astro` 与 `scripts/type-overlay-menu.ts`，原生 `dialog` 提供顶层显示、焦点约束和背景 inert，Tailwind 与公共 Token 定义布局、固定黑色背景和大字号。Motion 从菜单图标中心圆形展开，链接逐项淡入并上移，悬浮和聚焦时右移；参数统一来自 `motionTokens.menu`。支持 Escape、关闭按钮、动画中途关闭、减少动画和无脚本折叠菜单。打开时只锁定根节点滚动，保留页面的滚动条占位，补偿 dialog 的起点并用实际视口像素设置宽高，避免 `100vw` 被占位缩小，关闭时恢复阅读位置；不要修改 body 的 overflow 或边距，否则会改变 sticky 导航的参照并造成跳动。菜单内部使用公共 `scrollbar-hidden` 隐藏滚动条外观，保留内容滚动。页面替换、离开和断开连接时清理动画及滚动锁。不引入 React hydration 或额外动画库，不迁移参考稿中的旧栏目名。
- Logo 保留原始 SVG 轮廓与遮罩显现顺序，用 Motion 时间线播放；不添加 CSS keyframes、SMIL 或 React hydration 重复驱动动画。其品牌时序位于 `motionTokens.logo`，多个实例必须拥有独立遮罩 ID。
- 首页介绍沿用参考稿内容与播放节奏：Astro 输出完整内容，Motion 驱动打字与光标，参数位于 `motionTokens.terminal`。按用户最新要求直接平铺在页面中，使用公共容器、颜色和明暗主题，不添加终端窗口外框、标签栏、状态栏或内部滚动。仅浏览器刷新自动播放，直接访问、站内跳转与历史返回立即展示完整内容；`scripts/page-visit.ts` 结合 Navigation Timing 与 ClientRouter 生命周期判断，不能只检查 Navigation Timing 后在客户端返回时重复播放。语言切换保留当前播放进度、访问时间和页面阅读位置；播放结束后，末尾空提示符的光标继续闪烁；仅在光标可见且页面处于前台时运行，移出视口、进入后台、离开或断开连接时停止，返回后恢复。进入历史缓存前完成内容，减少动画模式立即展示完整内容并保持光标常亮。Logo 的自动播放也仅在刷新时触发，保留悬浮与聚焦重播。
- 首页内容区相对视口居中，正文左对齐，从 Header 下沿开始排布，不额外预留顶部组间距；各部分使用公共边框颜色的 1px 横线分隔，横线上下各 12px，避免恢复原先 32–48px 的大组间距。中英文首页与 Writing 页面通过 `BaseLayout` 的 `hideScrollbar` 属性隐藏根滚动条并取消其占位，保留自然滚动；其他页面保留对称的滚动条占位，保持内容与导航的中心一致；原生滚动条轨道使用画布色，随主题同步更新。
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
- 菜单当前栏目由实际路径输出 `aria-current`。Header 随文档自然滚动，不再监听滚动位置；语言切换和历史导航仍由 ClientRouter 恢复各页面的阅读位置。菜单与栏目过渡各自管理生命周期清理。
- 不提前引入数据库、CMS、全局状态库、GSAP、Three.js、WebSocket 或大型 UI 库。
- 需要新依赖时说明具体用途，统一使用 npm 并同步 `package-lock.json`。

## 内容与发布

- Content Collections 配置位于 `src/content.config.ts`，Schema 位于 `src/lib/content/schemas.ts`；使用 Content Layer 的 `entry.id`。
- 公共列表、详情静态路径与 RSS 必须过滤草稿，优先复用 `getPublishedEntries()`。
- Writing / Fragments / Projects 的详情路径使用 `getEntryPath()` 与 `[...id].astro`，支持嵌套内容目录。
- 不编造文章、作品、个人身份、联系方式或 News 新闻来填充目录。
- 姓名和联系方式统一读取 `config/site.ts`。首页使用 `pr -2 -t links.md` 与 `features/index/TerminalContacts.astro`，左侧 Email、QQ、X、小红书，右侧 Bilibili、GitHub、微信、Telegram，各四个。邮箱为 `imyohoia@gmail.com`，微信号码为 `13870096885`（点击复制），TG 为 `@Yohoia`（`https://t.me/Yohoia`）；渠道、标签、复制值和目标 URL 集中在 `siteConfig.contactLinks`，刷新播放时每行同时展示两列，不恢复 LinkedIn、简历或旧邮箱。首页公司、履历与统计经用户明确要求暂留参考内容，集中在 `features/index/config.ts`，不能自动视为真实个人资料或已接入的数据；待用户提供资料后替换。
- 首页文章区使用用户确认的 `yohoia@space:~$ ls -ltr writing/ | tail -n 6`，用户名和文件所有者来自 `siteConfig.name`。参考文章集中在 `features/writing/config.ts`，按日期由旧到新排列，同日沿用用户提供顺序；首页取末尾 6 条，Writing 列表显示全部 9 条并按新到旧排列。`Writing — full blog` 跳转到对应语言的本站列表，文件名定位列表条目。保留逐行播放、响应式换行与语言切换进度；参考记录没有正文，不能视为本站已发布文章或已实现的阅读器。
- Writing 列表采用 `writing-preview.html` 的期刊式归档结构，按当前参考记录 publishedAt 的年 / 月 / 日从新到旧分组，使用 UTC 计算日期与星期，避免部署时区改变日期；同日维持现有顺序。内容从 Header 下沿开始，删除介绍段和顶部统计；年份采用 Space Grotesk 600 字重的浅色描边数字，读取公共 --font-year；Writing 页面单独导入 @fontsource/space-grotesk/latin-600.css，从本站加载字体，月份侧栏与每行日期 / 星期组成时间线，文章行保持透明。标题与文件名按用户要求单行省略，DOM 与 title 属性保留完整文本；黄色标题色带固定 0.72em 高度，Motion 只动画 --writing-highlight-progress 的横向数值，不能插值混合 px / em 的 background-size 高度。日期数字、星期与标签统一读取 text-meta 字号与行高（默认 14px / 21px），继承相同字重；日期圆底尺寸跟随行高，标签不添加改变文字对齐的底部留白。每条最多展示三个按标题分类的 `#` 标签，由 Motion 驱动颜色与下划线。箭头固定在文章行最右侧，默认浅色，悬浮时蓝色圆底缩放显现并轻移箭头。交互使用 `scripts/writing.ts`、`motionTokens.writing` 与公共 Token，尊重减少动画偏好，主题改变时同步颜色；手机端日期与标签允许自然换行，月份移至文章上方。没有正文的参考条目保持静态文章结构，不创建占位详情链接，不编造摘要或阅读时长；离开页面清理动画。底部 `cd ../` 是可访问的普通链接，返回当前语言的首页，保留 44px 触摸区与键盘焦点，不调用浏览器历史回退或栏目字符过渡。
- Writing 详情由 `features/writing/ArticlePage.astro` 和中英文 `[...id].astro` 静态路由实现，只由已发布 Content Collection 条目生成，支持嵌套目录并过滤草稿。正文通过 Astro 渲染 Markdown / MDX；文章 h1 是页面题目，目录从正文渲染的 h2 / h3 / h4 生成。680px 阅读栏从 Header 下沿开始；宽屏左侧目录与 Header Logo 左缘对齐，使用带短色线的 “On this page” 标题常显。侧栏随文章上移，到达视口顶部后使用 CSS sticky 停住，返回顶部时回到初始位置。固定宽度的目录列表随视口可用高度动态扩展、隐藏滚动条，并在可继续滚动的边缘显示渐进模糊；下方操作区保持可见，滚动时高亮当前章节。目录下方以细分隔线连接 GitHub 编辑、仓库加星、复制文章和聊天入口；编辑链接由实际内容文件路径生成，聊天入口在按钮上方弹出宽 240px 的选择菜单，可复制文章内容或复制后打开 ChatGPT / Claude，聊天工具使用本地品牌 SVG。较窄窗口通过页面右侧边缘的箭头打开可滚动目录，展开时箭头移至面板左侧；按钮保留 44px 触摸区，点击、键盘焦点、页面外点击与 Escape 可操作，面板用 Motion 原地淡入淡出并尊重减少动画，离开清理。680px 阅读栏使用按需加载的 Newsreader 与中文系统宋体回退；日期、原文署名、估算字词量与阅读分钟、标签、可选更新时间及封面均来自实际内容。九条无正文参考记录仍不创建详情链接。用户提供的 `get.md` 已作为一篇标记为案例的 Writing 条目，保留 `Get达人` 署名和来源日期，三张限时签名图片改用本地构建资源；不要将其误作用户自己的正式文章或英文译文。
- 首页文章输出不显示 `total 6 posts`；底部入口仅在 `Writing` 文字下显示虚线，`— full blog` 无下划线，整段入口保持可点击。
- News 内容从 Header 下沿开始，期号、选中日期、更新时间与刷新按钮保留在版面元信息行，顶部只保留头版的粗分隔线。右侧日历与分类目录参照 `news-heatmap-v3.html`：日历使用日报 / 周报 / 月报三种点阵视图，容器高度在桌面与窄屏内固定，切换不改变后续版面位置；每个日期或周期以圆点表示，深色为有日报、浅色为无日报，颜色不表示资讯数量。悬浮或聚焦只提示日期，不显示条数；日报按星期排列，周报按季度分四行并兼容 ISO 第 53 周，月报以 12 个月两行排列；周与月点选择对应周期内最新可用日报，无日报周期仍显示浅色点。选择有日报的点加载 `/dailies/{date}`，失败保留原版面，可返回最新资讯。分类包含全部头条与七个主题入口，补齐行业动态与开源入口，采用带两位序号的纵向透明文字行、细分隔线、选中下划线与悬浮轻移，动画来自 motionTokens.news；数量仅显示选中分类已载入条数。已移除搜索入口及交互。下方各分类使用三列网格，平板两列、手机单列；普通新闻卡片统一为 24rem 高度与相同内容宽度，减少底部留白；标题最多三行、简介最多四行；标题自然左对齐，完整文字保留在 DOM 与悬浮提示中。精选与 AI 评分移至卡片左上角，替代分类小标题；时间与来源靠底，保留原有数据；阅读原文位于卡片右上角，与精选及评分对齐，文章标题跳转 AIHOT 导读，来源名称仅展示文字，底部不重复放阅读链接；头条沿用独立版面。页面底部去除来源与语言说明，只保留左侧 cd ../ 返回当前语言首页，不显示箭头。分类加载期间保留最近成功版面，连续切换取消旧请求和过渡；日历模式、筛选与已载入内容随语言切换保留。News 已实现中英文报纸式页面 `/news/`、`/en/news/`，去除大报头；复用公共导航、1200px wide 容器与主题，展示头条、次要新闻、右侧热力图与分类目录，以及下方按分类分组的三列资讯。AIHOT 匿名只读 API v1 提供最近七天精选与最新日报；构建保存快照，浏览器打开时更新，前台每十分钟条件请求，也可手动刷新。API 当前提供五种分类；行业与商业入口均使用 industry，开源入口使用 q=开源，保留 API 返回的原始分类；24 条一页，游标分页追加；中英切换保留筛选与已载入内容。ETag / 304 复用成功缓存，失败保留最近成功的版面，429 遵守 Retry-After，游标失效重取首屏。标题、摘要、评分和来源均来自 API，不添加虚构期号、标签或新闻；英文优先采用 originalTitle，摘要保留来源语言，所有时间明确使用北京时间。 Provider 位于 `features/news/providers/aihot.ts`，统一类型位于 `features/news/types.ts`；只使用 `/api/v1/`，不新增 SSR、密钥、全库镜像或第三方正文抓取。无脚本读取构建快照；静态构建本身不会自动更新。日报由顶层 `report` 映射，版面日期、生成时间、统计窗口分别显示。外部文字通过 Astro 转义或 textContent 渲染，链接仅允许 HTTP(S)。
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

首页 `/`、`/en/`、Writing `/writing/`、`/en/writing/`、News `/news/`、`/en/news/` 应正常显示；其他栏目页目前未实现。空内容集合的提示属于预期。首页当前展示平铺介绍，已移除原 Recently 模块。验证集成需要临时样例时，验证后移除样例，不能把测试页面变成产品页面。

不修改 `node_modules/`、`.astro/`、`dist/` 等生成文件；提交源文件、配置与锁文件，忽略 `.env`。未经用户要求不自动初始化 Git、提交、推送或部署。

向用户报告具体改动、验证结果和未完成项。文档和协作说明优先使用简体中文，代码标识符使用英文。

更新项目进度时，以实际路由和源码为准，同步 README 的当前进度、此文件的协作约定及 design.md 对应的已落地规范；CLAUDE.md 只引用统一入口，不复制第二套规则。本地 docs/ 存在时，按改动同步 progress.md、architecture.md、design-system.md 和内容编写说明，仍保持 Git 忽略。规划、依赖已安装、界面已实现、真实内容已接入及线上部署是不同状态，不能混写为全部完成；历史参考设计保留并注明适用范围。

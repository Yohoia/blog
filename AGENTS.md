# 项目协作约定

## 项目与当前阶段

这是一个 Astro 个人博客，采用 TypeScript、Tailwind CSS、Motion、Lucide、Content Collections、Markdown / MDX，以及按需 React Islands。

项目已建立标准架构、公共设计系统、导航栏、公共 Footer、中英文 Index、Blog 列表、文章详情模板、Project 与 Skill。Blog 已接入《机器学习概述》与《KNN算法》两篇用户提供的真实文章；更多正式文章与项目仍待后续制作，按用户后续请求逐步实现。

进度同步日期：2026-10-05。About、Profile 已移除，不属于当前栏目。Projects 接入真实 DiDa-todo，采用一张薄边框圆角卡片对应一个项目：同一外框内包含 Logo、项目名称、简介、真实链接、介绍底部水印风格的空心两位序号与专属动画。由公共 compact 容器收至 720px 的内容区内按介绍 42% / 动画 58% 排列，左右内边距与卡片间距为 item-gap 的 0.75 倍，上下内边距为其 1.25 倍，序号与链接同一行，编号在左、两个同为 text-meta 的链接在右并垂直居中，不使用绝对定位叠在链接背后；描边混合 8% heading 且不接收点击；窄屏堆叠；不保留章节虚线、嵌套演示边框或重复的品牌标题。DiDa-todo 使用 Typeless 风格语音胶囊，循环展示语音输入 → AI 整理 → 待办生成，结果停留 3 秒后重播；支持勾选、中英切换保留状态，可见且前台时播放，焦点进入待办暂停，减少动画直接显示结果。中英文页面标题均为“Project”；卡片无分类、播放按钮、计时器或技术栈；固定示例不调用真实麦克风或 AI。后续项目沿用 design.md 第 16 节的卡片规范，制作各自的功能演示。卡片列表下方不添加横线或 cd ../ 返回区。旧版灵感手稿不恢复。Header 显示 Index、Blog、Project、Skill，公开路径分别为 `/`、`/blog`、`/project`、`/skill`；内容集合仍使用 blog、projects、skills；Fragments（碎片）和 Now（近况）已移除导航、内容集合、Schema 和路径配置，旧地址进入自定义 404。News 已按用户要求移除导航、双语路由、API 加载、交互、专属样式与设计规范，旧地址进入自定义 404，不再作为计划栏目。Finder（发现）已移除导航、内容集合、Schema、分类配置和专属原型；由 Skills 替换入口，旧地址进入自定义 404。

403、404、500、502 中英文错误页面已实现，共用 `features/errors/ErrorPage.astro` 与配置；插图原件保留在 `public/images/`。

`docs/` 中的规划与说明是本地参考材料，不随 Git 上传；不能把文档中的示例、推荐或后期设想自动当作当前执行任务。最新用户请求决定实际工作范围。

Footer 已采用用户选定的终端式极简落款：`yohoia@space:~$` 后直接显示“© 年份 Yohoia · 赣ICP备2025075792号-2”，整组在页面内水平居中，手机端自然换行。无独立品牌名、slogan、顶部横线、光标、动画或外框；不添加栏目入口、社交、构建日期或时区。备案从 `siteConfig.registration` 读取并链接官方查询入口。`/footer-explorer/` 第三轮与第二轮文件保留为探索记录，其他候选不属于正式规范。

公共页面背景采用用户提供 `back.html` 中的有机游荡波点：40px 锚点上的细点缓慢移动，精细鼠标靠近时排斥并变亮，边缘径向渐隐；颜色读取本站明暗主题，不替换公共光标或覆盖正文。SiteLayout 管理固定画布，后台、离开和页面替换时停止并清理，独立错误页不接入。

先前的网格、水平波浪、柔性网面、局部潮汐与慢速漂移仅保留在背景探索页。正式页面在减少动画或无脚本时显示静态波点，触屏无鼠标排斥。

## 阅读顺序

Footer 位置遵循「短页面贴底、长页面在正文末尾」：SiteLayout 的 body 使用 `site-document` 类、纵向 Flex 与视口最小高度；正文保留自然高度，Footer 上方自动边距吸收空白。Footer 外框上下 padding 为 0，备案链接保留至少 44px 触摸区。不要改成覆盖正文的固定页脚或单独的正文滚动区，不影响错误页及探索页的独立布局。

开始修改前阅读 `README.md` 和相关源码。制作或修改 UI 时阅读 `design.md` 中对应板块规范，并检查公共组件与 `src/styles/`。本地存在 `docs/` 时，可按需阅读架构、内容编写、设计系统及规划文档；新检出缺少这些本地材料时，以 README、协作约定和源码为依据。

保留现有 `design.md`、`docs/` 和 `references/`；普通代码修改不顺带覆盖或重排这些文件。
`docs/`、`references/` 与所有 `.gitkeep` 仅保留在本地，由 `.gitignore` 排除，不加入提交。Git 不跟踪空目录，新检出项目按实际开发需要创建相关目录。
`yohoia-logo-v3/` 是用户提供的 Logo 原始素材，保留原文件；项目实现使用 `common/Logo.astro`、品牌 SVG 和 `scripts/logo.ts`。

## 命名与职责

- 公开板块统一命名为 Index、Blog、Project、Skill；导航、页面标题、路由和栏目代码标识符保持一致。中文与英文版都使用这些名称。
- 公开路由目录使用 `/blog`、`/project`、`/skill`，英文版加 `/en`；旧版文章栏目地址进入自定义 404，旧 `/projects`、`/skills` 跳转到对应新地址。Blog 的内容集合、feature 与图片目录统一使用 blog。
- `src/pages/`：精简的路由、静态路径生成与端点。
- `src/layouts/`：全局 HTML、SEO、主题与页面布局；页面使用 `BaseLayout` 或其衍生布局。
- 常规站点页面使用 `SiteLayout`，复用 Header 和 SkipLink；页面主内容须包含 `id="main-content"`。`SiteLayout` 同时引入公共 `Footer`：`yohoia@space:~$` 提示符后直接显示版权和备案，整组水平居中，使用公共 14px Mono Meta 与首页提示符颜色；窄屏自然换行。透明、无横线、外框、独立站名、描述、光标或动画，不恢复栏目入口、社交、构建日期或时区。站名、备案与年份时区读取 `siteConfig`，备案链接保留至少 44px 触摸高度，主题与键盘焦点沿用公共样式。Header 的激活态依据实际路径，导航配置统一从 `config/navigation.ts` 读取。
- SiteLayout 的正式页面使用 `scripts/background-organic.ts` 绘制固定视口波点：40px 间距、15px 内游荡、120px 范围鼠标排斥与边缘渐隐。减少动画时静止，无脚本时由 CSS 提供静态波点；后台和页面替换时停止绘制并清理。`background-wave.ts` 与 `background-halo.ts` 只服务历史探索页；错误页及其他独立 BaseLayout 页面不接入背景。
- Header 的 Logo 在左，四个文字导航链接与语言 / 主题按钮在桌面右侧同一行；42rem 以下 Logo 在上，导航与按钮在下一行并排。导航字号与图标尺寸同为 18px；水平边距为 `clamp(1rem, 3vw, 3rem)`，24rem 以下收至 0.75rem。Header 背景完全透明，不使用磨砂或背景模糊；保留在普通文档流中随页面自然滚动。导航悬停或聚焦时目标链接清晰，其他链接淡化并模糊；宽屏目标可放大、上移，窄屏取消位移以免相互挤压，减少动画时也取消位移。当前项用 `aria-current` 与下划线标明。桌面垂直边距为 1rem，窄屏为 0.75rem；窄屏适当缩小 Logo，图标按钮和导航链接保持至少 44px 触摸高度。
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
- 公共鼠标样式由 `styles/cursors.css` 和 `assets/cursors/` 的原生 SVG 提供，读取 `--cursor-default`、`--cursor-interactive`；暗色主题与固定黑色的全屏菜单共用 `--cursor-on-dark`，菜单在局部覆盖默认光标，不改变页面主题。仅对可悬浮的精细指针启用：普通区域是 18px 实心箭头（亮色主题黑色、暗色主题浅色，均无描边），24px 浅黄色圆形（填充不透明度 55%）仅用于链接、按钮、菜单及 Blog 文章 / 标签的悬浮反馈，移开后恢复箭头。通过 CSS :hover 实现，不增加点击或 :active 触发，保留文本输入和禁用状态光标；静态参考文章不增加虚构链接。不引入 DOM 光标、持续跟随时钟或重复事件监听。
- `components/layout/TypeOverlayMenu.astro` 与对应脚本是旧实现，当前 Header 不挂载。四个文字导航链接直接输出为可访问的普通链接，独立于 JavaScript；不恢复全屏菜单入口。
- Logo 保留原始 SVG 轮廓与遮罩显现顺序，用 Motion 时间线播放；不添加 CSS keyframes、SMIL 或 React hydration 重复驱动动画。其品牌时序位于 `motionTokens.logo`，多个实例必须拥有独立遮罩 ID。
- 首页介绍沿用参考稿内容与播放节奏：Astro 输出完整内容，Motion 驱动更快的打字、整块输出与光标，参数位于 `motionTokens.terminal`。按用户最新要求直接平铺在页面中，使用公共容器、颜色和明暗主题，不添加终端窗口外框、标签栏、状态栏或内部滚动。仅浏览器刷新自动播放，直接访问、站内跳转与历史返回立即展示完整内容；`scripts/page-visit.ts` 结合 Navigation Timing 与 ClientRouter 生命周期判断，不能只检查 Navigation Timing 后在客户端返回时重复播放。主动语言切换保留当前播放进度、访问时间和页面阅读位置；历史前进 / 后退（traverse）不保存或恢复播放快照，立即显示完整内容。刷新播放等待字体最多 1.5 秒，超时或字体 Promise 拒绝时使用回退字体继续；页面离开或减少动画时取消等待计时器；播放结束后，末尾空提示符的光标继续闪烁；仅在光标可见且页面处于前台时运行，移出视口、进入后台、离开或断开连接时停止，返回后恢复。进入历史缓存前完成内容，减少动画模式立即展示完整内容并保持光标常亮。Logo 的自动播放也仅在刷新时触发，保留悬浮与聚焦重播。
- 首页内容区相对视口居中，正文左对齐，从 Header 下沿开始排布，不额外预留顶部组间距；各部分使用公共边框颜色的 1px 横线分隔，横线上下各 12px，避免恢复原先 32–48px 的大组间距。中英文首页、Blog 列表与文章详情页通过 `BaseLayout` 的 `hideScrollbar` 属性隐藏根滚动条并取消其占位，保留自然滚动；其他页面保留对称的滚动条占位，保持内容与导航的中心一致；原生滚动条轨道使用画布色，随主题同步更新。
- 首页提示符的用户名用绿色，主机名用蓝色，光标为柔和绿色；颜色读取公共 Token，并保留浅色主题的文字对比度。命令匀速逐字输入，当前试行每字符 35ms；每条命令的全部输出一起淡入并上浮 8px、历时 0.5 秒，不逐行错峰。参数集中在 motionTokens.terminal.blockReveal；输出的线性进度、命令进度与输出阶段也要纳入语言切换快照，视觉缓动读取公共 easing。输出过程中隐藏下一条空提示符，等整部分输出完毕后再显示分隔线与下一条提示符。每条命令开始时从可见相位重新闪烁，等待下一条输入时保持光标可见；历史命令行不复制光标。
- `whoami` 右侧使用 `features/index/PixelAvatar.astro`，原始头像与 64×64 圆点 SVG 保留在 `src/assets/images/`。首轮聚合与整块个人信息同时开始，使用同样的 0.5 秒时长并同步结束；下一部分等待文字和头像都完成。`scripts/pixel-avatar.ts` 使用一个 Motion 时钟驱动 Canvas，参数来自 `motionTokens.avatar`，配色读取公共 Token，完成后保留 Canvas 最后一帧并停止动画，避免 Canvas / SVG 交接造成细点闪变。语言切换保存头像进度，离开页面清理动画和观察器；静态访问、减少动画或无脚本时显示完整 SVG。桌面端默认 144px，隐藏的 identity 输出块提前保留完整文字高度，聚合开始前同步头像尺寸；手机端使用 128px / 100px，保持命令全宽。不要在逐行输出结束时才测量和缩放头像，不要恢复过大的头像导致左侧底部空白，也不要把本地 HTML 原型的调试控件加入首页。
- 通用界面图标使用 `@lucide/astro` 或 `lucide-react`，按图标名导入。用户明确要求社交渠道使用对应品牌图标，首页 Gmail、QQ、X、小红书、Bilibili、GitHub、微信与 Telegram 使用本地 Simple Icons SVG；来源提交与 CC0 许可位于 `src/assets/icons/social/`，由 Astro 内联并沿用公共尺寸和颜色，不引入远程运行时或徽章样式。
- 图片使用 `astro:assets` 的 Image / Picture；代码高亮使用 Astro 内置 Shiki。
- 错误页按用户要求使用 `BaseLayout` 的独立全屏布局，不显示 Header、Logo、导航或顶部操作区；插图与简短说明在整个视口居中、保持比例，保留返回首页入口。原图保留在 `public/images/`，仅供服务端使用的 `features/errors/images.ts` 静态导入图片，由 `astro:assets` 生成响应式 WebP；不要把公共路径字符串当成已优化的图片，也不要从客户端文案配置导入图片模块。原图的深色字样用公共 `--illustration-canvas` 纸色底保证暗色可辨认，主题继承现有脚本。错误页设为 `noindex` 并从 Sitemap 排除；`404.astro` 是未知地址的兜底入口。静态托管只回传根错误文件时，`scripts/error-page.ts` 从实际 URL 同步文案与返回首页链接的语言。不能把静态预览路由当作已部署的服务器错误拦截；真正的 403 / 500 / 502 由托管服务器绑定，Nginx 示例位于 `deploy/nginx-errors.conf`。
- 站内链接不带末尾斜杠；Astro 使用 `trailingSlash: 'ignore'` 接受两种输入，保证未知地址仍由自定义 404 接管，不能恢复会让静态预览提前返回默认错误页的严格匹配。
- 暗色模式调用现有主题脚本，统一使用 `data-theme`，不另建 React 主题管理系统。
- 明暗切换保留项目现有太阳 / 月亮按钮，仅复刻用户提供 `Theme-change.tsx` 的 rectangle、blur on、bottom-up 效果。`scripts/theme.ts` 使用原生 View Transition，并在切换前写入 `motionTokens.theme` 的时长、Expo Out 缓动和 8px / 4px / 0px 模糊参数；`styles/theme-transition.css` 按 demo 机制提供 dark / light 两组 CSS Keyframes，实现 0.7 秒底部向上矩形揭幕，旧快照置于下层且不动画，新快照按目标主题选择 keyframes。根节点不指定 Astro 的快照名称，保证主题切换能命中浏览器的 `root` 快照；普通 ClientRouter 导航的默认快照动画由公共 CSS 关闭。不添加参考文件的 Options 面板、黑白按钮、React hydration 或新依赖；减少动画和不支持的浏览器即时切换。连续点击先提交并清理上一轮，导航、页面离开、后台与尺寸改变时清理过渡，保持主题记忆、语言和阅读位置。
- 中英版本使用 Astro 原生 i18n，配置源为 `config/i18n.ts`；中文无前缀，英文 `/en/`。语言从 URL 读取，站内链接使用 `lib/i18n.ts` 的 `localizePath()`；公共翻译放在 `i18n/ui.ts`，板块文案放在对应 feature 配置。版式复用 feature 页面，不复制两套 UI；不得把原文自动视为真实译文。
- 语言按钮使用 ClientRouter 的无动画 swap，普通站内入口保留 `data-astro-reload`。四个 Header 文字入口与 Header Logo 标记 `data-navigation-transition`，由 `scripts/navigation-transition.ts` 委托处理：切换不同栏目或从其他页面点击 Logo 返回首页时，以 Motion 驱动全屏 Canvas 字符噪声网格，覆盖后交换页面，再用同一网格退场。`common/NavigationTransition.astro` 在 BaseLayout 中以顶层 Popover 持久化；颜色与字体读取公共 Token，参数位于 `motionTokens.navigationTransition`。当前栏目、语言、正文链接、刷新与历史返回不播放字符过渡；保留修饰键和无脚本链接行为，减少动画或不支持 Popover 时普通跳转，结束 / 离开后停止时钟与释放画布。
- 主动切换语言时，阅读区块使用 `data-language-block` 保留滚动位置，不重播 Logo；历史前进 / 后退由 ClientRouter 恢复目标记录的滚动位置，不能用离开页面的位置覆盖历史记录。双语短文案允许响应式最小行数占位；不能用固定高度、截断或隐藏溢出掩盖翻译长度差异。
- Header 文字导航的当前栏目由实际路径输出 `aria-current`。Header 随文档自然滚动，不监听滚动位置；语言切换和历史导航仍由 ClientRouter 恢复各页面的阅读位置。
- 不提前引入数据库、CMS、全局状态库、GSAP、Three.js、WebSocket 或大型 UI 库。
- 需要新依赖时说明具体用途，统一使用 npm 并同步 `package-lock.json`。

## 内容与发布

首页头像的网格列与按钮共用 `--avatar-max-size`（桌面 144px）上限，保留按完整文字高度缩小；ResizeObserver 回调将尺寸写入合并到下一帧，整块输出前同步测量，离开时取消排队测量。Vite 预构建 `motion` 与 `motion/mini`，依赖缓存按开发服务与检查 / 构建分别存于 `node_modules/.vite/dev/` 与 `node_modules/.vite/tooling/`，避免检查改写正在使用的浏览器依赖。开发期间遇到 `504 (Outdated Optimize Dep)` 时检查依赖缓存和开发服务，不能据此改变首页播放时序或仅刷新播放规则。

- Content Collections 配置位于 `src/content.config.ts`，Schema 位于 `src/lib/content/schemas.ts`；使用 Content Layer 的 `entry.id`。
- 公共列表、详情静态路径与 RSS 必须过滤草稿，优先复用 `getPublishedEntries()`。
- Blog 的详情路径使用 `getEntryPath()` 与 `[...id].astro`，支持嵌套内容目录。
- 不编造文章、作品、个人身份、联系方式来填充目录。
- 姓名和联系方式统一读取 `config/site.ts`。首页使用 `pr -2 -t links.md` 与 `features/index/TerminalContacts.astro`，左侧 Email、QQ、X、小红书，右侧 Bilibili、GitHub、微信、Telegram，各四个。邮箱为 `imyohoia@gmail.com`，微信号码为 `13870096885`（点击复制），TG 为 `@Yohoia`（`https://t.me/Yohoia`）；渠道、标签、复制值和目标 URL 集中在 `siteConfig.contactLinks`，刷新播放时联系区两列整体浮现，不恢复 LinkedIn、简历或旧邮箱。首页个人介绍、工具与教育经历使用用户资料，集中在 `features/index/config.ts`；这三组内容按用户要求在中英文页面均展示英文。个人介绍为 AI Application Engineer、Independent Learner & Software Developer、Based in China；`ls tools/` 展示 Codex、Claude Code、VS Code、CC Switch、Clash Verge 及一句基础简介；名称以蓝色带下划线的普通链接打开已核对的对应官网，href 集中在 tools 配置，使用新标签页及 noopener / noreferrer，窄屏保留 44px 触摸高度；`git log --oneline --reverse education/` 展示 2012 / 2015 进贤二中、2018 华东交通大学、2023 厦门理工学院的四个学习阶段。提交式短哈希仅为版式装饰，不添加未提供的专业、学位、毕业年份或工作任职。`claude-code --stats` 的统计仍是此前明确暂留的参考内容，不能自动视为真实个人数据。
- 首页文章区使用用户确认的 `yohoia@space:~$ ls -ltr blog/ | tail -n 6`，用户名和文件所有者来自 `siteConfig.name`。最新文章从已发布 blog Content Collection 读取，按日期由旧到新显示，最多 6 条；`Blog — all posts` 跳转到对应语言的本站列表，每行仅显示权限、所有者、日期和可点击文件名，不重复右侧文章标题；文件名定位列表条目。保留整块输出播放、响应式换行与语言切换进度；测试参考记录已清除，不再用无正文配置充当已发布文章。
- Blog 列表采用期刊式归档结构，按真实已发布条目的年 / 月 / 日从新到旧分组，使用 UTC 计算日期与星期；同日维持稳定顺序。内容从 Header 下沿开始，删除介绍段和顶部统计；年份采用 Space Grotesk 600 字重的浅色描边数字，读取公共 --font-year；Blog 页面单独导入对应字重，月份侧栏与每行日期 / 星期组成时间线，文章行保持透明。标题与正文首段按用户要求单行省略，正文首段从 Content Collection 的 body 提取，DOM 与 title 属性保留完整文本；文件名不显示；整个真实文章卡片使用覆盖式链接进入详情，保留键盘焦点。黄色标题色带固定 0.72em 高度，Motion 只动画 --blog-highlight-progress 的横向数值，不能插值混合 px / em 的 background-size 高度。日期数字、星期与标签统一读取 text-meta 字号与行高（默认 14px / 21px），继承相同字重；日期圆底尺寸跟随行高，标签不添加改变文字对齐的底部留白。每条最多展示三个按标题分类的 `#` 标签，由 Motion 驱动颜色与下划线。箭头固定在文章行最右侧，默认浅色，悬浮时蓝色圆底缩放显现并轻移箭头。交互使用 `scripts/blog.ts`、`motionTokens.blog` 与公共 Token，尊重减少动画偏好，主题改变时同步颜色；手机端日期与标签允许自然换行，月份移至文章上方。列表底部不添加 `cd ../` 返回区或分隔横线，结束后自然进入公共 Footer。
- Blog 详情由 `features/blog/ArticlePage.astro` 和中英文 `[...id].astro` 静态路由实现，只由已发布 Content Collection 条目生成，支持嵌套目录并过滤草稿；详情页隐藏根滚动条外观但保留自然滚动。正文通过 Astro 渲染 Markdown / MDX；文章 h1 是页面题目，目录从正文渲染的 h2 / h3 / h4 生成。宽屏复刻参考站比例：正文纸张与右侧目录 / 快捷栏组成最大 1152px 的内容组合并整体居中；1280px 及以上正文为 920px，右侧栏为 200px，1024–1280px 保留右侧栏并让正文收缩，1024px 以下转为单列并使用右侧边缘箭头打开目录浮层。“On this page” 保留 120px 顶部停靠偏移；目录可见高度约 248px，内部滚动、隐藏滚动条并显示渐进模糊，滚动时高亮当前章节，下方进度与快捷操作位置保持不变。右侧同一栏依次提供阅读进度、回到顶部、本地喜欢、分享、GitHub 更新 / 支持 / 反馈；喜欢计数只保存在当前浏览器。正文底部左侧使用 `cd ../` 可访问普通链接，返回当前语言 Blog 列表；较窄目录浮层用 Motion 原地淡入淡出并尊重减少动画，离开清理。正文使用按需加载的 Newsreader 与中文系统宋体回退；标题 meta 单行展示头像版站点作者 Yohoia、YYYY/MM/DD 发布日期、细线索引标签、字数与分钟数，所有子项统一继承 12px / 1.4 的 Mono Meta 样式，窄屏居中换行。用户提供的《机器学习概述》与《KNN算法》均已作为正式 blog 文章接入，页面标题 meta 统一展示站点作者，图片改用本地构建资源；原始导入目录仅保留在本地并由 Git 忽略。
- 首页文章输出不显示 `total 6 posts`；底部入口仅在 `Blog` 文字下显示虚线，`— all posts` 无下划线，整段入口保持可点击。
- Skill 页面使用 `features/skills/SkillsPage.astro` 和中英文 `/skill`、`/en/skill` 路由，从已发布 skills 集合读取真实条目。第 17 节规范以用户提供的 `yoho-skills-v3-illustration.html` 为基础：上方约 1.29 比例、铺满整个上部的插图，下方名称 / 箭头 / 简介；不显示类别、编号或 GitHub 路径，一张卡片一个外链；桌面与平板两列，单卡最大约 381px，网格与标题左边缘对齐且整个内容区居中，手机单列，内容自然增高，不用固定高度或截断隐藏译文。沿用公共 SiteLayout、Container 与局部内容宽度（宽屏约 782px、手机约 381px）、主题、Sans / Mono 与正文颜色，仅卡片名称按参考使用本站托管的 Newsreader；插图保持原色纸面，不反色。原 HTML 的 base64 PNG 已无修改解码为 `src/assets/images/skills/yoho-get-design.png`，通过 astro:assets 输出响应式 WebP；卡片真实 GitHub 链接和内容由 `src/content/skills/yoho-get-design.md` 管理，不增加未提供的技能、安装入口或虚构指标。`features/skills/skills.ts` 用 Motion 实现轻微倾斜、插图视差、箭头反馈与有限入场，参数集中在 motionTokens.skills；精细指针才启用视差，减少动画取消位移，主题改变同步颜色，离开清理观察器、监听和动画。保留整卡键盘焦点与无脚本可用外链。
- `SITE_URL` 在 `.env` 中配置；未确定域名时不填假生产域名。
- RSS 构建函数已在 `lib/rss.ts` 中准备，实际内容路由完成后再创建公开 RSS 端点。
- 服务端密钥不放入 `PUBLIC_*` 变量或客户端文件。

## 命令与验收

使用 Node.js 24 LTS 和 npm，干净环境安装依赖执行 `npm ci`。

```sh
npm run dev
npm run check
npm test
npm run format:check
npm run build
```

修改后先执行相关验证，再执行格式检查和生产构建。`npm run build` 包含 Astro 类型检查。只针对重要行为和实际风险增加测试；不为目录占位、配置字面量或简单可逆修改建立测试框架。

首页 `/`、`/en`、Blog `/blog`、`/en/blog`、Project `/project`、`/en/project`、Skill `/skill`、`/en/skill` 应正常显示；Fragments、Now 已移除，旧地址进入自定义 404。首页当前展示平铺介绍，已移除原 Recently 模块。验证集成需要临时样例时，验证后移除样例，不能把测试页面变成产品页面。

不修改 `node_modules/`、`.astro/`、`dist/` 等生成文件；提交源文件、配置与锁文件，忽略 `.env`。未经用户要求不自动初始化 Git、提交、推送或部署。

向用户报告具体改动、验证结果和未完成项。文档和协作说明优先使用简体中文，代码标识符使用英文。

更新项目进度时，以实际路由和源码为准，同步 README 的当前进度、此文件的协作约定及 design.md 对应的已落地规范；CLAUDE.md 只引用统一入口，不复制第二套规则。本地 docs/ 存在时，按改动同步 progress.md、architecture.md、design-system.md 和内容编写说明，仍保持 Git 忽略。规划、依赖已安装、界面已实现、真实内容已接入及线上部署是不同状态，不能混写为全部完成；历史参考设计保留并注明适用范围。

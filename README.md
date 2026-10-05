<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/readme/logo-dark.svg">
  <img src="./assets/readme/logo-light.svg" width="220" alt="Yohoia 手写 Logo">
</picture>

# Yohoia · Blog

> 安静地记录，认真地探索。

基于 **Astro** 的个人数字空间，用来整理文章、碎片笔记、项目与 Skills。暖纸色主题、克制的排版，以及中英文共用的页面结构。

[快速开始](#快速开始) · [当前进度](#当前进度) · [项目结构](#项目结构) · [技术与设计](#技术与设计)

<picture>
  <source media="(max-width: 600px) and (prefers-color-scheme: dark)" srcset="./assets/readme/index-mobile-dark.webp">
  <source media="(max-width: 600px)" srcset="./assets/readme/index-mobile-light.webp">
  <source media="(prefers-color-scheme: dark)" srcset="./assets/readme/index-dark.webp">
  <img src="./assets/readme/index-light.webp" width="100%" alt="实际首页：Yohoia 公共导航与直接平铺的个人介绍，支持明暗主题">
</picture>

_首页版式参考截图；当前个人介绍、工具和教育经历以页面内容为准。介绍逐字播放，内容直接在页面中向下展开。_

## 当前进度

进度同步：**2026-10-05**。

已完成中英文 **Index**、**Writing 列表**、**Projects** 与 **Skills**。

- **公共导航**：Logo 与操作按钮分置视口两侧，保留响应式边距与半透明磨砂背景。Header 处于普通文档流中，随页面自然滚动，不再收紧、固定或执行滚动动画。桌面和移动端统一使用语言按钮前的菜单图标，打开黑色全屏 Type Overlay：从按钮位置圆形展开，六个栏目以大字号依次进入，悬浮或聚焦时向右移动。支持关闭按钮、Escape、焦点约束与阅读位置恢复；禁用 JavaScript 时仍可使用折叠菜单。首页、Writing 与菜单隐藏滚动条外观，保留滚轮、触控和键盘滚动；开关菜单时保持页面宽度与阅读位置稳定。其他页面的原生滚动条轨道随画布颜色同步切换，避免明暗切换后页面边缘出现异色。
- **公共 Footer**：采用用户选定的「单行落款」，左侧为 Yohoia 站名与简短描述，右侧为版权与“赣ICP备2025075792号-2”。品牌读取公共 item 字号（桌面最大 20px）、500 字重，其余为 14px Sans；两端对齐，优先横排，空间不足时自然换行。读取公共颜色和间距，透明、无横线或外框，上下不增加外部留白。备案链接读取集中配置并跳转官方查询入口；不展示栏目入口、社交、构建日期或时区。
- **中英切换**：保留查询参数、锚点、主题和阅读位置，减少翻译长度导致的布局变化；历史前进与后退恢复各自记录的阅读位置。
- **明暗切换**：沿用现有太阳 / 月亮按钮，按用户提供的 `Theme-change.tsx` 复刻 rectangle / blur on / bottom-up：原生 View Transition 伪元素播放 0.7 秒 CSS Keyframes，从底部向上揭幕，模糊由 8px、4px 消退至清晰；旧快照置于下层且不动画，新快照按目标主题选择 keyframes；主题记忆、系统偏好与跨标签页同步继续由公共脚本管理；减少动画或浏览器不支持时即时切换，快速连点、离开页面与语言切换会清理过渡。
- **栏目过渡**：全屏菜单切换不同栏目，以及 Header Logo 从其他页面返回首页时，播放同一 ASCII 字符过渡：随机字符成片铺满屏幕，覆盖后交换页面，再逐格退场，填充与退场各约 0.5 秒。沿用当前明暗主题；语言切换、正文链接、当前栏目与历史返回不播放。减少动画或不支持 Popover 时使用普通跳转，动画结束后停止绘制并释放画布。
- **手写 Logo**：刷新时播放一次，悬浮或键盘聚焦时重播；遵循系统减少动画偏好。
- **平铺首页**：介绍在页面中居中排布，正文左对齐，各部分以细横线和紧凑间距分隔；绿色用户名、蓝色主机名和柔和绿色光标，Motion 驱动更快的匀速逐字输入，每条命令的输出内容整块淡入并轻微上浮；试行参数为每字符 35ms、输出 0.5 秒 / 8px。内容区从顶部导航栏下沿开始排布。仅刷新自动播放，直接访问、站内返回与历史返回显示完整内容；播放结束后，末尾空提示符的绿色光标继续闪烁，移出视口或页面进入后台时暂停。访问时间读取浏览器本地时间，主动语言切换保留当前播放进度和阅读位置，历史前进 / 后退不读取动画快照；刷新时字体最多等待 1.5 秒，超时后使用回退字体继续播放，离开页面清理等待。减少动画模式直接展示完整内容。
- **像素头像**：`whoami` 右侧展示由个人头像生成的圆点图像，与左侧信息同步聚合；桌面端根据完整文字高度调整大小，手机端使用更小尺寸。悬浮、聚焦或点击可重播，语言切换保留进度，减少动画或禁用 JavaScript 时显示完整静态 SVG。
- **Writing 归档**：真实已发布文章按年份、月份及日期从新到旧排列，年份使用 Space Grotesk 600 字重的浅色描边数字，月份侧栏与每行日期 / 星期组成时间线；内容从 Header 下沿开始，省去介绍与顶部统计。标题与正文首段单行省略，完整文字保留在可访问文本和悬浮提示中；文件名不显示；整个文章卡片可点击进入详情。标题悬浮出现黄色色带，Motion 只驱动横向展开，高度始终固定。按标题分类的 `#` 标签最多显示三个，悬浮时加深颜色并展开细下划线。箭头固定在行尾，默认浅色，悬浮文章时蓝色圆底展开、箭头轻移；月份侧栏在窄屏移至文章上方，底部 `cd ../` 返回当前语言的首页。日期数字、星期与标签统一使用 14px 字号、21px 行高与常规字重，对齐于同一行；窄屏自然换行。当前已接入《机器学习概述》和《KNN算法》两篇真实文章；概述发布于 2026-09-30，KNN 发布于 2026-10-01。
- **Writing 详情**：中英文嵌套路由已接入已发布的 Markdown / MDX 条目，根滚动条外观隐藏但保留自然滚动。宽屏复刻参考站比例：正文纸张与右侧目录 / 快捷栏组成最大 1152px 的内容组合并整体居中；1280px 及以上正文为 920px，右侧栏为 200px，1024–1280px 保留右侧栏并让正文收缩，1024px 以下转为单列并使用右侧边缘箭头打开目录浮层。正文标题与 meta 行在正文纸张内居中，正文使用 Newsreader 与中文系统衬线回退。目录从正文 h2 / h3 / h4 生成，“On this page” 保留 120px 顶部停靠偏移；目录可见高度约 248px，内部滚动并保留渐进模糊，下方进度与快捷操作位置保持不变。右侧同一栏依次提供阅读进度、回到顶部、本地喜欢、分享、GitHub 更新 / 支持 / 反馈；喜欢计数只保存在当前浏览器。底部左侧使用 `cd ../` 返回当前语言 Writing 列表。草稿不会生成公开路径。当前已接入《机器学习概述》和《KNN算法》，图片使用本地构建资源。
- **鼠标样式**：支持悬浮的精细指针使用本地 SVG 原生光标，普通黑色箭头为 18px，无白色描边，暗色主题和固定黑色的全屏菜单使用浅色实心箭头；圆形为 24px，填充不透明度 55%；仅悬浮链接、按钮、菜单入口及 Writing 文章 / 标签时显示浅黄色圆形，移开后恢复箭头；点击不单独触发圆形；文本输入和禁用状态保留对应原生提示，纯触控设备不启用。不添加持续跟随动画或额外依赖。
- **内容基础**：Markdown / MDX、Content Collections、字段校验、草稿过滤和统一内容路径。
- **错误页面**：403、404、500、502 使用独立的全屏布局，不显示 Header；插图和说明在整个视口中居中，继承站点明暗主题，按 URL 显示中英文并提供返回首页入口。

首页姓名与联系方式已使用 Yohoia 的信息。`pr -2 -t links.md` 按两列显示八个渠道：左侧 Email（`imyohoia@gmail.com`）、QQ、X、小红书，右侧 Bilibili、GitHub、微信（`13870096885`）与 Telegram（`@Yohoia`）。微信入口复制号码，TG 跳转至 `https://t.me/Yohoia`；渠道、标签及目标集中在 `src/config/site.ts`，品牌 SVG 在本地托管，沿用单色图标与文本链接样式，刷新播放时按行展示两列。个人介绍、工具和教育经历已替换为用户提供的资料，集中在 `src/features/index/config.ts`：AI Application Engineer、Independent Learner & Software Developer、Based in China；`ls tools/` 展示 Codex、Claude Code、VS Code、CC Switch、Clash Verge 及各自一句简介，名称可打开对应官网；`git log --oneline --reverse education/` 展示 2012 初中、2015 高中、2018 大学、2023 研究生四个学习阶段。按用户要求，这三组内容在中英文首页均使用英文。`claude-code --stats` 的统计仍按此前要求保留参考内容，尚未接入用户真实数据。文章区使用 `yohoia@space:~$ ls -ltr writing/ | tail -n 6`，从真实已发布 Writing 条目取最新 6 条，保留从旧到新的输出顺序；`Writing — full blog` 进入本站对应语言的完整列表，每行只显示权限、所有者、日期和可点击文件名，文件名定位到列表条目，右侧不重复文章中文标题。测试参考记录已清除。

Projects 当前采用一张卡片对应一个真实项目（2026-10-05）：中英文页面共用 720px 内容区（公共 `--container-compact`）；中文标题为“项目”，英文标题为“Projects”。每张薄边框圆角卡片包含 Logo、项目名称、简介、真实跳转链接、空心两位序号及专属动画。卡片内介绍与动画约为 42% / 58%，左右内边距与组间距为 item-gap 的 0.75 倍，上下内边距放大为其 1.25 倍，窄屏自然堆叠；空心序号保留 8% heading 的浅淡水印描边，与链接同一行：编号在左，两个 14px 链接在右，垂直居中且互不覆盖；没有外部章节虚线或嵌套演示卡片，不重复展示 Logo、名称或宣传标题。DiDa-todo 动画使用 Typeless 风格深色语音胶囊和白色细波形，循环演示语音输入 → AI 整理 → 待办生成；结果停留 3 秒后淡出重播，可勾选，聚焦待办、离开视口或后台时暂停，减少动画直接展示结果，中英切换保留进度和状态。链接悬浮或聚焦时展开下划线并轻移箭头；固定示例不调用真实麦克风、账户、AI 或云端任务。卡片列表下方不添加横线或 cd ../ 返回入口；后续项目沿用 [design.md 第 16 节](design.md#16-projects--项目卡片设计规范) 的统一卡片规范，演示按各自功能制作。Fragments、Now 已预留结构，栏目页仍待制作。主导航保留计划路径，尚未实现的地址显示自定义 404 页面。Writing 展示《机器学习概述》和《KNN算法》两篇真实文章；公开 RSS 端点尚未创建。

Skills 使用用户提供的 `yoho-skills-v3-illustration.html` 卡片版式，已实现 `/skills/` 与 `/en/skills/`，复用公共导航、Footer 和主题。当前仅接入原 HTML 的真实 `yoho-get-design`：原始插图解码后本地保存，经 Astro 生成响应式 WebP，卡片包含随整卡等比缩小并铺满上部的插图、名称、说明与外链箭头，点击整卡进入原 GitHub 仓库；整卡可点击，桌面与平板两列（单卡最大约 381px）、手机单列，标题与卡片内容区整体居中。Motion 提供轻微倾斜、整张插图视差、箭头反馈和短暂入场，尊重减少动画；不迁移原型独立 Header、装饰 Hero 或插图规范说明。内容位于 `src/content/skills/`，后续条目沿用 [design.md 第 17 节](design.md#17-skills--技能卡片设计规范)。

Footer 风格探索第二轮保留在 `/footer-explorer/`：仅以品牌、描述、版权和用户提供的备案号构成候选，包含精简基线与五种排版。用户最新选定 01「单行落款」，正式公共 Footer 已替换并同步 design.md；外框上下内边距为 0，短页面贴住视口底部，长页面自然位于正文末尾，正文随页面滚动。对比页作为探索记录保留。备案信息集中在 `src/config/site.ts`，未进行备案记录查询或线上部署。

首页动画排查确认开发环境出现 `504 (Outdated Optimize Dep)`，动画脚本加载失败；Vite 将开发服务与检查 / 构建的依赖缓存分开，提前预构建 Motion 入口并重启开发服务。已确认检查与构建不会改写正在使用的开发缓存。圆点头像的尺寸观察改为下一帧合并写入，桌面宽度上限 144px，避免 ResizeObserver 循环反馈。保留仅刷新播放、语言切换保留进度与减少动画规则；浏览器工具仍受该地址保存的访问设置限制，实际播放待用户复核。

当前菜单包含 Index、Writing、Fragments、Projects、Skills、Now；**About、Profile 已移除导航、路由及相关信息**。News 已按用户要求整体移除，旧地址由自定义 404 接管，构建与浏览器不再请求 AIHOT。Finder（发现）也已整体移除，由 Skills 替换导航；旧 Finder 地址仍进入自定义 404。

| 范围                           | 当前状态                           | 后续工作                       |
| ------------------------------ | ---------------------------------- | ------------------------------ |
| Index、Writing、中英与明暗主题 | 界面、交互与两篇真实文章已实现     | 替换首页参考统计、补充更多文章 |
| 403 / 404 / 500 / 502          | 中英文独立插画页已实现             | 部署时绑定服务器错误处理       |
| Projects                       | DiDa-todo 与双语互动卡片已实现     | 补充更多真实项目与对应交互     |
| Skills                         | 原 HTML 的技能卡片与双语页面已实现 | 补充更多真实 Skill             |
| Fragments、Now                 | 目录、配置或数据契约已准备         | 实现栏目页与内容               |
| 文章详情、阅读时长             | 概述与 KNN 两篇文章已接入          | 补充更多真实文章并验收内容     |
| 相邻文章、RSS                  | 尚未实现                           | 按内容规模与订阅需求制作       |
| 域名与上线                     | 静态构建已准备，尚未部署           | 确定 SITE_URL 和托管平台       |

协作要求见 [AGENTS.md](AGENTS.md)，已落地设计见 [design.md](design.md)。`docs/`、`references/`、`writing-preview.html` 和 `.gitkeep` 是本地材料，继续由 Git 忽略。

## 快速开始

使用 **Node.js 24 LTS** 和 npm。锁文件保存精确依赖版本，推荐用 `npm ci` 安装。

```sh
git clone https://github.com/Yohoia/blog.git
cd blog
npm ci
npm run dev
```

打开开发服务器输出的地址，默认是 `http://localhost:4321`。

同一项目只运行一个开发服务。新增或替换 Content Collection 后，若开发日志提示集合不存在或为空，而内容文件已存在，请重启开发服务以重新加载集合配置；后台服务可先执行 `npm run dev -- stop`。不要反复启动新实例，让多个服务共用内容缓存。

| 命令                   | 用途                     |
| ---------------------- | ------------------------ |
| `npm run dev`          | 本地开发                 |
| `npm run check`        | Astro 与 TypeScript 检查 |
| `npm test`             | 首页播放与导航回归检查   |
| `npm run build`        | 类型检查并生成 `dist/`   |
| `npm run preview`      | 预览生产构建             |
| `npm run format:check` | 检查代码格式             |
| `npm run format`       | 格式化源码与项目文档     |

正式域名确定后，复制 `.env.example` 为 `.env`，填写 `SITE_URL`。留空也能开发和构建；配置后才启用 Sitemap 与 Canonical / hreflang。静态托管使用 `npm ci` 安装、`npm run build` 构建、`dist/` 发布。

### 错误页与部署路由

| 状态码 | 中文预览路径 | 英文预览路径 | 静态产物              |
| ------ | ------------ | ------------ | --------------------- |
| 403    | `/403/`      | `/en/403/`   | `dist/403/index.html` |
| 404    | `/404/`      | `/en/404/`   | `dist/404.html`       |
| 500    | `/500/`      | `/en/500/`   | `dist/500.html`       |
| 502    | `/502/`      | `/en/502/`   | `dist/502/index.html` |

八个入口共用 `src/features/errors/ErrorPage.astro`，文案位于同目录的 `config.ts`，仅在服务端使用的图片映射位于 `images.ts`；原始 PNG 保留在 `public/images/`，页面使用 Astro 构建生成的响应式 WebP。错误页标记 `noindex`，并从 Sitemap 排除。英文产物均位于 `dist/en/<状态码>/index.html`。

站内链接继续使用尾部斜杠，路由匹配允许两种写法，避免生产预览在无斜杠的未知地址上提前返回 Astro 默认错误页。

Astro 开发服务器会将未知地址交给 `src/pages/404.astro`，静态构建生成根目录的 `404.html`；托管平台须把找不到的请求交给这份文件并保留 HTTP 404。静态托管共用根错误文件时，浏览器脚本根据实际 URL 的 `/en/` 前缀同步文案和返回首页链接；无 JavaScript 时根文件显示默认中文，显式英文路由仍正常显示英文。参见 [Astro 错误页文档](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page)。

当前采用静态输出，访问错误页地址用于预览；线上真正的 403、500、502 由服务器或代理产生，需要在对应服务绑定这些 HTML。尚未选择部署平台，因此不添加平台适配器。使用 Nginx 时可在静态站点的 `server` 块中引入 [`deploy/nginx-errors.conf`](deploy/nginx-errors.conf)，并把 `root` 指向 `dist`；反向代理还需在页面请求所在的 `location` 配置 `proxy_intercept_errors on`。这是待部署时启用的示例，参见 [Nginx error_page 文档](https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page)。

## 技术与设计

**Astro 7 · TypeScript 6 · Tailwind CSS 4 · Motion · Lucide**

页面与公共 UI 优先使用 Astro 组件，React Islands 留给需要复杂交互的模块。内容在构建时生成静态 HTML；不依赖数据库或 CMS。MDX、SEO、Sitemap 与 RSS 工具已接入基础层，目录职责见 [项目结构](#项目结构)。

视觉规范来自 [design.md](design.md)：公共颜色、字号、间距和容器集中在 Design Tokens，组件与正文复用同一套样式。首页采用透明的平铺内容，沿用公共明暗主题与阅读宽度。Geist Sans / Mono 在本站托管，中文采用系统字体回退。Writing 年份单独使用 Space Grotesk，仅在该页面加载拉丁字符集的 600 字重。动画参数集中配置，明暗主题与语言沿用公共脚本。

全屏菜单使用 `src/components/layout/TypeOverlayMenu.astro` 与 `src/scripts/type-overlay-menu.ts`，由原生 `dialog` 管理模态焦点和背景交互，Motion 驱动圆形展开、逐项进入与悬浮动画。菜单按实际视口尺寸覆盖全屏，避免滚动条占位缩小 `100vw`。布局使用 Tailwind，颜色和字号位于公共 Token，时序位于 `motionTokens.menu`，不增加依赖。关闭、离开页面或语言切换时释放滚动锁并清理动画，避免影响原有阅读位置。

栏目过渡使用 `src/components/common/NavigationTransition.astro` 与 `src/scripts/navigation-transition.ts`。Motion 时钟驱动 Canvas 字符网格，原生顶层 Popover 覆盖菜单；Astro ClientRouter 在完全覆盖后交换页面，并持久化同一画布，让退场延续当前字符。参数集中在 `motionTokens.navigationTransition`，包含时长、网格大小、帧率与格子数量上限；等待页面加载时保持覆盖，超时回退普通跳转，不增加依赖。

像素头像原图与静态 SVG 位于 `src/assets/images/`，组件为 `src/features/index/PixelAvatar.astro`。`src/scripts/pixel-avatar.ts` 使用一个 Motion 时钟驱动 Canvas，完成后停留在最后一帧，不再循环或切换绘制方式；SVG 用于静态访问、减少动画与无脚本显示。完整文字提前保留高度，头像在开始聚合前确定尺寸，避免最后一行出现时缩放抖动。配色读取公共 Token，聚合参数集中在 `motionTokens.avatar`，不增加运行时依赖。

## 项目结构

```text
src/
├── pages/            # 精简的路由入口
├── layouts/          # 文档、SEO、主题与公共导航
├── features/         # 各板块的页面、组件与业务逻辑
├── components/       # 跨板块复用的 Astro 组件
├── content/          # Markdown / MDX 与结构化内容
├── lib/              # 查询、Schema、路径与 RSS 工具
├── config/           # 站点、导航、语言与动画配置
├── i18n/             # 公共界面翻译字典
├── scripts/          # 浏览器交互
├── styles/           # Design Tokens、组件与正文样式
├── assets/           # 构建处理的品牌资源
└── islands/          # React 交互模块预留
```

路由组合 `features`、布局和公共组件；板块模块调用 `lib` 与 `config`，基础层不反向依赖页面。默认中文不加前缀，英文使用 `/en/`；首页与 Writing 各维护一份版式。内容标题与正文保留原文，内容级翻译仍需真实译文。

<details>
<summary>常用配置入口</summary>

| 配置                 | 文件                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| 站点信息与联系方式   | [`src/config/site.ts`](src/config/site.ts)                                                                |
| 语言、导航与公共翻译 | [`i18n.ts`](src/config/i18n.ts) · [`navigation.ts`](src/config/navigation.ts) · [`ui.ts`](src/i18n/ui.ts) |
| 板块文案与参考文章   | [`index/config.ts`](src/features/index/config.ts) · [`writing/config.ts`](src/features/writing/config.ts) |
| 设计与动画参数       | [`tokens.css`](src/styles/tokens.css) · [`motion.ts`](src/config/motion.ts)                               |
| 内容模型与分类       | [`schemas.ts`](src/lib/content/schemas.ts) · [`categories.ts`](src/config/categories.ts)                  |

</details>

## 继续构建

- [公共设计规范](design.md)：视觉主题、排版与交互规范。
- [内容模型](src/lib/content/schemas.ts)：内容字段与校验规则。
- [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md)：AI 编程协作入口。

下一步是逐步制作其余栏目页，并加入真实内容。当前尚未部署站点，也未指定开源许可证。

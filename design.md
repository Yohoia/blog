# Yohoia Blog 设计系统

本文件描述当前站点的视觉原则、设计 Token、页面规范和交互边界。实现以 `src/styles/`、`src/components/` 和 `src/lib/behaviors/` 为准。

## 1. 设计主张

Yohoia Blog 是一个安静、可读、偏编辑感的个人站点。设计服务于长期阅读和个人作品展示，避免营销页面的强刺激。

核心判断：

- 内容优先，界面保持安静。
- 平面优先，层级主要依靠字号、留白和颜色，而不是复杂阴影。
- 颜色承担状态与导航信息，不做无意义装饰。
- 字体是主要视觉元素。
- 动效只解释状态变化和空间关系。
- 移动端保留完整功能与阅读舒适度。

## 2. 视觉 Token

Token 定义在 `src/styles/base/tokens.css`，Tailwind 通过 `@theme` 消费这些变量。

### 颜色

浅色主题：

- Canvas：`#f6f5f1`
- Surface：`#fbfaf7`
- Heading：`#1b1b18`
- Body：`#5f5e58`
- Muted：`#8a8982`
- Signal：`#6b8cff`
- Signal text：`#405dcb`
- Live：`#56c596`
- Warning：`#e2a84a`
- Critical：`#df6c75`

深色主题：

- Canvas：`#111210`
- Surface：`#171815`
- Heading：`#f1f0e9`
- Body：`#c4c3bb`
- Muted：`#85847d`
- Signal text：`#6b8cff`

边框使用 heading 色的低透明度版本，保证明暗主题下都足够克制。

### 字体

- Sans：Geist Variable，中文回退 Noto Sans SC / PingFang SC / Microsoft YaHei
- Mono：Geist Mono Variable，用于命令、代码、日期和标签
- Serif：Newsreader Variable，用于文章详情的编辑式排版
- Year：Space Grotesk，用于 Blog 年份和 Projects 序号

### 字号

- Display：`clamp(2.5rem, 2rem + 1.25vw, 3rem)`
- Page：`clamp(2rem, 1.75rem + 0.625vw, 2.25rem)`
- Section：`clamp(1.375rem, 1.25rem + 0.3125vw, 1.5rem)`
- Item：`clamp(1.0625rem, 0.875rem + 0.46875vw, 1.25rem)`
- Body：`clamp(1rem, 0.875rem + 0.3125vw, 1.125rem)`
- Meta：`0.875rem`
- Micro：`0.75rem`

### 间距与形状

- Gutters：`1.25rem` → `1.5rem` → `2rem`
- Section gap：`clamp(4.5rem, 3rem + 4vw, 6rem)`
- Group gap：`clamp(2rem, 1rem + 2.5vw, 3rem)`
- Item gap：`clamp(1rem, 0.5rem + 1.25vw, 1.5rem)`
- UI radius：`0.5rem`
- Card radius：`0.75rem`
- Media radius：`1.5rem`
- Icon stroke：`1.75`

## 3. 布局系统

公共页面由 `Shell` 提供 Header、Footer、背景 canvas 和跳转链接。

内容宽度：

- Reading：`42.5rem`
- Compact：`45rem`
- Index：`47.5rem`
- Feature：`67.5rem`
- Wide：`75rem`

页面使用纵向 Flex。短页面 Footer 贴近视口底部，长页面随内容滚动。正文与 Footer 保留 `clamp(2rem, 1.5rem + 0.625vw, 2.5rem)` 的最小间距。

移动端以单列为主，触控目标至少 `2.75rem`。标题、正文和卡片不断行溢出，Meta 信息可自然换行。

## 4. 公共组件

### Header

- 透明磨砂层跟随主题
- Logo、Index、Blog、Project、Skill 使用同一导航节奏
- 当前栏目有明确 aria-current 与视觉状态
- 桌面端 Logo 靠左、导航靠右；移动端 Logo 居中，主导航收纳为居中磨砂胶囊
- 移动端四个栏目在居中胶囊内等分，当前项使用不透明黑底反色，触控目标不小于 2.75rem

### Footer

Footer 只保留版权与 ICP 信息：

```text
© 年份 Yohoia · 赣ICP备2025075792号-2
```

短页面贴住视口底部，长页面位于正文末尾。没有提示符、独立标题、slogan 或额外动画。

### 背景

常规页面使用固定视口 canvas 绘制有机游荡波点：

- 每 40px 一个略带随机偏移的锚点
- 点在锚点附近缓慢游荡
- 精细鼠标近距离轻推波点并提高亮度
- 边缘径向渐隐
- 点色读取 heading 主题色
- 背景不接收点击，不改变原生光标

减少动画或无脚本时显示静态波点；页面隐藏或路由替换时停止绘制并清理状态。

### 链接与按钮

- 文字链接使用主题 signal 色
- UI 按钮使用低透明度 surface 与清晰边框
- 焦点使用 2px focus 轮廓和 4px offset
- 外链均带 `noopener noreferrer`

## 5. 首页 Index

首页以终端输出组织个人介绍：

1. `whoami`
2. `cat philosophy.md`
3. `ls websites/`
4. 最新文章
5. `ls tools/`
6. 教育经历
7. `links.md`
8. 主题与语言配置

终端内容保持真实、简短、可扫读。动画只在页面载入时依次揭示，不循环干扰阅读。像素头像与品牌图形使用当前主题色和蓝黄信号色。

## 6. Blog

### 归档

Blog 使用时间线归档：

- 文章按发布时间倒序
- 年份作为大号装饰数字
- 月份与条目保持清晰层级
- 列表预览取正文首个非标题文本块
- 封面与缩略图保留原始比例

### 文章详情

文章页是站点的核心阅读场景：

- 标题使用文章语言
- Meta 包含作者、日期、阅读量、语言、标签和更新时间
- 封面和正文图片保留尺寸，减少布局跳动
- 正文宽度以阅读舒适度优先
- H2–H4 进入目录
- 桌面端提供目录和阅读快捷栏
- 窄屏隐藏侧栏，保留正文和返回入口

正文服务端渲染 KaTeX 与 Shiki，浏览器端由只读 Tiptap 接管。禁用 JavaScript 时仍可完整阅读。

## 7. Project

Project 页面使用 `67.5rem` feature 宽度，两张项目卡片保持等大布局。

每张卡片包含：

- 项目 Logo
- 双语简介
- 技术标签
- 产品入口
- GitHub 源码入口
- 可选本地演示

DiDa 演示展示语音转任务整理动画；Clipper 演示展示网页正文到 Markdown 草稿。两个演示都是本地状态，不访问账号、浏览器标签页或云端数据。

## 8. Skill

Skill 页面使用双列卡片，移动端单列。每张卡片：

- 4:3 插图
- 项目名
- 副标题
- 双语描述
- GitHub 入口

卡片 hover / focus 时箭头移动，变化轻微，不遮挡插图和文字。

## 9. 错误页

`403`、`404`、`500`、`502` 使用统一布局：

- 大插图
- 编号与标题
- 一句说明
- 返回首页按钮

根 `/404`、`/500` 返回真实 HTTP 状态；显式预览路径不携带公共 Header，并设置 noindex。

## 10. 动效系统

动效 Token 定义在 `src/config/motion.ts`。

原则：

- 只在状态变化时运动
- 使用短时长、低位移、清晰 easing
- 路由过渡解释栏目关系
- 页面隐藏或离开时停止动画
- `prefers-reduced-motion: reduce` 时保留状态，移除非必要运动

主题切换使用 View Transition 快照；系统主题变化、语言切换和初次载入不播放完整过渡。

## 11. 可访问性

- 每个页面保留 `main-content` 跳转链接
- 图标按钮带 aria-label
- 进度条使用 progressbar 语义
- 目录按钮维护 aria-expanded 与 aria-controls
- 自定义交互元素保留键盘路径
- 颜色对比在小字号文本上使用增强值
- 图片有描述性 alt；装饰图片 alt 为空
- 动画状态不作为唯一信息载体

## 12. 内容与安全

- Blog 只展示 published 且非 draft 内容
- PageHush 查询同时排除软删除记录
- 危险链接、data image 和脚本不会进入正文 HTML
- 图片代理只公开当前发布文章引用的素材
- 凭据只在服务端使用
- 不执行任意 MDX 组件或 import

## 13. 维护规则

修改视觉或交互时：

1. 先更新 Token 或公共组件，再考虑页面私有样式
2. 保持明暗主题同等可用
3. 检查 390px 手机宽度
4. 检查减少动画偏好
5. 键盘路径与屏幕阅读器语义不能退化
6. 新内容类型必须经过 Schema 校验
7. 涉及 PageHush 数据时保持只读边界

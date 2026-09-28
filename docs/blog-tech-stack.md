# 个人博客技术栈规划

> 基于 Astro 构建个人博客，整体目标是：简洁、可控、易维护，同时保留动态交互、动画和后续扩展能力。

全项目栏目统一为 **Index / Writing / Fragments / Projects / Finder / News / Now / Profile**，名称与 `blog-sections.md`、路由目录、内容集合和设计稿保持一致。

---

## 1. 核心框架

### Astro

作为整个博客的核心框架。

主要负责：

- 页面路由
- 静态页面生成
- 内容管理
- SEO
- Markdown / MDX 渲染
- 局部交互组件加载
- 后续按需动态渲染

整体采用 **Static First** 的方式：

- 能静态生成的页面尽量静态生成
- 需要交互的部分局部使用 React
- 需要实时数据时再局部使用 SSR / Server Islands

---

## 2. 开发语言

### TypeScript

全项目统一使用 TypeScript。

主要用于：

- Astro 页面和组件
- React 交互组件
- Content Collections Schema
- 工具函数
- 动画逻辑
- API 数据类型

这样可以保证后续项目规模扩大后仍然容易维护。

---

## 3. UI 组件

### 自定义 Astro Components

不使用大型成品 UI 组件库。

基础 UI 组件全部自己构建，例如：

- Button
- Link
- Navigation
- Header
- Footer
- Container
- Section
- ArticleItem
- FragmentItem
- ProjectCard
- Tag
- Divider
- ThemeToggle
- ExternalLink

这样做的主要原因：

- 样式完全可控
- 交互效果完全可控
- 不会带入组件库默认设计风格
- 更适合个人博客的极简视觉
- 可以针对博客本身做更细致的交互设计

大多数 UI 都优先使用 Astro Component。

---

## 4. React

React 不作为整站 UI 框架。

只在真正需要复杂交互和状态管理的模块中使用。

可能使用 React 的地方包括：

- Finder
- 搜索
- Command Palette
- 复杂 Project Demo
- 交互式数据可视化
- 实时状态组件
- 复杂动画组件

整体结构：

```text
Astro
├── 大部分页面和 UI
└── React Islands
    └── 复杂交互区域
```

这样可以避免把整个 Astro 网站变成 React SPA。

---

## 5. 样式系统

### Tailwind CSS

全站样式统一使用 Tailwind CSS。

主要负责：

- 布局
- 间距
- Typography
- 响应式设计
- Dark Mode
- Hover 状态
- 边框
- 圆角
- 基础视觉状态

建议建立自己的 Design Token，而不是在页面中随意使用不同数值。

例如：

```text
Color
├── background
├── foreground
├── muted
├── border
└── accent

Typography
├── sans
├── mono
└── serif

Spacing
Radius
Shadow
```

目标是让整个博客拥有统一的视觉语言。

---

## 6. 动画

### Motion

全站动画统一使用 **Motion（原 Framer Motion）**。

不再同时引入多套动画库。

不计划使用：

- GSAP
- AOS
- Animate.css
- 多套不同动画系统

Motion 负责：

- 页面进入动画
- 页面退出动画
- Hover 动画
- 列表 Stagger
- Scroll Animation
- Layout Animation
- Shared Element Animation
- Spring Animation
- Finder 交互动画
- Project Demo 动画

### Astro 页面

普通 Astro 页面可以直接使用 Motion for JavaScript。

用于：

- 页面内容进入
- Scroll Reveal
- Hover
- DOM Animation

### React 组件

React Island 中使用 Motion for React。

用于：

- AnimatePresence
- Layout Animation
- Shared Element
- Gesture
- Spring
- 复杂状态切换

整体原则：

```text
Astro
→ Motion for JavaScript

React Island
→ Motion for React
```

所有动画使用统一的 Motion Token。

例如：

```text
Fast
Normal
Slow

Soft Spring
Snappy Spring

Small Distance
Medium Distance
```

避免每个页面使用完全不同的动画参数。

---

## 7. 图标

### Lucide

全站统一使用 Lucide Icons。

主要原因：

- 风格简洁
- 线性图标适合极简博客
- 图标数量充足
- 风格统一
- 支持 Astro
- 支持 React

Astro Component 使用：

```text
@lucide/astro
```

React Island 使用：

```text
lucide-react
```

全站不混用其他图标库。

例如：

```text
Writing
→ FileText

Fragments
→ StickyNote

Projects
→ Code / Blocks

Finder
→ Folder / FolderOpen

News
→ Newspaper

Now
→ Activity

Profile
→ User

Search
→ Search

Theme
→ Sun / Moon

External Link
→ ExternalLink
```

---

## 8. 内容系统

### Astro Content Collections

用于管理主要内容。

建议建立：

```text
src/content/

├── writing/
├── fragments/
├── projects/
├── finder/
├── now/
└── profile/
```

分别对应：

- Writing
- Fragments
- Projects
- Finder
- Now
- Profile

Content Collections 负责：

- 内容读取
- Frontmatter 类型校验
- 时间排序
- 内容分类
- Metadata
- 页面生成

Now 和 Profile 的静态正文分别放在 `src/content/now/`、`src/content/profile/`，也由 Content Collections 校验。News 用于外部 AI 信息与动态，使用 `src/features/news/` 中的数据类型和 Provider 接口，不混入个人内容集合。

---

## 9. Markdown / MDX

### Markdown

普通内容默认使用 Markdown。

适合：

- Writing
- Fragments
- Profile
- Now

### MDX

需要插入交互组件时使用 MDX。

适合：

- Interactive Writing
- Project Demo
- 数据可视化
- React Component
- Motion Demo

原则：

```text
普通内容
→ Markdown

需要交互
→ MDX
```

---

## 10. Writing

Writing 主要使用：

- Astro
- Content Collections
- Markdown / MDX
- Tailwind CSS
- Motion
- Lucide
- Shiki

功能包括：

- 文章列表
- 时间排序
- 文章详情
- 阅读时间
- 代码高亮
- 图片
- Topic
- 上一篇 / 下一篇
- RSS

---

## 11. Fragments

Fragments 主要使用：

- Astro
- Content Collections
- Markdown / MDX
- Tailwind CSS
- Motion

功能包括：

- Fragments 列表
- 最近更新时间
- Note 详情
- Internal Link
- Related Fragments

后期可以继续加入：

- Backlinks
- Knowledge Graph

第一版不需要额外数据库。

---

## 12. Projects

Projects 同时承担：

- 完整项目
- 技术实验
- UI Demo
- 动画 Demo
- WebGL
- 数据可视化

基础项目使用：

- Astro
- MDX
- Tailwind CSS
- Motion

复杂交互项目可以使用：

- React
- Motion for React
- Canvas
- WebGL

如果以后需要 3D，可以再考虑：

- Three.js

不在第一版提前引入。

---

## 13. Finder

Finder 是博客里最适合做特殊 UI 的页面。

主要功能：

- 分类浏览收藏内容
- Design
- Engineering
- Tools
- Reading
- Inspiration
- Websites

每个内容可以包含：

- 名称
- URL
- 简介
- Category
- 添加日期
- 个人备注

第一版可以使用：

- Astro
- Content Collections
- Tailwind CSS
- Motion
- Lucide

如果以后 Finder 需要更复杂的交互，例如：

- 文件夹切换
- Quick Preview
- Search
- Keyboard Navigation
- Grid / List View

再将 Finder 的交互区域升级为 React Island。

---

## 14. Now

第一版 Now 使用静态内容即可。

技术：

- Astro
- Markdown / MDX
- Tailwind CSS

后续如果需要实时内容，可以加入：

- GitHub Activity
- Spotify / Last.fm
- 当前项目状态
- 外部 API

届时再局部使用：

- Astro SSR
- Server Islands
- API Route
- React Island

不需要为了 Now 把整个网站改成动态站点。

---

## 15. Profile

Profile 保持完全静态。

使用：

- Astro
- Markdown / MDX
- Tailwind CSS
- Motion

主要展示：

- 个人介绍
- 关注方向
- 兴趣
- 经历
- GitHub
- Email
- 社交链接

---

## 16. 图片

使用 Astro 自带图片能力：

```text
<Image />
<Picture />
```

主要用于：

- 自动图片优化
- 响应式图片
- Project Screenshot
- Writing 图片
- Profile Image

不需要额外引入图片组件库。

---

## 17. 代码高亮

使用 Astro 自带的 Shiki。

用于：

- Writing
- Fragments
- Project 技术说明

不额外引入 Prism 或 Highlight.js。

---

## 18. SEO

全站需要：

- Title
- Description
- Open Graph
- Canonical URL
- Sitemap
- RSS

推荐：

- Astro Head
- `@astrojs/sitemap`
- `@astrojs/rss`

---

## 19. Dark Mode

Dark Mode 使用：

- Tailwind CSS
- CSS Variables
- localStorage
- `prefers-color-scheme`

不需要 React。

Theme Toggle 使用自定义 Astro Component。

---

## 20. 搜索

第一版可以暂时不加入。

后期如果内容增加，可以考虑：

- Pagefind
- 自定义搜索
- Command Palette

如果增加 Command Palette，可以使用：

- React
- Motion
- Lucide
- 自定义 UI

---

## 21. 部署

推荐：

### Cloudflare

适合：

- Astro 静态站点
- CDN
- 后续动态 API
- Server Functions

或者：

### Vercel

适合：

- Astro
- Server Rendering
- Serverless Functions

第一版两者都可以。

---

# 22. 最终技术栈

| 类型 | 技术 |
|---|---|
| Framework | Astro |
| Language | TypeScript |
| UI | 自定义 Astro Components |
| Interactive UI | React Islands |
| CSS | Tailwind CSS |
| Animation | Motion |
| Icons | Lucide |
| Content | Astro Content Collections |
| Writing | Markdown + MDX |
| Code Highlight | Shiki |
| Image | Astro Image / Picture |
| RSS | @astrojs/rss |
| Sitemap | @astrojs/sitemap |
| Dynamic Data | Astro SSR / Server Islands（后期） |
| Deployment | Cloudflare / Vercel |

---

# 23. 第一版核心依赖

第一版真正需要的依赖保持尽量简单：

```text
Astro
TypeScript
Tailwind CSS
React
Motion
Lucide
MDX
```

React 只用于需要复杂交互的部分。

---

# 24. 技术原则

## 1. UI 自己构建

不依赖大型 UI 组件库。

保证：

- 样式统一
- 交互统一
- 视觉独立
- 可以自由修改

## 2. Astro First

大部分页面使用 Astro。

不要因为少量交互而让整个网站变成 React。

## 3. Tailwind 统一样式

所有页面统一使用 Tailwind CSS 和自己的 Design Token。

## 4. Motion 统一动画

全站动画统一使用 Motion。

不要混入多套动画库。

## 5. Lucide 统一图标

整个网站只使用一套图标系统。

## 6. Static First

能静态就静态。

需要：

- 交互
- 实时数据
- API

时，再局部增加对应能力。

## 7. 按需增加依赖

第一版不提前加入：

- 数据库
- CMS
- Redux
- Zustand
- GSAP
- Three.js
- WebSocket
- 大型后端

等真正出现需求时再引入。

---

# 25. 整体架构

```text
                               Astro
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
           Content               UI               Dynamic
              │                  │                  │
     Writing / Fragments   Astro Components     News / Now
     Projects / Finder           │               Live Data
        Now / Profile            │                  │
              │             Tailwind CSS        SSR / API
        Markdown / MDX           │                  │
              │                Motion          Server Island
      Content Collections        │
                               Lucide
                                 │
                           React Islands
                          （复杂交互时）
```

最终目标是：

> Astro 负责网站结构和内容，Tailwind 负责视觉，Motion 负责动画，Lucide 负责图标，React 只负责真正复杂的交互。

# 内容编写约定

下面是内容格式说明，当前项目中没有创建示例文章或个人资料。所有内容字段以 `src/lib/content/schemas.ts` 为准。

## 通用约定

- 文件名使用稳定的英文小写与短横线，例如 `astro-content-layer.md`。可以建立子目录；文件路径决定 Content Layer 的条目 ID。
- 普通内容使用 Markdown；需要插入组件时使用 MDX。
- `title`、`description` 必填；`draft` 默认为 `false`。
- 日期建议使用带时区的 ISO 格式，如 `2026-09-28T12:00:00+08:00`。只有日期时可使用加引号的 `"2026-09-28"`。
- `updatedAt` 不应早于 `publishedAt`；`tags` 默认为空数组。
- `draft: true` 的条目不由默认公共查询和 RSS 返回；详情路由也必须采用相同过滤方式。
- 文件移动会改变条目 ID 与链接，已发布内容应谨慎调整路径。
- 封面使用相对路径引用本地图片，例如 `../../assets/images/example.png`；有封面时同时提供描述性的 `coverAlt`。

## Writing

存放于 `src/content/writing/`。

```yaml
---
title: 文章标题
description: 文章摘要
publishedAt: 2026-09-28T12:00:00+08:00
updatedAt: 2026-09-29T12:00:00+08:00 # 可选
tags: [astro, typescript]
topic: Engineering # 可选
draft: true
---
```

`cover`、`coverAlt` 可选；正文在 Frontmatter 后编写。阅读时间与上一篇 / 下一篇在文章功能实现时添加，不要求手工维护 Frontmatter。

## Fragments

存放于 `src/content/fragments/`，基础字段同 Writing，不包含 `topic` 和封面字段。

可选的 `related` 数组填写其他 Fragment 的条目 ID，例如 `related: [learning/astro]`。Astro `reference('fragments')` 会校验关联条目是否存在。

列表后续按 `updatedAt ?? publishedAt` 排序，体现持续补充的内容。

## Projects

存放于 `src/content/projects/`。

```yaml
---
title: 作品名称
description: 作品介绍
publishedAt: 2026-09-28T12:00:00+08:00
kind: project
status: in-progress
stack: [Astro, TypeScript]
tags: [web]
url: https://example.com # 可选，演示或成品地址
repository: https://github.com/example/project # 可选
draft: true
---
```

- `kind`：`project`、`experiment`、`creation`；默认 `project`。
- `status`：`in-progress`、`completed`、`archived`；默认 `completed`。
- `updatedAt`、`cover`、`coverAlt` 可选；`stack`、`tags` 默认为空数组。
- 交互演示可放在 MDX 中，复杂状态才使用 React Island。

## Finder

存放于 `src/content/finder/`，支持 Markdown、MDX 和单条 JSON 文件。

```json
{
  "title": "收藏名称",
  "description": "简短介绍",
  "url": "https://example.com",
  "category": "engineering",
  "addedAt": "2026-09-28T12:00:00+08:00",
  "tags": ["reference"],
  "note": "收藏理由",
  "draft": true
}
```

分类为 `design`、`engineering`、`tools`、`reading`、`inspiration`、`websites`。更详细的个人备注可以写在 Markdown 正文中。URL 只接受 HTTP(S)。

## Now / Profile

后续分别创建 `src/content/now/current.md` 和 `src/content/profile/index.md`。

```yaml
---
title: 页面标题
description: 页面描述
updatedAt: 2026-09-28T12:00:00+08:00
draft: true
---
```

各自保持一篇当前内容，正文用于编写状态或个人介绍。页面路由尚未实现，添加内容文件不会自动生成页面。

## News

News 不使用这些本地内容集合。外部 Provider 输出统一的 `NewsItem`，包含标题、原文 URL、分类、发布时间与来源。需要信息源后再实现适配器和刷新机制。

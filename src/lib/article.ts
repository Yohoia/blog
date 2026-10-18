import { MarkdownManager } from "@tiptap/markdown";
import { generateHTML } from "@tiptap/html/server";
import type { JSONContent } from "@tiptap/core";
import { codeToTokens, bundledLanguages, type BundledLanguage } from "shiki";
import katex from "katex";
import dimensions from "./image-dimensions.json";
import { simpleEditorExtensions, documentText } from "./tiptap/extensions";
export interface Heading {
  depth: number;
  slug: string;
  text: string;
}
function safeUrl(value: unknown, image = false): boolean {
  return (
    typeof value === "string" &&
    (/^(?:https?:\/\/|\/(?!\/)|\.\.?\/|#)/i.test(value) ||
      (!image && /^mailto:/i.test(value)))
  );
}
/** Source HTML is interpreted only through the Tiptap schema; executable MDX is never evaluated. */
export async function renderArticle(markdown: string) {
  const extensions = simpleEditorExtensions();
  const content = new MarkdownManager({ extensions }).parse(markdown);
  const headings: Heading[] = [];
  const slugs = new Map<string, number>();
  async function visit(node: JSONContent): Promise<void> {
    if (node.type === "heading") {
      const text = documentText(node);
      const base =
        text
          .toLowerCase()
          .trim()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(/\s+/g, "-") || "section";
      const count = slugs.get(base) || 0;
      slugs.set(base, count + 1);
      const slug = count ? `${base}-${count}` : base;
      node.attrs = { ...node.attrs, id: slug };
      headings.push({ depth: Number(node.attrs.level), slug, text });
    }
    if (node.type === "image" && !safeUrl(node.attrs?.src, true)) {
      node.attrs = {
        ...node.attrs,
        src: "",
        alt: node.attrs?.alt || "Image unavailable",
      };
    }
    if (node.type === "image") {
      const size = dimensions[node.attrs?.src as keyof typeof dimensions];
      if (size)
        node.attrs = { ...node.attrs, width: size.width, height: size.height };
    }
    node.marks = node.marks?.filter(
      (mark) => mark.type !== "link" || safeUrl(mark.attrs?.href),
    );
    if (node.type === "codeBlock") {
      const language = String(node.attrs?.language || "text");
      const { tokens } = await codeToTokens(documentText(node), {
        lang:
          language in bundledLanguages ? (language as BundledLanguage) : "text",
        themes: { light: "github-light", dark: "github-dark" },
      });
      node.attrs = {
        ...node.attrs,
        highlight: tokens.map((line) =>
          line.map(({ content, htmlStyle }) => ({
            content,
            color: htmlStyle?.color,
            dark: htmlStyle?.["--shiki-dark"],
          })),
        ),
      };
    }
    for (const child of node.content ?? []) await visit(child);
  }
  await visit(content);
  let html = generateHTML(content, extensions);
  // Tiptap's mathematics node views hydrate to KaTeX. Render the same nodes for SEO/no-JS.
  html = html.replace(
    /<(span|div)([^>]*data-type="(?:inline|block)-math"[^>]*)><\/\1>/g,
    (match, tag: string, attrs: string) => {
      const latex = (attrs.match(/data-latex="([^"]*)"/)?.[1] ?? "")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
      return `<${tag}${attrs}>${katex.renderToString(latex, { displayMode: tag === "div", throwOnError: false, trust: false, strict: "ignore" })}</${tag}>`;
    },
  );
  html = html.replace(
    /<input(?=[^>]*type="checkbox")([^>]*)>/g,
    '<input disabled tabindex="-1"$1>',
  );
  return { content, html, headings };
}

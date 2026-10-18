import { Extension, type JSONContent } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Markdown } from "@tiptap/markdown";
import Mathematics from "@tiptap/extension-mathematics";
import HorizontalRuleBase from "@tiptap/extension-horizontal-rule";
import CodeBlockBase from "@tiptap/extension-code-block";
import { DOMSerializer, type DOMOutputSpec } from "@tiptap/pm/model";
interface CodeToken {
  content: string;
  color?: string;
  dark?: string;
}
function codeSpec(attrs: Record<string, unknown>, text: string): DOMOutputSpec {
  const lines = attrs.highlight as CodeToken[][] | undefined;
  return [
    "pre",
    { class: "tiptap-code-block" },
    [
      "code",
      {},
      ...(lines
        ? lines.flatMap((line, i) => [
            ...(i ? ["\n"] : []),
            ...line.map(
              (token) =>
                [
                  "span",
                  {
                    style: token.color
                      ? `color:${token.color};--shiki-dark:${token.dark ?? token.color}`
                      : "",
                  },
                  token.content,
                ] as DOMOutputSpec,
            ),
          ])
        : [text]),
    ],
  ];
}
const ReadOnlyCodeBlock = CodeBlockBase.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      highlight: { default: null, rendered: false },
    };
  },
  renderHTML({ node }) {
    return codeSpec(node.attrs, node.textContent);
  },
  addNodeView() {
    return ({ node }) => ({
      dom: DOMSerializer.renderSpec(
        document,
        codeSpec(node.attrs, node.textContent),
      ).dom as HTMLElement,
    });
  },
});
// Derived from the official Simple Editor node, retaining its wrapper structure.
const HorizontalRule = HorizontalRuleBase.extend({
  renderHTML() {
    return ["div", { "data-type": this.name }, ["hr"]];
  },
});
const HeadingIds = Extension.create({
  name: "headingIds",
  addGlobalAttributes() {
    return [{ types: ["heading"], attributes: { id: { default: null } } }];
  },
});
/** Same document schema as PageHush's Simple Editor; editing-only controls are omitted. */
export function simpleEditorExtensions() {
  return [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false,
      undoRedo: false,
      link: {
        openOnClick: true,
        enableClickSelection: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      },
    }),
    HorizontalRule,
    ReadOnlyCodeBlock,
    HeadingIds,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    TableKit.configure({ table: { resizable: false, renderWrapper: true } }),
    Image.configure({
      HTMLAttributes: { referrerpolicy: "no-referrer", loading: "lazy" },
    }),
    Typography,
    Superscript,
    Subscript,
    Markdown,
    Mathematics.configure({
      katexOptions: { throwOnError: false, strict: "ignore", trust: false },
    }),
  ];
}
export function documentText(node: JSONContent): string {
  return node.text ?? node.content?.map(documentText).join("") ?? "";
}

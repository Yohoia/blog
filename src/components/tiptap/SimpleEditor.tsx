"use client";
// Read-only adaptation of Tiptap UI Components' Simple Editor (MIT).
// Upstream: https://github.com/ueberdosis/tiptap-ui-components
// See tiptap-template-LICENSE.md. Retains PageHush's document extensions and template structure.
import { useEffect, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { simpleEditorExtensions } from "@/lib/tiptap/extensions";
export function SimpleEditor({
  content,
  html,
  ariaLabel,
}: {
  content: JSONContent;
  html: string;
  ariaLabel: string;
}) {
  const [ready, setReady] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: simpleEditorExtensions(),
    content,
    editorProps: {
      attributes: {
        class: "simple-editor readonly",
        role: "document",
        "aria-label": ariaLabel,
        tabindex: "-1",
      },
    },
    onCreate: ({ editor }) => {
      editor.view.dom
        .querySelectorAll<HTMLInputElement>("input[type=checkbox]")
        .forEach((input) => {
          input.disabled = true;
          input.tabIndex = -1;
        });
      setReady(true);
    },
  });
  useEffect(() => {
    if (ready) document.dispatchEvent(new Event("article:ready"));
  }, [ready]);
  return (
    <div
      className="simple-editor-wrapper"
      data-tiptap-template="simple"
      data-readonly="true"
    >
      {!ready && (
        <div
          className="simple-editor readonly"
          role="document"
          aria-label={ariaLabel}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <EditorContext.Provider value={{ editor }}>
        <div hidden={!ready}>
          <EditorContent editor={editor} className="simple-editor-content" />
        </div>
      </EditorContext.Provider>
    </div>
  );
}

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Menubar } from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";

const RichTextEditor = ({ field }: any) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[200px] p-4 dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Customize your full description 😁</p>",
    immediatelyRender: false,
  });

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handler = () => forceUpdate((i) => i + 1);
    editor.on("transaction", handler);
    editor.on("selectionUpdate", handler);

    return () => {
      editor.off("transaction", handler);
      editor.off("selectionUpdate", handler);
    };
  }, [editor]);

  if (!editor) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-full rounded-lg border border-input overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

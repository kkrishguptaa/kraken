"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Play,
  Quote,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Markdown } from "tiptap-markdown";

interface EditorProps {
  initialContent?: string;
  onSave?: (content: string) => Promise<void>;
  onPublish?: () => Promise<void>;
  status?: "draft" | "published";
}

export default function Editor({
  initialContent = "",
  onSave,
  onPublish,
  status = "draft",
}: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        inline: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
      Markdown,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none focus:outline-none min-h-[500px] font-serif",
      },
    },
  });

  // Autosave logic
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      const markdown = (
        editor.storage as { markdown: { getMarkdown: () => string } }
      ).markdown.getMarkdown();
      onSave?.(markdown);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [editor, onSave]);

  if (!editor) {
    return null;
  }

  const handleManualSave = async () => {
    setIsSaving(true);
    const markdown = (
      editor.storage as { markdown: { getMarkdown: () => string } }
    ).markdown.getMarkdown();
    await onSave?.(markdown);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handlePublish = async () => {
    if (
      !confirm(
        "Are you sure you want to publish this edition? It will be sent to subscribers and live on your publication.",
      )
    ) {
      return;
    }

    setIsPublishing(true);
    const markdown = (
      editor.storage as { markdown: { getMarkdown: () => string } }
    ).markdown.getMarkdown();
    await onSave?.(markdown);
    await onPublish?.();
    setIsPublishing(false);
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <div className="border border-ink-border bg-white no-round flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-ink-border bg-paper sticky top-0 z-10 overflow-x-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("bold") ? "bg-zinc-200" : ""}`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("italic") ? "bg-zinc-200" : ""}`}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-ink-border mx-1" />
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("heading", { level: 1 }) ? "bg-zinc-200" : ""}`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("heading", { level: 2 }) ? "bg-zinc-200" : ""}`}
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-ink-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("bulletList") ? "bg-zinc-200" : ""}`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("orderedList") ? "bg-zinc-200" : ""}`}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-zinc-100 ${editor.isActive("blockquote") ? "bg-zinc-200" : ""}`}
        >
          <Quote size={18} />
        </button>
        <div className="w-px h-6 bg-ink-border mx-1" />
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-2 hover:bg-zinc-100"
        >
          <Play size={18} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleManualSave}
          disabled={isSaving || isPublishing}
          className="flex items-center gap-2 px-4 py-1 bg-ink text-paper no-round text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        {status === "draft" && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || isSaving}
            className="flex items-center gap-2 px-4 py-1 border border-ink text-ink no-round text-sm hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            {isPublishing ? "Publishing..." : "Publish Edition"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

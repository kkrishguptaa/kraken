"use client";

import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { saveTemplate } from "@/app/actions/templates";

import type { templates as templatesTable } from "@/db/schema";

interface TemplateManagerProps {
  publicationId: string;
  onApply: (content: string) => void;
  currentContent: string;
  templates: (typeof templatesTable.$inferSelect)[];
}

export default function TemplateManager({
  publicationId,
  onApply,
  currentContent,
  templates: initialTemplates,
}: TemplateManagerProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAsTemplate = async () => {
    const name = prompt("Enter a name for this template");
    if (!name) return;

    setIsSaving(true);
    const newTemplate = await saveTemplate(publicationId, name, currentContent);
    setTemplates([...templates, newTemplate]);
    setIsSaving(false);
  };

  const handleApply = (content: string) => {
    if (
      confirm(
        "Applying a template will replace your current draft content. Continue?",
      )
    ) {
      onApply(content);
    }
  };

  return (
    <div className="border border-ink-border p-6 no-round bg-[#FDFCFB]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold text-muted-ink">
          Issue Templates
        </h3>
        <button
          type="button"
          onClick={handleSaveAsTemplate}
          disabled={isSaving}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-muted-ink transition-colors"
        >
          <Plus size={12} />
          Save Current as Template
        </button>
      </div>

      <div className="space-y-4">
        {templates.length === 0 ? (
          <p className="italic text-muted-ink font-serif text-sm">
            No templates saved yet.
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex justify-between items-center group"
            >
              <button
                type="button"
                onClick={() => handleApply(template.content)}
                className="flex items-center gap-2 font-serif text-sm hover:underline"
              >
                <FileText size={14} className="text-muted-ink" />
                {template.name}
              </button>
              <span className="text-[10px] font-sans text-muted-ink opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                Click to Apply
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

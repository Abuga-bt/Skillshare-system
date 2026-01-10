import { Pencil, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  variant?: "title" | "subtitle" | "body";
  multiline?: boolean;
  maxLength?: number;
}

const variantClasses = {
  title: "text-3xl md:text-4xl font-display font-bold text-foreground",
  subtitle: "text-lg font-medium text-muted-foreground",
  body: "text-base text-foreground leading-relaxed",
};

export const EditableText = ({
  value,
  onSave,
  placeholder = "Click to edit...",
  variant = "body",
  multiline = false,
  maxLength,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <div className="flex items-start gap-2 w-full">
        <InputComponent
          ref={inputRef as any}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={maxLength}
          className={cn(
            "flex-1 bg-secondary/50 border border-input rounded-lg px-4 py-2",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            "transition-all duration-200",
            variantClasses[variant],
            multiline && "min-h-[120px] resize-none"
          )}
          placeholder={placeholder}
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group cursor-pointer flex items-start gap-2 rounded-lg",
        "hover:bg-secondary/30 transition-colors duration-200 -mx-2 px-2 py-1"
      )}
    >
      <span
        className={cn(
          variantClasses[variant],
          !value && "text-muted-foreground italic"
        )}
      >
        {value || placeholder}
      </span>
      <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
    </div>
  );
};

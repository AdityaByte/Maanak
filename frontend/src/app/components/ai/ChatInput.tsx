"use client";

import React, { useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  CornerDownLeft,
  FileText,
} from "lucide-react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask Maanak AI about BIS standards, certifications, test methods, or IS codes...",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleClear = () => {
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`group relative flex flex-col rounded-2xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-md transition-all duration-200 hover:border-border/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${
          disabled ? "opacity-80" : ""
        }`}
      >
        {/* Top Input Row */}
        <div className="flex items-start gap-2.5">
          {/* AI Sparkle Icon indicator */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5 transition-colors group-focus-within:bg-primary/15">
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none max-h-36 overflow-y-auto leading-relaxed"
          />

          {/* Clear Button (shown if text exists) */}
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear message"
              title="Clear"
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <Bot className="h-3 w-3 text-primary" />
              <span>BIS RAG Engine</span>
            </span>
            <span className="hidden md:inline-flex text-[11px] text-muted-foreground/60">
              Press <kbd className="font-semibold text-foreground/80">Enter</kbd> to send, <kbd className="font-semibold text-foreground/80">Shift+Enter</kbd> for new line
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSend}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span>Send</span>
              {disabled ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle Disclaimer */}
      <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
        Maanak AI searches indexed BIS standards to generate contextual recommendations. Verify official standards for legal compliance.
      </p>
    </div>
  );
}

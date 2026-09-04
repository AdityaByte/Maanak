import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "active" | "superseded" | "withdrawn";
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-primary/10 text-primary border-primary/20",
  secondary:
    "bg-muted text-muted-foreground border-border",
  outline:
    "border-border text-foreground bg-transparent",
  active:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  superseded:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  withdrawn:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const dotColors: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary",
  secondary: "bg-muted-foreground",
  outline: "bg-foreground",
  active: "bg-emerald-500",
  superseded: "bg-amber-500",
  withdrawn: "bg-rose-500",
};

export default function Badge({
  variant = "default",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

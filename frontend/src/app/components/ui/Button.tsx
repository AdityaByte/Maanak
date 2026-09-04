import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm focus-visible:ring-primary/40",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 shadow-sm focus-visible:ring-muted-foreground/30",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted hover:border-border/80 shadow-xs focus-visible:ring-primary/40",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-primary/30",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-500/40",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-9.5 px-4 text-sm rounded-xl gap-2",
  lg: "h-11 px-5 text-base rounded-xl gap-2.5",
  icon: "h-9 w-9 p-0 rounded-xl justify-center",
};

export default function Button({
  variant = "default",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

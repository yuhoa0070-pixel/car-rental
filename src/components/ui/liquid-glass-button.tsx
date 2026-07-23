"use client";

import React from "react";

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-xs font-bold gap-2",
      lg: "px-6 py-3 text-sm font-bold gap-2.5",
    }[size];

    // Color theme variants with liquid glass reflections
    const variantClasses = {
      primary:
        "bg-gradient-to-b from-blue-500/90 via-blue-600/80 to-blue-700/95 text-white border-white/35 shadow-[0_4px_20px_rgba(37,99,235,0.45),inset_0_1px_2px_rgba(255,255,255,0.7)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6),inset_0_1px_3px_rgba(255,255,255,0.9)] hover:brightness-110",
      secondary:
        "bg-gradient-to-b from-white/80 via-white/50 to-white/30 dark:from-white/20 dark:via-white/10 dark:to-white/5 text-gray-900 dark:text-white border-white/70 dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/90 hover:shadow-[0_6px_25px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(255,255,255,1)]",
      danger:
        "bg-gradient-to-b from-rose-500/90 via-red-600/80 to-rose-700/95 text-white border-white/35 shadow-[0_4px_20px_rgba(225,29,72,0.45),inset_0_1px_2px_rgba(255,255,255,0.7)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.6),inset_0_1px_3px_rgba(255,255,255,0.9)] hover:brightness-110",
      ghost:
        "bg-transparent hover:bg-white/20 dark:hover:bg-white/10 text-gray-700 dark:text-zinc-200 border-transparent",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          relative inline-flex items-center justify-center rounded-full border
          backdrop-blur-xl transition-all duration-300 ease-out overflow-hidden
          select-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          group ${sizeClasses} ${variantClasses} ${className}
        `}
        {...props}
      >
        {/* Liquid Top Specular Reflection Bubble Layer */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none group-hover:opacity-100 transition-opacity" />

        {/* Liquid Shimmer Glow on Hover */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        {/* Liquid Inner Ripple Highlight */}
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-white/5 group-active:bg-white/20 transition-colors pointer-events-none" />

        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-1.5 drop-shadow-xs">
          {children}
        </span>
      </button>
    );
  }
);

LiquidButton.displayName = "LiquidButton";

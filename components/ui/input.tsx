import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-xl border border-[color:var(--dashboard-border)] bg-white/95 px-4 py-2 text-sm text-[color:var(--dashboard-text)] placeholder:text-[color:var(--dashboard-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dashboard-accent-subtle)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

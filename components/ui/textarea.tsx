import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-28 w-full rounded-xl border border-[color:var(--dashboard-border)] bg-white/95 px-4 py-3 text-sm text-[color:var(--dashboard-text)] placeholder:text-[color:var(--dashboard-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dashboard-accent-subtle)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

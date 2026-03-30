import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-[color:var(--dashboard-border)] bg-[color:var(--dashboard-panel)] p-6 shadow-[0_8px_24px_rgba(38,34,27,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

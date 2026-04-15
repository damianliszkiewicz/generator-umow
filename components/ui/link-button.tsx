import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  Pick<ButtonProps, "variant" | "size"> & {
    children: ReactNode;
  };

export function LinkButton({
  children,
  className,
  size,
  variant,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}

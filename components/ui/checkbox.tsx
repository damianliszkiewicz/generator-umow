import { cn } from "@/lib/utils";

type CheckboxProps = {
  id?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export function Checkbox({ id, checked, onCheckedChange, className, disabled }: CheckboxProps) {
  return (
    <input
      id={id}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded-md border-[color:var(--dashboard-border)] text-[color:var(--dashboard-accent)] focus:ring-[color:var(--dashboard-accent-subtle)]",
        className,
      )}
      checked={checked}
      onChange={(event) => onCheckedChange(event.target.checked)}
      disabled={disabled}
    />
  );
}

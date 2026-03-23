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
      className={cn("h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400", className)}
      checked={checked}
      onChange={(event) => onCheckedChange(event.target.checked)}
      disabled={disabled}
    />
  );
}

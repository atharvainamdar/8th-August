import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "lumi-btn",
        variant === "primary" && "lumi-btn-primary",
        variant === "secondary" && "lumi-btn-secondary",
        variant === "ghost" && "lumi-btn-ghost",
        className
      )}
      {...props}
    />
  );
}

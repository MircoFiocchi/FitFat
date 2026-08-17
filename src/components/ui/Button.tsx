import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  loading = false,
  loadingLabel = "Guardando…",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover focus-visible:outline-primary",
    secondary:
      "bg-card text-foreground border border-border hover:bg-background focus-visible:outline-primary",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}

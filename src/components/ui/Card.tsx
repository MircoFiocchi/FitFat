import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-sm shadow-black/20 sm:p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

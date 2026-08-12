type AlertProps = {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
};

export function Alert({ variant, children }: AlertProps) {
  const styles = {
    error: "bg-red-950/50 text-danger border-red-900/60",
    success: "bg-green-950/50 text-success border-green-900/60",
    info: "bg-card text-muted border-border",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${styles[variant]}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

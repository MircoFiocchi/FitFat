import { Card } from "@/components/ui/Card";

export function EmptyState() {
  return (
    <Card className="text-center">
      <p className="text-base font-medium text-foreground">
        Todavía no tenés registros de peso.
      </p>
      <p className="mt-2 text-sm text-muted">
        Agregá tu primer registro para comenzar a ver tu evolución.
      </p>
    </Card>
  );
}

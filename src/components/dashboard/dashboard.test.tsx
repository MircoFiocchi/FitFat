import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeightForm } from "@/components/dashboard/WeightForm";
import { EmptyState } from "@/components/dashboard/EmptyState";

describe("WeightForm", () => {
  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<WeightForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /guardar peso/i }));

    expect(screen.getByText("El peso es obligatorio")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<WeightForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Peso"));
    await user.type(screen.getByLabelText("Peso"), "84.5");
    await user.click(screen.getByRole("button", { name: /guardar peso/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(84.5, expect.any(Date), "");
    });
    expect(screen.getByText("Peso guardado correctamente.")).toBeInTheDocument();
  });

  it("submits optional note", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<WeightForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Peso"), "84.5");
    await user.type(screen.getByLabelText("Motivo"), "Fin de semana");
    await user.click(screen.getByRole("button", { name: /guardar peso/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        84.5,
        expect.any(Date),
        "Fin de semana",
      );
    });
  });
});

describe("EmptyState", () => {
  it("renders empty message", () => {
    render(<EmptyState />);
    expect(
      screen.getByText(/todavía no tenés registros de peso/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/agregá tu primer registro/i),
    ).toBeInTheDocument();
  });
});

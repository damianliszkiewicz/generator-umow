// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NewContractForm } from "@/components/contracts/new-contract-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("convex/react", () => ({
  useMutation: () => vi.fn(),
}));

vi.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => undefined,
}));

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: () => ({}),
    handleSubmit: (handler: (values: unknown) => unknown) => (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      return handler({});
    },
    formState: {
      errors: {},
      isSubmitting: false,
    },
  }),
}));

describe("NewContractForm", () => {
  it("renders the main and secondary call to action labels", () => {
    render(<NewContractForm />);

    expect(screen.getByRole("button", { name: "Zapisz i kontynuuj" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Powrót do dashboardu" }).getAttribute("href")).toBe("/dashboard");
  });
});

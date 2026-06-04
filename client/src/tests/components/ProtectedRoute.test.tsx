import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/authContext";

vi.mock("../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  Navigate: ({ to, replace }: { to: string; replace: boolean }) => (
    <div data-replace={String(replace)} data-testid="navigate" data-to={to} />
  ),
  Outlet: () => <div data-testid="outlet">Sayfa içeriği</div>,
}));

describe("ProtectedRoute", () => {
  test("kullanıcı bilgisi yüklenirken loading gösterir", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      loading: true,
    });

    const result = render(<ProtectedRoute />);
    const loadingElement = result.container.querySelector(".animate-spin");

    expect(loadingElement).not.toBeNull();
  });

  test("kullanıcı yoksa login sayfasına yönlendirir", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      loading: false,
    });

    const result = render(<ProtectedRoute />);
    const navigateElement = result.getByTestId("navigate");

    expect(navigateElement.getAttribute("data-to")).toBe("/");
    expect(navigateElement.getAttribute("data-replace")).toBe("true");
  });

  test("kullanıcı varsa sayfa içeriğini gösterir", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: "user-1",
        email: "employee@example.com",
        firstName: "Employee",
        lastName: "User",
        role: "employee",
      },
      login: vi.fn(),
      logout: vi.fn(),
      loading: false,
    });

    const result = render(<ProtectedRoute />);
    const outletElement = result.getByTestId("outlet");

    expect(outletElement.textContent).toBe("Sayfa içeriği");
  });
});

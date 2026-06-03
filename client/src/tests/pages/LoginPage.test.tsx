import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import LoginPage from "../../pages/LoginPage";
import { useAuth } from "../../context/authContext.tsx";
import { useNavigation } from "../../hooks/useNavigation";
import { authApi } from "../../services/api";
import toast from "react-hot-toast";

vi.mock("../../context/authContext.tsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../hooks/useNavigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("../../services/api", () => ({
  authApi: {
    getBootstrapStatus: vi.fn(),
    login: vi.fn(),
    registerFirstAdmin: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("LoginPage", () => {
  test("kurulum kapalıysa giriş formunu gösterir", async () => {
    const login = vi.fn();
    const forwardTo = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      loading: false,
    });
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });
    vi.mocked(authApi.getBootstrapStatus).mockResolvedValue({ isOpen: false });

    const result = render(<LoginPage />);
    const title = await result.findByRole("heading", { name: "Giriş Yap" });

    expect(title.textContent).toBe("Giriş Yap");
    expect(result.getByPlaceholderText("E-posta")).not.toBeNull();
    expect(result.getByPlaceholderText("Şifre")).not.toBeNull();
  });

  test("giriş formu başarılı gönderilirse kullanıcıyı içeri alır", async () => {
    const login = vi.fn();
    const forwardTo = vi.fn();
    const user = {
      id: "user-1",
      email: "employee@example.com",
      firstName: "Employee",
      lastName: "User",
      role: "employee",
    };

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      loading: false,
    });
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });
    vi.mocked(authApi.getBootstrapStatus).mockResolvedValue({ isOpen: false });
    vi.mocked(authApi.login).mockResolvedValue({
      success: true,
      user,
    });

    const result = render(<LoginPage />);
    await result.findByRole("heading", { name: "Giriş Yap" });

    fireEvent.change(result.getByPlaceholderText("E-posta"), {
      target: { value: "employee@example.com" },
    });
    fireEvent.change(result.getByPlaceholderText("Şifre"), {
      target: { value: "password123" },
    });
    fireEvent.click(result.getByRole("checkbox"));
    fireEvent.click(result.getByRole("button", { name: "Giriş Yap" }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: "employee@example.com",
        password: "password123",
        isRememberMe: true,
      });
      expect(login).toHaveBeenCalledWith(user);
      expect(forwardTo).toHaveBeenCalledWith("Ana sayfa", "/main");
    });
  });

  test("giriş formu boş gönderilirse hata mesajı verir", async () => {
    const login = vi.fn();
    const forwardTo = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      loading: false,
    });
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });
    vi.mocked(authApi.getBootstrapStatus).mockResolvedValue({ isOpen: false });

    const result = render(<LoginPage />);
    await result.findByRole("heading", { name: "Giriş Yap" });

    fireEvent.click(result.getByRole("button", { name: "Giriş Yap" }));

    expect(toast.error).toHaveBeenCalledWith(
      "Tüm alanların doldurulması zorunludur !",
    );
  });

  test("ilk kurulum açıksa admin oluşturma formunu gösterir", async () => {
    const login = vi.fn();
    const forwardTo = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      loading: false,
    });
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });
    vi.mocked(authApi.getBootstrapStatus).mockResolvedValue({ isOpen: true });

    const result = render(<LoginPage />);
    const title = await result.findByText("İlk Kurulum");

    expect(title.textContent).toBe("İlk Kurulum");
    expect(result.getByPlaceholderText("Ad")).not.toBeNull();
    expect(result.getByPlaceholderText("Soyad")).not.toBeNull();
  });

  test("ilk admin formu başarılı gönderilirse admin oluşturur", async () => {
    const login = vi.fn();
    const forwardTo = vi.fn();
    const user = {
      id: "admin-1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    };

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      login,
      logout: vi.fn(),
      loading: false,
    });
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });
    vi.mocked(authApi.getBootstrapStatus).mockResolvedValue({ isOpen: true });
    vi.mocked(authApi.registerFirstAdmin).mockResolvedValue({
      success: true,
      user,
    });

    const result = render(<LoginPage />);
    await result.findByText("İlk Kurulum");

    fireEvent.change(result.getByPlaceholderText("Ad"), {
      target: { value: "Admin" },
    });
    fireEvent.change(result.getByPlaceholderText("Soyad"), {
      target: { value: "User" },
    });
    fireEvent.change(result.getByPlaceholderText("E-posta"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(result.getByPlaceholderText("Şifre"), {
      target: { value: "password123" },
    });
    fireEvent.click(result.getByText("Admin Hesabını Oluştur"));

    await waitFor(() => {
      expect(authApi.registerFirstAdmin).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "password123",
        firstName: "Admin",
        lastName: "User",
      });
      expect(login).toHaveBeenCalledWith(user);
      expect(toast.success).toHaveBeenCalledWith("İlk admin hesabı oluşturuldu.");
      expect(forwardTo).toHaveBeenCalledWith("Ana sayfa", "/main");
    });
  });
});

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import DashboardCard from "../../components/DashboardCard";
import { useNavigation } from "../../hooks/useNavigation";

vi.mock("../../hooks/useNavigation", () => ({
  useNavigation: vi.fn(),
}));

describe("DashboardCard", () => {
  test("başlık, ikon, sağ içerik ve çocuk içeriği gösterir", () => {
    const forwardTo = vi.fn();
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });

    const result = render(
      <DashboardCard
        icon={<span data-testid="card-icon">I</span>}
        rightContent={<span>Sağ alan</span>}
        title="İzin Özeti"
      >
        <p>Kart içeriği</p>
      </DashboardCard>,
    );

    expect(result.getByText("İzin Özeti").textContent).toBe("İzin Özeti");
    expect(result.getByTestId("card-icon").textContent).toBe("I");
    expect(result.getByText("Sağ alan").textContent).toBe("Sağ alan");
    expect(result.getByText("Kart içeriği").textContent).toBe("Kart içeriği");
  });

  test("tümünü gör butonuna basınca yönlendirme fonksiyonunu çağırır", () => {
    const forwardTo = vi.fn();
    vi.mocked(useNavigation).mockReturnValue({ forwardTo });

    const result = render(
      <DashboardCard
        buttonText="Listeye Git"
        title="Takım"
        viewAllLabel="Takım Listesi"
        viewAllPath="/teams"
      >
        <p>Takım içeriği</p>
      </DashboardCard>,
    );

    fireEvent.click(result.getByText("Listeye Git"));

    expect(forwardTo).toHaveBeenCalledWith("Takım Listesi", "/teams");
  });
});

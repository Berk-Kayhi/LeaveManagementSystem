import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DateRangePicker from "../../components/DateRangePicker";

describe("DateRangePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("tarih seçilmemişse kullanıcıdan tarih seçmesini ister", () => {
    const onRangeChange = vi.fn();

    const result = render(
      <DateRangePicker
        endDate={null}
        onRangeChange={onRangeChange}
        startDate={null}
      />,
    );

    expect(result.getByText("Lütfen tarih seçiniz...").textContent).toBe(
      "Lütfen tarih seçiniz...",
    );
  });

  test("ilk tarih seçildiğinde başlangıç tarihini gönderir", () => {
    const onRangeChange = vi.fn();

    const result = render(
      <DateRangePicker
        endDate={null}
        onRangeChange={onRangeChange}
        startDate={null}
      />,
    );

    const dayButton = result.container.querySelector("#date-day-2026-06-05");
    fireEvent.click(dayButton as Element);

    expect(onRangeChange).toHaveBeenCalledWith("2026-06-05", null);
  });

  test("bitiş tarihi başlangıçtan sonra seçilirse aralığı gönderir", () => {
    const onRangeChange = vi.fn();

    const result = render(
      <DateRangePicker
        endDate={null}
        onRangeChange={onRangeChange}
        startDate="2026-06-05"
      />,
    );

    const dayButton = result.container.querySelector("#date-day-2026-06-08");
    fireEvent.click(dayButton as Element);

    expect(onRangeChange).toHaveBeenCalledWith("2026-06-05", "2026-06-08");
  });

  test("bitiş tarihi başlangıçtan önce seçilirse tarihleri sıralı gönderir", () => {
    const onRangeChange = vi.fn();

    const result = render(
      <DateRangePicker
        endDate={null}
        onRangeChange={onRangeChange}
        startDate="2026-06-08"
      />,
    );

    const dayButton = result.container.querySelector("#date-day-2026-06-05");
    fireEvent.click(dayButton as Element);

    expect(onRangeChange).toHaveBeenCalledWith("2026-06-05", "2026-06-08");
  });

  test("geçmiş tarih butonu kapalı olur", () => {
    const onRangeChange = vi.fn();

    const result = render(
      <DateRangePicker
        endDate={null}
        onRangeChange={onRangeChange}
        startDate={null}
      />,
    );

    const dayButton = result.container.querySelector(
      "#date-day-2026-06-02",
    ) as HTMLButtonElement;

    expect(dayButton.disabled).toBe(true);
  });
});

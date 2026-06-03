/// <reference types="vitest" />

import { DateTime } from "luxon";
import { describe, expect, test } from "vitest";
import { formatLeaveItem, getLeaveColor } from "./leaveUtils";

describe("getLeaveColor", () => {
  test("theme amber ise amber renklerini döner", () => {
    const result = getLeaveColor(0.1, "amber");

    expect(result.hex).toBe("#f59e0b");
    expect(result.text).toBe("text-amber-600");
  });

  test("ratio yüksekse rose renklerini döner", () => {
    const result = getLeaveColor(0.75);

    expect(result.hex).toBe("#f43f5e");
    expect(result.text).toBe("text-rose-600");
  });

  test("ratio düşükse emerald renklerini döner", () => {
    const result = getLeaveColor(0.25);

    expect(result.hex).toBe("#10b981");
    expect(result.text).toBe("text-emerald-600");
  });
});

describe("formatLeaveItem", () => {
  test("startDate yoksa item'ı değiştirmeden döner", () => {
    const item = { firstName: "Ada", days: 2 };

    const result = formatLeaveItem(item, DateTime.fromISO("2026-06-03"));

    expect(result).toBe(item);
  });

  test("izin bilgisini ekranda gösterilecek metinlere çevirir", () => {
    const item = {
      startDate: "2026-06-03",
      firstName: "Ada",
      lastName: "Lovelace",
      reason: "Yıllık izin",
      days: 3,
    };

    const result = formatLeaveItem(item, DateTime.fromISO("2026-06-04"));

    expect(result.employeeName).toBe("Ada Lovelace");
    expect(result.formattedSecondaryText).toBe("Yıllık izin • 03 Haz - 05 Haz");
    expect(result.formattedBadgeContent).toBe("3 gün");
    expect(result.remainingDaysBadge).toBe("2 gün");
  });
});

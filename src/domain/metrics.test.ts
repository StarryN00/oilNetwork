import { describe, expect, it } from "vitest";
import { seedData } from "./mockData";
import {
  classifyOrderIncrement,
  getCampaignEffect,
  getReconciliationDetail,
  getStationDashboard
} from "./metrics";

describe("metrics", () => {
  it("includes paid orders only in station dashboard totals", () => {
    const dashboard = getStationDashboard(seedData, "st-002");
    const pendingOrder = seedData.orders.find((order) => order.id === "fo-010");
    expect(pendingOrder?.payStatus).toBe("pending");
    expect(dashboard.monthOrders).toBe(
      seedData.orders.filter((order) => order.stationId === "st-002" && order.payStatus === "paid").length
    );
  });

  it("classifies first identifiable station order as new customer", () => {
    const firstOrder = seedData.orders.find((order) => order.id === "fo-001");
    expect(firstOrder).toBeDefined();
    expect(classifyOrderIncrement(seedData, firstOrder!)).toBe("campaign");

    const nonCampaignFirst = seedData.orders.find((order) => order.id === "fo-006");
    expect(classifyOrderIncrement(seedData, nonCampaignFirst!)).toBe("new_customer");
  });

  it("classifies later identifiable station orders as repeat when no campaign applies", () => {
    const repeatOrder = seedData.orders.find((order) => order.id === "fo-013");
    expect(classifyOrderIncrement(seedData, repeatOrder!)).toBe("repeat");
  });

  it("classifies campaign orders as campaign increment", () => {
    const campaignOrder = seedData.orders.find((order) => order.id === "fo-011");
    expect(classifyOrderIncrement(seedData, campaignOrder!)).toBe("campaign");
  });

  it("summarizes campaign effect", () => {
    const effect = getCampaignEffect(seedData, "cp-001");
    expect(effect.orders.length).toBeGreaterThan(0);
    expect(effect.discountAmount).toBeGreaterThan(0);
    expect(effect.budgetUsedRate).toBeGreaterThan(0);
  });

  it("calculates reconciliation totals from station month orders", () => {
    const detail = getReconciliationDetail(seedData, "rc-001");
    expect(detail).toBeDefined();
    expect(detail?.totalOrders).toBe(
      seedData.orders.filter((order) => order.stationId === "st-001" && order.payStatus === "paid").length
    );
    expect(detail?.totalPaidAmount).toBeCloseTo(
      seedData.orders
        .filter((order) => order.stationId === "st-001" && order.payStatus === "paid")
        .reduce((sum, order) => sum + order.paidAmount, 0)
    );
  });
});

import { describe, expect, it } from "vitest";
import { seedData } from "./mockData";
import {
  calculateVisibleFuelPrice,
  classifyOrderIncrement,
  getApplicableDiscount,
  getCampaignEffect,
  getReconciliationDetail,
  getStationPriceSettings,
  getStationDashboard,
  getStationMonthlyReport
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

  it("builds station monthly report with enterprise and fuel summaries", () => {
    const report = getStationMonthlyReport(seedData, "st-001", "2026-06");
    expect(report.totalOrders).toBe(
      seedData.orders.filter((order) => order.stationId === "st-001" && order.payStatus === "paid").length
    );
    expect(report.enterprises[0].amount).toBeGreaterThan(0);
    expect(report.fuels[0].liters).toBeGreaterThan(0);
    expect(report.averageDiscountPerLiter).toBeGreaterThan(0);
  });

  it("shows default fuel price settings for every station and supports disabled fuels", () => {
    const settings = getStationPriceSettings(seedData, "st-001");
    expect(settings.map((item) => item.fuelType)).toEqual(["0# 柴油", "-10# 柴油", "92# 汽油", "95# 汽油", "98# 汽油", "车用尿素", "LNG"]);
    expect(settings.find((item) => item.fuelType === "98# 汽油")?.active).toBe(false);
  });

  it("uses enterprise specific discount before universal discount for visible driver price", () => {
    const universal = getApplicableDiscount(seedData, "st-001", "0# 柴油");
    const enterprise = getApplicableDiscount(seedData, "st-001", "0# 柴油", "ent-001");
    expect(universal?.discountValue).toBe(3);
    expect(enterprise?.discountValue).toBe(5);
    expect(calculateVisibleFuelPrice(seedData, "st-001", "0# 柴油", "ent-001")).toBeCloseTo(6.65);
    expect(calculateVisibleFuelPrice(seedData, "st-001", "0# 柴油", "ent-004")).toBeCloseTo(6.79);
    expect(calculateVisibleFuelPrice(seedData, "st-001", "98# 汽油")).toBeUndefined();
  });
});

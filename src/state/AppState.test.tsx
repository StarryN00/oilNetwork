import { describe, expect, it } from "vitest";
import { seedData } from "../domain/mockData";
import { appReducer } from "./AppState";

describe("appReducer", () => {
  it("updates station profile directly", () => {
    const next = appReducer(seedData, { type: "updateStation", stationId: "st-001", patch: { contactName: "新站长" } });
    expect(next.stations.find((station) => station.id === "st-001")?.contactName).toBe("新站长");
  });

  it("updates fuel product directly", () => {
    const next = appReducer(seedData, { type: "updateProduct", productId: "fp-001", patch: { partnerPrice: 6.82 } });
    expect(next.products.find((product) => product.id === "fp-001")?.partnerPrice).toBe(6.82);
  });

  it("submits campaign into pending review", () => {
    const base = seedData.campaigns[0];
    const next = appReducer(seedData, {
      type: "submitCampaign",
      campaign: {
        ...base,
        name: "新优惠",
        submittedBy: "油站端"
      }
    });
    expect(next.campaigns[0].status).toBe("pending_review");
    expect(next.campaigns[0].name).toBe("新优惠");
  });

  it("approves campaign", () => {
    const next = appReducer(seedData, { type: "approveCampaign", campaignId: "cp-002", reviewer: "运营" });
    expect(next.campaigns.find((campaign) => campaign.id === "cp-002")?.status).toBe("published");
  });

  it("rejects campaign and stores note", () => {
    const next = appReducer(seedData, { type: "rejectCampaign", campaignId: "cp-002", reviewer: "运营", note: "预算需确认" });
    const campaign = next.campaigns.find((item) => item.id === "cp-002");
    expect(campaign?.status).toBe("rejected");
    expect(campaign?.reviewNote).toBe("预算需确认");
  });

  it("confirms reconciliation", () => {
    const next = appReducer(seedData, { type: "confirmReconciliation", reconciliationId: "rc-001", note: "油站已确认" });
    expect(next.reconciliations.find((item) => item.id === "rc-001")?.status).toBe("confirmed");
  });

  it("reports abnormal order", () => {
    const next = appReducer(seedData, {
      type: "reportAbnormal",
      event: { orderId: "fo-001", stationId: "st-001", type: "金额疑问", description: "需复核优惠" }
    });
    expect(next.abnormalEvents[0].status).toBe("open");
    expect(next.abnormalEvents[0].type).toBe("金额疑问");
  });
});

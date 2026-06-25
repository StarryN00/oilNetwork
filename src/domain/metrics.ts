import type { AppData, Campaign, FuelOrder, IncrementType, Reconciliation } from "./types";

const paidOrders = (data: AppData) => data.orders.filter((order) => order.payStatus === "paid");

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

export function classifyOrderIncrement(data: AppData, targetOrder: FuelOrder): IncrementType {
  if (targetOrder.payStatus !== "paid") return "unclassified";
  if (targetOrder.campaignId) return "campaign";

  const stationOrders = paidOrders(data)
    .filter((order) => order.stationId === targetOrder.stationId)
    .sort((a, b) => new Date(a.tradeTime).getTime() - new Date(b.tradeTime).getTime());

  const firstMatch = stationOrders.find(
    (order) => order.driverId === targetOrder.driverId || order.vehicleId === targetOrder.vehicleId
  );

  if (!firstMatch) return "unclassified";
  return firstMatch.id === targetOrder.id ? "new_customer" : "repeat";
}

export function getStationOrders(data: AppData, stationId: string) {
  return paidOrders(data)
    .filter((order) => order.stationId === stationId)
    .sort((a, b) => new Date(b.tradeTime).getTime() - new Date(a.tradeTime).getTime());
}

export function getStationDashboard(data: AppData, stationId: string) {
  const orders = getStationOrders(data, stationId);
  const today = "2026-06-25";
  const todayOrders = orders.filter((order) => order.tradeTime.startsWith(today));
  const monthOrders = orders.filter((order) => order.tradeTime.startsWith("2026-06"));
  const driverIds = new Set(monthOrders.map((order) => order.driverId));
  const vehicleIds = new Set(monthOrders.map((order) => order.vehicleId));
  const newCustomerOrders = monthOrders.filter((order) => classifyOrderIncrement(data, order) === "new_customer");
  const repeatOrders = monthOrders.filter((order) => classifyOrderIncrement(data, order) === "repeat");
  const campaignOrders = monthOrders.filter((order) => classifyOrderIncrement(data, order) === "campaign");
  const discountAmount = monthOrders.reduce((sum, order) => sum + order.discountAmount, 0);
  const totalPaid = monthOrders.reduce((sum, order) => sum + order.paidAmount, 0);

  return {
    todayAmount: todayOrders.reduce((sum, order) => sum + order.paidAmount, 0),
    monthAmount: totalPaid,
    todayOrders: todayOrders.length,
    monthOrders: monthOrders.length,
    liters: monthOrders.reduce((sum, order) => sum + order.liters, 0),
    averageTicket: monthOrders.length ? totalPaid / monthOrders.length : 0,
    driverCount: driverIds.size,
    vehicleCount: vehicleIds.size,
    newDriverCount: new Set(newCustomerOrders.map((order) => order.driverId)).size,
    repeatDriverCount: new Set(repeatOrders.map((order) => order.driverId)).size,
    repeatRate: driverIds.size ? new Set(repeatOrders.map((order) => order.driverId)).size / driverIds.size : 0,
    discountAmount,
    estimatedGrossProfit: totalPaid * 0.064 - discountAmount * 0.18,
    incrementBreakdown: {
      newCustomer: newCustomerOrders.length,
      repeat: repeatOrders.length,
      campaign: campaignOrders.length
    }
  };
}

export function getCampaignEffect(data: AppData, campaignId: string) {
  const campaign = data.campaigns.find((item) => item.id === campaignId) as Campaign | undefined;
  const orders = paidOrders(data).filter((order) => order.campaignId === campaignId);
  const paidAmount = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const discountAmount = orders.reduce((sum, order) => sum + order.discountAmount, 0);
  const drivers = new Set(orders.map((order) => order.driverId));
  return {
    campaign,
    orders,
    paidAmount,
    discountAmount,
    driverCount: drivers.size,
    budgetUsedRate: campaign ? discountAmount / campaign.budgetTotal : 0
  };
}

export function getReconciliationDetail(data: AppData, reconciliationId: string) {
  const reconciliation = data.reconciliations.find((item) => item.id === reconciliationId) as Reconciliation | undefined;
  if (!reconciliation) {
    return undefined;
  }
  const orders = data.orders.filter((order) => reconciliation.orderIds.includes(order.id) && order.payStatus === "paid");
  return {
    reconciliation,
    orders,
    totalOrders: orders.length,
    totalOriginalAmount: orders.reduce((sum, order) => sum + order.originalAmount, 0),
    totalDiscountAmount: orders.reduce((sum, order) => sum + order.discountAmount, 0),
    totalPaidAmount: orders.reduce((sum, order) => sum + order.paidAmount, 0),
    totalLiters: orders.reduce((sum, order) => sum + order.liters, 0)
  };
}

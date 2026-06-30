import type { AppData, Campaign, FuelOrder, FuelProduct, IncrementType, Reconciliation } from "./types";

const paidOrders = (data: AppData) => data.orders.filter((order) => order.payStatus === "paid");

export const DEFAULT_FUEL_TYPES = ["0# 柴油", "-10# 柴油", "92# 汽油", "95# 汽油", "98# 汽油", "车用尿素", "LNG"];

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

export function getStationPriceSettings(data: AppData, stationId: string): FuelProduct[] {
  return DEFAULT_FUEL_TYPES.map((fuelType, index) => {
    const existing = data.products.find((product) => product.stationId === stationId && product.fuelType === fuelType);
    return (
      existing ?? {
        id: `generated:${stationId}:${fuelType}:${index}`,
        stationId,
        fuelType,
        listPrice: 0,
        partnerPrice: 0,
        vehicleScope: "默认油品",
        active: false,
        updatedAt: "-"
      }
    );
  });
}

export function getApplicableDiscount(data: AppData, stationId: string, fuelType: string, enterpriseId?: string) {
  const published = data.campaigns.filter(
    (campaign) =>
      campaign.stationId === stationId &&
      campaign.fuelType === fuelType &&
      campaign.status === "published" &&
      campaign.discountType === "percentage"
  );
  const enterpriseDiscount = enterpriseId
    ? published.find((campaign) => campaign.audienceType === "enterprise" && campaign.targetEnterpriseIds.includes(enterpriseId))
    : undefined;
  return enterpriseDiscount ?? published.find((campaign) => campaign.audienceType === "universal");
}

export function calculateVisibleFuelPrice(data: AppData, stationId: string, fuelType: string, enterpriseId?: string) {
  const product = getStationPriceSettings(data, stationId).find((item) => item.fuelType === fuelType);
  if (!product?.active || product.partnerPrice <= 0) return undefined;
  const discount = getApplicableDiscount(data, stationId, fuelType, enterpriseId);
  const rate = discount ? discount.discountValue / 100 : 0;
  return Number((product.partnerPrice * (1 - rate)).toFixed(2));
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

export function getStationMonthlyReport(data: AppData, stationId: string, month = "2026-06") {
  const orders = paidOrders(data).filter((order) => order.stationId === stationId && order.tradeTime.startsWith(month));
  const enterpriseMap = new Map<string, { name: string; amount: number; liters: number; orders: number }>();
  const fuelMap = new Map<string, { fuelType: string; amount: number; liters: number; orders: number }>();
  const invoiceMap = new Map<string, number>();
  const incrementMap = new Map<IncrementType, number>();

  for (const order of orders) {
    const enterpriseName = data.enterprises.find((enterprise) => enterprise.id === order.enterpriseId)?.name ?? "未知企业";
    const enterprise = enterpriseMap.get(order.enterpriseId) ?? { name: enterpriseName, amount: 0, liters: 0, orders: 0 };
    enterprise.amount += order.paidAmount;
    enterprise.liters += order.liters;
    enterprise.orders += 1;
    enterpriseMap.set(order.enterpriseId, enterprise);

    const fuel = fuelMap.get(order.fuelType) ?? { fuelType: order.fuelType, amount: 0, liters: 0, orders: 0 };
    fuel.amount += order.paidAmount;
    fuel.liters += order.liters;
    fuel.orders += 1;
    fuelMap.set(order.fuelType, fuel);

    invoiceMap.set(order.invoiceStatus, (invoiceMap.get(order.invoiceStatus) ?? 0) + 1);
    const increment = classifyOrderIncrement(data, order);
    incrementMap.set(increment, (incrementMap.get(increment) ?? 0) + 1);
  }

  const totalAmount = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const totalDiscount = orders.reduce((sum, order) => sum + order.discountAmount, 0);
  const totalLiters = orders.reduce((sum, order) => sum + order.liters, 0);
  const abnormalCount = data.abnormalEvents.filter((event) => event.stationId === stationId && event.createdAt.startsWith(month)).length;

  return {
    month,
    orders,
    totalOrders: orders.length,
    totalAmount,
    totalDiscount,
    totalLiters,
    averageTicket: orders.length ? totalAmount / orders.length : 0,
    averageDiscountPerLiter: totalLiters ? totalDiscount / totalLiters : 0,
    abnormalCount,
    enterprises: Array.from(enterpriseMap.values()).sort((a, b) => b.amount - a.amount),
    fuels: Array.from(fuelMap.values()).sort((a, b) => b.amount - a.amount),
    invoiceBreakdown: Array.from(invoiceMap.entries()).map(([status, count]) => ({ status, count })),
    incrementBreakdown: Array.from(incrementMap.entries()).map(([type, count]) => ({ type, count }))
  };
}

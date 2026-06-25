export type StationStatus = "active" | "pending" | "paused" | "offline";
export type CampaignStatus = "draft" | "pending_review" | "published" | "rejected" | "paused" | "ended";
export type DiscountType = "per_liter" | "full_reduction" | "fixed";
export type PayStatus = "paid" | "pending" | "refunded";
export type InvoiceStatus = "not_required" | "pending" | "issued" | "delayed" | "failed";
export type ReconciliationStatus = "pending_station" | "confirmed" | "disputed" | "exported";
export type IncrementType = "new_customer" | "repeat" | "campaign" | "unclassified";

export interface OilStation {
  id: string;
  name: string;
  brand: string;
  province: string;
  city: string;
  address: string;
  contactName: string;
  contactPhone: string;
  businessHours: string;
  invoiceCapability: string;
  status: StationStatus;
  cooperationScore: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface FuelProduct {
  id: string;
  stationId: string;
  fuelType: string;
  listPrice: number;
  partnerPrice: number;
  vehicleScope: string;
  active: boolean;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  stationId: string;
  name: string;
  fuelType: string;
  discountType: DiscountType;
  discountValue: number;
  targetScope: string;
  targetEnterpriseIds: string[];
  targetRouteIds: string[];
  budgetTotal: number;
  limitPerVehicle: number;
  limitPerDriver: number;
  dailyLimit: number;
  startTime: string;
  endTime: string;
  status: CampaignStatus;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface EnterpriseRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  monthlyVolume: number;
  preferredStationIds: string[];
}

export interface Enterprise {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  monthlyFuelBudget: number;
  routes: EnterpriseRoute[];
  status: "trial" | "active" | "watch";
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  enterpriseId: string;
  status: "active" | "paused";
}

export interface Vehicle {
  id: string;
  plateNo: string;
  vehicleType: string;
  enterpriseId: string;
  driverId: string;
  status: "active" | "paused";
}

export interface TokenOrQuota {
  id: string;
  code: string;
  enterpriseId: string;
  driverId: string;
  vehicleId: string;
  stationId?: string;
  campaignId?: string;
  validFrom: string;
  validTo: string;
  amountLimit: number;
  usedAmount: number;
  status: "active" | "paused" | "expired";
}

export interface FuelOrder {
  id: string;
  orderNo: string;
  stationId: string;
  enterpriseId: string;
  driverId: string;
  vehicleId: string;
  tokenId?: string;
  campaignId?: string;
  fuelType: string;
  liters: number;
  originalAmount: number;
  discountAmount: number;
  paidAmount: number;
  payChannel: string;
  payStatus: PayStatus;
  invoiceStatus: InvoiceStatus;
  tradeTime: string;
  abnormalStatus?: string;
}

export interface Reconciliation {
  id: string;
  stationId: string;
  month: string;
  orderIds: string[];
  status: ReconciliationStatus;
  exportedAt?: string;
  confirmedAt?: string;
  stationNote?: string;
}

export interface AbnormalEvent {
  id: string;
  orderId: string;
  stationId: string;
  type: string;
  description: string;
  status: "open" | "processing" | "resolved";
  createdAt: string;
}

export interface AppData {
  stations: OilStation[];
  products: FuelProduct[];
  campaigns: Campaign[];
  enterprises: Enterprise[];
  drivers: Driver[];
  vehicles: Vehicle[];
  tokens: TokenOrQuota[];
  orders: FuelOrder[];
  reconciliations: Reconciliation[];
  abnormalEvents: AbnormalEvent[];
}

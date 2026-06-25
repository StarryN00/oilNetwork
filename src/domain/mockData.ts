import type { AppData } from "./types";

export const seedData: AppData = {
  stations: [
    {
      id: "st-001",
      name: "中能石化吴王站",
      brand: "中能石化",
      province: "江苏",
      city: "苏州",
      address: "吴中大道与港浦路交汇处",
      contactName: "潘站长",
      contactPhone: "13800010001",
      businessHours: "00:00-24:00",
      invoiceCapability: "专票稳定，支持月结清单",
      status: "active",
      cooperationScore: 92,
      lastUpdatedBy: "潘站长",
      lastUpdatedAt: "2026-06-25 09:30"
    },
    {
      id: "st-002",
      name: "元联石化天伦站",
      brand: "元联石化",
      province: "浙江",
      city: "嘉兴",
      address: "乍嘉苏高速天伦出口西侧",
      contactName: "沈经理",
      contactPhone: "13800010002",
      businessHours: "06:00-23:30",
      invoiceCapability: "专票可开，月底需提前锁量",
      status: "active",
      cooperationScore: 86,
      lastUpdatedBy: "沈经理",
      lastUpdatedAt: "2026-06-24 18:10"
    },
    {
      id: "st-003",
      name: "山西众昊能源北环站",
      brand: "众昊能源",
      province: "山西",
      city: "太原",
      address: "北环物流园东门",
      contactName: "杜总",
      contactPhone: "13800010003",
      businessHours: "05:30-24:00",
      invoiceCapability: "普票稳定，专票需次月汇总",
      status: "pending",
      cooperationScore: 74,
      lastUpdatedBy: "杜总",
      lastUpdatedAt: "2026-06-23 14:20"
    }
  ],
  products: [
    { id: "fp-001", stationId: "st-001", fuelType: "0# 柴油", listPrice: 7.18, partnerPrice: 6.95, vehicleScope: "干线重卡", active: true, updatedAt: "2026-06-25 09:32" },
    { id: "fp-002", stationId: "st-001", fuelType: "-10# 柴油", listPrice: 7.42, partnerPrice: 7.18, vehicleScope: "冷链/北线车辆", active: true, updatedAt: "2026-06-25 09:32" },
    { id: "fp-003", stationId: "st-002", fuelType: "0# 柴油", listPrice: 7.2, partnerPrice: 6.98, vehicleScope: "集卡/专线", active: true, updatedAt: "2026-06-24 18:12" },
    { id: "fp-004", stationId: "st-002", fuelType: "车用尿素", listPrice: 3.1, partnerPrice: 2.88, vehicleScope: "国六车辆", active: true, updatedAt: "2026-06-24 18:12" },
    { id: "fp-005", stationId: "st-003", fuelType: "0# 柴油", listPrice: 7.15, partnerPrice: 6.9, vehicleScope: "零担车队", active: true, updatedAt: "2026-06-23 14:25" },
    { id: "fp-006", stationId: "st-003", fuelType: "LNG", listPrice: 4.88, partnerPrice: 4.72, vehicleScope: "燃气重卡", active: false, updatedAt: "2026-06-23 14:25" }
  ],
  campaigns: [
    {
      id: "cp-001",
      stationId: "st-001",
      name: "苏南干线柴油每升直降",
      fuelType: "0# 柴油",
      discountType: "per_liter",
      discountValue: 0.23,
      targetScope: "指定企业与线路",
      targetEnterpriseIds: ["ent-001", "ent-002"],
      targetRouteIds: ["rt-001", "rt-003"],
      budgetTotal: 30000,
      limitPerVehicle: 1800,
      limitPerDriver: 1500,
      dailyLimit: 6000,
      startTime: "2026-06-20",
      endTime: "2026-07-20",
      status: "published",
      submittedBy: "潘站长",
      submittedAt: "2026-06-18 11:20",
      reviewedBy: "企油通运营-林",
      reviewedAt: "2026-06-18 14:40"
    },
    {
      id: "cp-002",
      stationId: "st-002",
      name: "嘉兴集卡夜间满减",
      fuelType: "0# 柴油",
      discountType: "full_reduction",
      discountValue: 80,
      targetScope: "全部企油通客户",
      targetEnterpriseIds: [],
      targetRouteIds: [],
      budgetTotal: 16000,
      limitPerVehicle: 1000,
      limitPerDriver: 1000,
      dailyLimit: 3200,
      startTime: "2026-06-26",
      endTime: "2026-07-10",
      status: "pending_review",
      submittedBy: "沈经理",
      submittedAt: "2026-06-25 10:08"
    },
    {
      id: "cp-003",
      stationId: "st-003",
      name: "北环零担专属让利",
      fuelType: "0# 柴油",
      discountType: "per_liter",
      discountValue: 0.31,
      targetScope: "指定企业",
      targetEnterpriseIds: ["ent-003"],
      targetRouteIds: ["rt-004"],
      budgetTotal: 12000,
      limitPerVehicle: 900,
      limitPerDriver: 900,
      dailyLimit: 2000,
      startTime: "2026-06-24",
      endTime: "2026-07-24",
      status: "rejected",
      submittedBy: "杜总",
      submittedAt: "2026-06-24 09:15",
      reviewedBy: "企油通运营-林",
      reviewedAt: "2026-06-24 12:00",
      reviewNote: "需补充专票开具时效承诺后再发布"
    },
    {
      id: "cp-004",
      stationId: "st-001",
      name: "端午后复购激励",
      fuelType: "0# 柴油",
      discountType: "fixed",
      discountValue: 60,
      targetScope: "复购司机",
      targetEnterpriseIds: ["ent-001"],
      targetRouteIds: ["rt-001"],
      budgetTotal: 6000,
      limitPerVehicle: 300,
      limitPerDriver: 300,
      dailyLimit: 1000,
      startTime: "2026-06-12",
      endTime: "2026-06-18",
      status: "ended",
      submittedBy: "潘站长",
      submittedAt: "2026-06-10 16:00",
      reviewedBy: "企油通运营-林",
      reviewedAt: "2026-06-10 17:00"
    }
  ],
  enterprises: [
    {
      id: "ent-001",
      name: "江苏中峰大件物流",
      contactName: "徐总",
      contactPhone: "13900020001",
      monthlyFuelBudget: 920000,
      status: "active",
      routes: [
        { id: "rt-001", name: "苏州-宁波港", origin: "苏州", destination: "宁波港", monthlyVolume: 420000, preferredStationIds: ["st-001", "st-002"] },
        { id: "rt-002", name: "苏州-合肥", origin: "苏州", destination: "合肥", monthlyVolume: 180000, preferredStationIds: ["st-001"] }
      ]
    },
    {
      id: "ent-002",
      name: "厦门工船宝船运",
      contactName: "林总",
      contactPhone: "13900020002",
      monthlyFuelBudget: 660000,
      status: "trial",
      routes: [
        { id: "rt-003", name: "嘉兴-太仓港", origin: "嘉兴", destination: "太仓港", monthlyVolume: 260000, preferredStationIds: ["st-002", "st-001"] }
      ]
    },
    {
      id: "ent-003",
      name: "山西运易通零担",
      contactName: "杜总",
      contactPhone: "13900020003",
      monthlyFuelBudget: 780000,
      status: "trial",
      routes: [
        { id: "rt-004", name: "太原-郑州", origin: "太原", destination: "郑州", monthlyVolume: 300000, preferredStationIds: ["st-003"] }
      ]
    },
    {
      id: "ent-004",
      name: "维天路歌合作车队",
      contactName: "高建",
      contactPhone: "13900020004",
      monthlyFuelBudget: 520000,
      status: "watch",
      routes: [
        { id: "rt-005", name: "上海-湖州", origin: "上海", destination: "湖州", monthlyVolume: 160000, preferredStationIds: ["st-002"] }
      ]
    }
  ],
  drivers: [
    { id: "dr-001", name: "王师傅", phone: "13600030001", enterpriseId: "ent-001", status: "active" },
    { id: "dr-002", name: "刘师傅", phone: "13600030002", enterpriseId: "ent-001", status: "active" },
    { id: "dr-003", name: "赵师傅", phone: "13600030003", enterpriseId: "ent-002", status: "active" },
    { id: "dr-004", name: "陈师傅", phone: "13600030004", enterpriseId: "ent-002", status: "active" },
    { id: "dr-005", name: "杨师傅", phone: "13600030005", enterpriseId: "ent-003", status: "active" },
    { id: "dr-006", name: "郭师傅", phone: "13600030006", enterpriseId: "ent-003", status: "active" },
    { id: "dr-007", name: "孙师傅", phone: "13600030007", enterpriseId: "ent-004", status: "active" },
    { id: "dr-008", name: "马师傅", phone: "13600030008", enterpriseId: "ent-004", status: "paused" }
  ],
  vehicles: [
    { id: "vh-001", plateNo: "苏E8Q721", vehicleType: "重卡", enterpriseId: "ent-001", driverId: "dr-001", status: "active" },
    { id: "vh-002", plateNo: "苏E3K912", vehicleType: "重卡", enterpriseId: "ent-001", driverId: "dr-002", status: "active" },
    { id: "vh-003", plateNo: "闽D6A330", vehicleType: "集卡", enterpriseId: "ent-002", driverId: "dr-003", status: "active" },
    { id: "vh-004", plateNo: "闽D9P118", vehicleType: "集卡", enterpriseId: "ent-002", driverId: "dr-004", status: "active" },
    { id: "vh-005", plateNo: "晋A72H30", vehicleType: "零担车", enterpriseId: "ent-003", driverId: "dr-005", status: "active" },
    { id: "vh-006", plateNo: "晋A16T82", vehicleType: "零担车", enterpriseId: "ent-003", driverId: "dr-006", status: "active" },
    { id: "vh-007", plateNo: "沪D52K70", vehicleType: "厢式车", enterpriseId: "ent-004", driverId: "dr-007", status: "active" },
    { id: "vh-008", plateNo: "沪D89M21", vehicleType: "厢式车", enterpriseId: "ent-004", driverId: "dr-008", status: "paused" }
  ],
  tokens: [
    { id: "tk-001", code: "QYT-ENT001-001", enterpriseId: "ent-001", driverId: "dr-001", vehicleId: "vh-001", stationId: "st-001", campaignId: "cp-001", validFrom: "2026-06-01", validTo: "2026-07-01", amountLimit: 12000, usedAmount: 5330, status: "active" },
    { id: "tk-002", code: "QYT-ENT001-002", enterpriseId: "ent-001", driverId: "dr-002", vehicleId: "vh-002", stationId: "st-001", validFrom: "2026-06-01", validTo: "2026-07-01", amountLimit: 10000, usedAmount: 4110, status: "active" },
    { id: "tk-003", code: "QYT-ENT002-001", enterpriseId: "ent-002", driverId: "dr-003", vehicleId: "vh-003", stationId: "st-002", validFrom: "2026-06-10", validTo: "2026-07-10", amountLimit: 9000, usedAmount: 2920, status: "active" }
  ],
  orders: [],
  reconciliations: [],
  abnormalEvents: []
};

const orderBase = [
  ["fo-001", "QYT20260601001", "st-001", "ent-001", "dr-001", "vh-001", "tk-001", "cp-004", "0# 柴油", 360, 2584.8, 60, "2026-06-12 08:20"],
  ["fo-002", "QYT20260601002", "st-001", "ent-001", "dr-002", "vh-002", "tk-002", "cp-004", "0# 柴油", 280, 2010.4, 60, "2026-06-13 16:42"],
  ["fo-003", "QYT20260601003", "st-001", "ent-001", "dr-001", "vh-001", "tk-001", "cp-001", "0# 柴油", 410, 2943.8, 94.3, "2026-06-21 09:16"],
  ["fo-004", "QYT20260601004", "st-001", "ent-002", "dr-003", "vh-003", undefined, "cp-001", "0# 柴油", 330, 2369.4, 75.9, "2026-06-21 22:30"],
  ["fo-005", "QYT20260601005", "st-002", "ent-002", "dr-003", "vh-003", "tk-003", undefined, "0# 柴油", 390, 2808, 85.8, "2026-06-22 01:08"],
  ["fo-006", "QYT20260601006", "st-002", "ent-004", "dr-007", "vh-007", undefined, undefined, "0# 柴油", 260, 1872, 57.2, "2026-06-22 13:50"],
  ["fo-007", "QYT20260601007", "st-003", "ent-003", "dr-005", "vh-005", undefined, undefined, "0# 柴油", 300, 2145, 75, "2026-06-23 10:10"],
  ["fo-008", "QYT20260601008", "st-003", "ent-003", "dr-006", "vh-006", undefined, undefined, "0# 柴油", 340, 2431, 85, "2026-06-23 11:05"],
  ["fo-009", "QYT20260601009", "st-001", "ent-001", "dr-002", "vh-002", "tk-002", "cp-001", "0# 柴油", 420, 3015.6, 96.6, "2026-06-24 07:44"],
  ["fo-010", "QYT20260601010", "st-002", "ent-002", "dr-004", "vh-004", undefined, undefined, "车用尿素", 80, 248, 17.6, "2026-06-24 19:12"],
  ["fo-011", "QYT20260601011", "st-001", "ent-001", "dr-001", "vh-001", "tk-001", "cp-001", "0# 柴油", 380, 2728.4, 87.4, "2026-06-25 08:12"],
  ["fo-012", "QYT20260601012", "st-001", "ent-002", "dr-004", "vh-004", undefined, undefined, "0# 柴油", 310, 2225.8, 71.3, "2026-06-25 10:34"],
  ["fo-013", "QYT20260601013", "st-002", "ent-004", "dr-007", "vh-007", undefined, undefined, "0# 柴油", 270, 1944, 59.4, "2026-06-25 13:00"],
  ["fo-014", "QYT20260601014", "st-003", "ent-003", "dr-005", "vh-005", undefined, undefined, "0# 柴油", 320, 2288, 80, "2026-06-25 15:10"],
  ["fo-015", "QYT20260601015", "st-001", "ent-001", "dr-002", "vh-002", "tk-002", "cp-001", "0# 柴油", 390, 2800.2, 89.7, "2026-06-25 16:26"],
  ["fo-016", "QYT20260601016", "st-002", "ent-002", "dr-003", "vh-003", "tk-003", undefined, "0# 柴油", 350, 2520, 77, "2026-06-25 18:04"],
  ["fo-017", "QYT20260601017", "st-001", "ent-001", "dr-001", "vh-001", "tk-001", "cp-001", "0# 柴油", 360, 2584.8, 82.8, "2026-06-25 20:18"],
  ["fo-018", "QYT20260601018", "st-003", "ent-003", "dr-006", "vh-006", undefined, undefined, "0# 柴油", 290, 2073.5, 72.5, "2026-06-25 21:35"]
] as const;

seedData.orders = orderBase.map(([id, orderNo, stationId, enterpriseId, driverId, vehicleId, tokenId, campaignId, fuelType, liters, originalAmount, discountAmount, tradeTime], index) => ({
  id,
  orderNo,
  stationId,
  enterpriseId,
  driverId,
  vehicleId,
  tokenId,
  campaignId,
  fuelType,
  liters,
  originalAmount,
  discountAmount,
  paidAmount: Number((originalAmount - discountAmount).toFixed(2)),
  payChannel: index % 3 === 0 ? "移企付" : index % 3 === 1 ? "支付宝企业码" : "云微",
  payStatus: index === 9 ? "pending" : "paid",
  invoiceStatus: index % 5 === 0 ? "pending" : index % 7 === 0 ? "delayed" : "issued",
  tradeTime,
  abnormalStatus: index === 7 ? "发票回传延迟" : undefined
}));

seedData.reconciliations = [
  { id: "rc-001", stationId: "st-001", month: "2026-06", orderIds: seedData.orders.filter((order) => order.stationId === "st-001").map((order) => order.id), status: "pending_station" },
  { id: "rc-002", stationId: "st-002", month: "2026-06", orderIds: seedData.orders.filter((order) => order.stationId === "st-002").map((order) => order.id), status: "exported", exportedAt: "2026-06-25 08:00" }
];

seedData.abnormalEvents = [
  { id: "ab-001", orderId: "fo-008", stationId: "st-003", type: "发票延迟", description: "专票预计次月汇总，需确认是否影响客户本月抵扣。", status: "open", createdAt: "2026-06-23 12:10" },
  { id: "ab-002", orderId: "fo-010", stationId: "st-002", type: "油品不匹配", description: "司机选择尿素，订单备注为柴油，需要人工核对。", status: "processing", createdAt: "2026-06-24 19:40" },
  { id: "ab-003", orderId: "fo-005", stationId: "st-002", type: "优惠差异", description: "油站优惠价与司机端展示价相差 0.02 元/升。", status: "resolved", createdAt: "2026-06-22 09:30" },
  { id: "ab-004", orderId: "fo-014", stationId: "st-003", type: "账单待确认", description: "油站要求补充支付渠道流水号。", status: "open", createdAt: "2026-06-25 16:00" }
];

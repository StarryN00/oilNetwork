import type { CampaignStatus, IncrementType, InvoiceStatus, PayStatus, ReconciliationStatus, StationStatus } from "./types";

export function stationStatusLabel(status: StationStatus | string) {
  const labels: Record<string, string> = {
    active: "合作中",
    pending: "待完善",
    paused: "已暂停",
    offline: "已下线"
  };
  return labels[status] ?? status;
}

export function campaignStatusLabel(status: CampaignStatus | string) {
  const labels: Record<string, string> = {
    draft: "草稿",
    pending_review: "待审核",
    published: "已发布",
    rejected: "已驳回",
    paused: "已暂停",
    ended: "已结束"
  };
  return labels[status] ?? status;
}

export function enterpriseStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "稳定合作",
    trial: "试运行",
    watch: "重点跟进"
  };
  return labels[status] ?? status;
}

export function payStatusLabel(status: PayStatus | string) {
  const labels: Record<string, string> = {
    paid: "已支付",
    pending: "待支付",
    refunded: "已退款"
  };
  return labels[status] ?? status;
}

export function invoiceStatusLabel(status: InvoiceStatus | string) {
  const labels: Record<string, string> = {
    not_required: "无需开票",
    pending: "待开票",
    issued: "已开票",
    delayed: "开票延迟",
    failed: "开票失败"
  };
  return labels[status] ?? status;
}

export function reconciliationStatusLabel(status: ReconciliationStatus | string) {
  const labels: Record<string, string> = {
    pending_station: "待油站确认",
    confirmed: "已确认",
    disputed: "有异议",
    exported: "已导出"
  };
  return labels[status] ?? status;
}

export function abnormalStatusLabel(status: string) {
  const labels: Record<string, string> = {
    open: "待处理",
    processing: "处理中",
    resolved: "已解决"
  };
  return labels[status] ?? status;
}

export function incrementTypeLabel(type: IncrementType | string, short = false) {
  const labels: Record<string, string> = short
    ? {
        new_customer: "新客",
        repeat: "复购",
        campaign: "优惠带动",
        unclassified: "未分"
      }
    : {
        new_customer: "新客增量",
        repeat: "复购增量",
        campaign: "优惠带动",
        unclassified: "未分类"
      };
  return labels[type] ?? type;
}

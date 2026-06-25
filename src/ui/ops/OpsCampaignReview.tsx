import { Check, Pause, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getCampaignEffect, formatCurrency } from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function OpsCampaignReview() {
  const { data, dispatch } = useAppState();
  const [campaignId, setCampaignId] = useState(data.campaigns[0]?.id ?? "");
  const campaign = data.campaigns.find((item) => item.id === campaignId) ?? data.campaigns[0];
  const station = data.stations.find((item) => item.id === campaign.stationId);
  const effect = useMemo(() => getCampaignEffect(data, campaign.id), [data, campaign.id]);

  return (
    <section className="two-col">
      <div className="panel">
        <div className="panel-header">
          <h3>优惠审核队列</h3>
          <span className="chip warn">{data.campaigns.filter((item) => item.status === "pending_review").length} 待审</span>
        </div>
        <div className="panel-body campaign-list">
          {data.campaigns.map((item) => (
            <button key={item.id} className={campaign.id === item.id ? "campaign-row active" : "campaign-row"} onClick={() => setCampaignId(item.id)}>
              <span>
                <strong>{item.name}</strong>
                <small>{data.stations.find((stationItem) => stationItem.id === item.stationId)?.name}</small>
              </span>
              <em className={`status-dot ${item.status}`}>{statusLabel(item.status)}</em>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h3>{campaign.name}</h3>
          <span className={`chip ${campaign.status === "published" ? "good" : campaign.status === "rejected" ? "bad" : "warn"}`}>{statusLabel(campaign.status)}</span>
        </div>
        <div className="panel-body campaign-detail">
          <div className="detail-grid">
            <Info label="油站" value={station?.name ?? "-"} />
            <Info label="油品" value={campaign.fuelType} />
            <Info label="优惠方式" value={`${campaign.discountType} / ${campaign.discountValue}`} />
            <Info label="适用范围" value={campaign.targetScope} />
            <Info label="预算" value={formatCurrency(campaign.budgetTotal)} />
            <Info label="每日限额" value={formatCurrency(campaign.dailyLimit)} />
          </div>
          <div className="publish-preview">
            <span className="muted">司机端发布预览</span>
            <strong>{station?.name} · {campaign.fuelType}</strong>
            <p>{campaign.targetScope} 可享 {campaign.discountType === "per_liter" ? `每升 ${campaign.discountValue} 元优惠` : `${campaign.discountValue} 元优惠`}，有效期 {campaign.startTime} 至 {campaign.endTime}。</p>
          </div>
          <div className="effect-strip">
            <span>已归因订单 <b>{effect.orders.length}</b></span>
            <span>交易额 <b>{formatCurrency(effect.paidAmount)}</b></span>
            <span>优惠成本 <b>{formatCurrency(effect.discountAmount)}</b></span>
          </div>
          <div className="button-row">
            <button className="btn primary" onClick={() => dispatch({ type: "approveCampaign", campaignId: campaign.id, reviewer: "企油通运营" })}>
              <Check size={17} />
              审核通过并发布
            </button>
            <button className="btn" onClick={() => dispatch({ type: "pauseCampaign", campaignId: campaign.id, reviewer: "企油通运营", note: "运营侧手动暂停" })}>
              <Pause size={17} />
              暂停
            </button>
            <button className="btn danger" onClick={() => dispatch({ type: "rejectCampaign", campaignId: campaign.id, reviewer: "企油通运营", note: "优惠执行信息不完整" })}>
              <X size={17} />
              驳回
            </button>
          </div>
          {campaign.reviewNote && <p className="review-note">审核备注：{campaign.reviewNote}</p>}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function statusLabel(status: string) {
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

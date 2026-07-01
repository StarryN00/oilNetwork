import { Building2, ChevronDown, ChevronRight, Pencil, Plus, Send, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Campaign } from "../../domain/types";
import { statusLabel } from "../ops/OpsCampaignReview";
import { useAppState } from "../../state/AppState";

const FUEL_OPTIONS = ["0# 柴油", "-10# 柴油", "92# 汽油", "95# 汽油", "98# 汽油", "车用尿素", "LNG"];

function getStatusClass(status?: Campaign["status"]) {
  if (status === "published") return "chip good";
  if (status === "rejected") return "chip bad";
  return "chip warn";
}

function isEnterpriseCampaign(campaign: Campaign) {
  return campaign.audienceType === "enterprise" || (campaign.targetEnterpriseIds?.length ?? 0) > 0;
}

function isUniversalCampaign(campaign: Campaign) {
  return campaign.audienceType === "universal" || !isEnterpriseCampaign(campaign);
}

function formatDiscount(campaign: Campaign) {
  if (campaign.discountType === "percentage") return `${campaign.discountValue}%`;
  if (campaign.discountType === "per_liter") return `直降 ${campaign.discountValue} 元/L`;
  return `${campaign.discountValue}`;
}

export function StationCampaigns({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;
  const campaigns = data.campaigns.filter((campaign) => campaign.stationId === stationId);
  const currentCampaigns = campaigns.filter((campaign) => campaign.status !== "ended");
  const universalCampaigns = currentCampaigns.filter(isUniversalCampaign);
  const enterpriseCampaigns = currentCampaigns.filter(isEnterpriseCampaign);
  const currentUniversal = universalCampaigns.find((campaign) => campaign.status === "published") ?? universalCampaigns[0];
  const enterpriseIds = Array.from(new Set(enterpriseCampaigns.flatMap((campaign) => campaign.targetEnterpriseIds ?? [])));
  const [universalFuel, setUniversalFuel] = useState("0# 柴油");
  const [universalValue, setUniversalValue] = useState(3);
  const [enterpriseId, setEnterpriseId] = useState(data.enterprises[0]?.id ?? "");
  const [enterpriseFuel, setEnterpriseFuel] = useState("0# 柴油");
  const [enterpriseValue, setEnterpriseValue] = useState(5);
  const [editingUniversal, setEditingUniversal] = useState(false);
  const [showEnterpriseList, setShowEnterpriseList] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState(false);

  function submitUniversal(event: FormEvent) {
    event.preventDefault();
    dispatch({
      type: "submitCampaign",
      campaign: {
        stationId,
        name: `${universalFuel} 全体企油通用户普惠`,
        fuelType: universalFuel,
        discountType: "percentage",
        discountValue: universalValue,
        audienceType: "universal",
        targetScope: "所有企油通用户",
        targetEnterpriseIds: [],
        targetRouteIds: [],
        budgetTotal: 12000,
        limitPerVehicle: 800,
        limitPerDriver: 800,
        dailyLimit: 1800,
        startTime: "2026-06-26",
        endTime: "2026-07-26",
        submittedBy: station.contactName
      }
    });
    setEditingUniversal(false);
  }

  function submitEnterprise(event: FormEvent) {
    event.preventDefault();
    const enterprise = data.enterprises.find((item) => item.id === enterpriseId);
    dispatch({
      type: "submitCampaign",
      campaign: {
        stationId,
        name: `${enterprise?.name ?? "物流企业"} ${enterpriseFuel} 专属优惠`,
        fuelType: enterpriseFuel,
        discountType: "percentage",
        discountValue: enterpriseValue,
        audienceType: "enterprise",
        targetScope: "指定物流企业",
        targetEnterpriseIds: [enterpriseId],
        targetRouteIds: [],
        budgetTotal: 16000,
        limitPerVehicle: 1000,
        limitPerDriver: 1000,
        dailyLimit: 2500,
        startTime: "2026-06-26",
        endTime: "2026-07-26",
        submittedBy: station.contactName
      }
    });
    setEditingEnterprise(false);
    setShowEnterpriseList(true);
  }

  function enterpriseNamesFor(campaign: Campaign) {
    const names = (campaign.targetEnterpriseIds ?? [])
      .map((id) => data.enterprises.find((enterprise) => enterprise.id === id)?.name)
      .filter(Boolean);
    return names.length > 0 ? names.join("、") : "未指定企业";
  }

  function primaryLabelFor(campaign: Campaign) {
    return isEnterpriseCampaign(campaign) ? enterpriseNamesFor(campaign) : "普遍优惠";
  }

  return (
    <section className="mobile-stack">
      <div className="mobile-card discount-type-card">
        <div className="discount-card-head">
          <div className="discount-icon">
            <Users size={18} />
          </div>
          <div>
            <h3>普遍优惠</h3>
            <p>所有企油通用户可享受，包含个人司机和企业司机。</p>
          </div>
        </div>
        <div className="discount-metric">
          <div>
            <span>当前配置</span>
            <strong>{currentUniversal ? formatDiscount(currentUniversal) : "未配置"}</strong>
          </div>
          <span className={currentUniversal ? getStatusClass(currentUniversal.status) : "chip"}>{currentUniversal ? statusLabel(currentUniversal.status) : "待设置"}</span>
        </div>
        <div className="discount-summary-line">
          <span>{currentUniversal?.fuelType ?? universalFuel}</span>
          <span>{currentUniversal ? `${currentUniversal.startTime} 至 ${currentUniversal.endTime}` : "配置后提交企油通审核"}</span>
        </div>
        <button className="btn full" onClick={() => setEditingUniversal((value) => !value)}>
          <Pencil size={17} /> 修改普遍优惠
        </button>
        {editingUniversal && (
          <form className="discount-panel form-card" onSubmit={submitUniversal}>
            <label className="field">
              <span>适用油品</span>
              <select value={universalFuel} onChange={(event) => setUniversalFuel(event.target.value)}>
                {FUEL_OPTIONS.map((fuel) => <option key={fuel}>{fuel}</option>)}
              </select>
            </label>
            <label className="field">
              <span>优惠比例</span>
              <input type="number" step="0.1" value={universalValue} onChange={(event) => setUniversalValue(Number(event.target.value))} />
            </label>
            <button className="btn primary full" type="submit"><Send size={17} /> 提交普惠审核</button>
          </form>
        )}
      </div>

      <div className="mobile-card discount-type-card">
        <div className="discount-card-head">
          <div className="discount-icon">
            <Building2 size={18} />
          </div>
          <div>
            <h3>企业专属优惠</h3>
            <p>指定物流企业单独设置，司机属于该企业时优先使用。</p>
          </div>
        </div>
        <button className="discount-metric clickable" onClick={() => setShowEnterpriseList((value) => !value)}>
          <div>
            <span>已配置企业</span>
            <strong>{enterpriseIds.length} 家</strong>
          </div>
          {showEnterpriseList ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        {showEnterpriseList && (
          <div className="enterprise-discount-list">
            {enterpriseCampaigns.length > 0 ? enterpriseCampaigns.map((campaign) => {
              return (
                <div className="enterprise-discount-row" key={campaign.id}>
                  <div>
                    <strong>{enterpriseNamesFor(campaign)}</strong>
                    <span>{campaign.fuelType} · {formatDiscount(campaign)} · {campaign.startTime} 至 {campaign.endTime}</span>
                  </div>
                  <span className={getStatusClass(campaign.status)}>{statusLabel(campaign.status)}</span>
                </div>
              );
            }) : (
              <div className="enterprise-discount-empty">暂无企业专属优惠配置</div>
            )}
          </div>
        )}
        <button className="btn full" onClick={() => setEditingEnterprise((value) => !value)}>
          <Plus size={17} /> 新增或修改企业优惠
        </button>
        {editingEnterprise && (
          <form className="discount-panel form-card" onSubmit={submitEnterprise}>
            <label className="field">
              <span>物流企业</span>
              <select value={enterpriseId} onChange={(event) => setEnterpriseId(event.target.value)}>
                {data.enterprises.map((enterprise) => (
                  <option key={enterprise.id} value={enterprise.id}>{enterprise.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>适用油品</span>
              <select value={enterpriseFuel} onChange={(event) => setEnterpriseFuel(event.target.value)}>
                {FUEL_OPTIONS.map((fuel) => <option key={fuel}>{fuel}</option>)}
              </select>
            </label>
            <label className="field">
              <span>专属优惠比例</span>
              <input type="number" step="0.1" value={enterpriseValue} onChange={(event) => setEnterpriseValue(Number(event.target.value))} />
            </label>
            <button className="btn primary full" type="submit"><Send size={17} /> 提交企业专属审核</button>
          </form>
        )}
      </div>

      <div className="mobile-card">
        <h3>优惠审核记录</h3>
        <div className="mobile-list">
          {campaigns.map((campaign) => (
            <div className="mobile-list-row" key={campaign.id}>
              <div>
                <strong>{primaryLabelFor(campaign)}</strong>
                <span>{campaign.fuelType} · {isEnterpriseCampaign(campaign) ? "企业专属" : "普遍优惠"} · {formatDiscount(campaign)} · {campaign.startTime} 至 {campaign.endTime}</span>
              </div>
              <span className={campaign.status === "published" ? "chip good" : campaign.status === "rejected" ? "chip bad" : "chip warn"}>
                {statusLabel(campaign.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

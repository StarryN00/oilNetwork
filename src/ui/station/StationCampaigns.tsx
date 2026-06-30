import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { statusLabel } from "../ops/OpsCampaignReview";
import { useAppState } from "../../state/AppState";

export function StationCampaigns({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;
  const campaigns = data.campaigns.filter((campaign) => campaign.stationId === stationId);
  const [universalFuel, setUniversalFuel] = useState("0# 柴油");
  const [universalValue, setUniversalValue] = useState(3);
  const [enterpriseId, setEnterpriseId] = useState(data.enterprises[0]?.id ?? "");
  const [enterpriseFuel, setEnterpriseFuel] = useState("0# 柴油");
  const [enterpriseValue, setEnterpriseValue] = useState(5);

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
  }

  return (
    <section className="mobile-stack">
      <form className="mobile-card form-card" onSubmit={submitUniversal}>
        <h3>普遍优惠</h3>
        <p>所有企油通用户都可享受，包含个人司机和企业司机。提交后需企油通审核。</p>
        <label className="field">
          <span>适用油品</span>
          <select value={universalFuel} onChange={(event) => setUniversalFuel(event.target.value)}>
            <option>0# 柴油</option>
            <option>-10# 柴油</option>
            <option>92# 汽油</option>
            <option>95# 汽油</option>
            <option>98# 汽油</option>
            <option>车用尿素</option>
            <option>LNG</option>
          </select>
        </label>
        <label className="field">
          <span>优惠比例</span>
          <input type="number" step="0.1" value={universalValue} onChange={(event) => setUniversalValue(Number(event.target.value))} />
        </label>
        <button className="btn primary full" type="submit"><Send size={17} /> 提交普惠审核</button>
      </form>

      <form className="mobile-card form-card" onSubmit={submitEnterprise}>
        <h3>企业专属优惠</h3>
        <p>给指定物流企业单独设置优惠比例。司机属于该企业时，优先使用企业专属优惠。</p>
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
            <option>0# 柴油</option>
            <option>-10# 柴油</option>
            <option>92# 汽油</option>
            <option>95# 汽油</option>
            <option>98# 汽油</option>
            <option>车用尿素</option>
            <option>LNG</option>
          </select>
        </label>
        <label className="field">
          <span>专属优惠比例</span>
          <input type="number" step="0.1" value={enterpriseValue} onChange={(event) => setEnterpriseValue(Number(event.target.value))} />
        </label>
        <button className="btn primary full" type="submit"><Send size={17} /> 提交企业专属审核</button>
      </form>
      <div className="mobile-card">
        <h3>我的优惠</h3>
        <div className="mobile-list">
          {campaigns.map((campaign) => (
            <div className="mobile-list-row" key={campaign.id}>
              <div>
                <strong>{campaign.name}</strong>
                <span>{campaign.fuelType} · {campaign.audienceType === "enterprise" ? "企业专属" : "普遍优惠"} · {campaign.discountValue}%</span>
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

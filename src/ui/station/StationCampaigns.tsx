import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { statusLabel } from "../ops/OpsCampaignReview";
import { useAppState } from "../../state/AppState";

export function StationCampaigns({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;
  const campaigns = data.campaigns.filter((campaign) => campaign.stationId === stationId);
  const [name, setName] = useState("新线路柴油专属优惠");
  const [value, setValue] = useState(0.2);

  function submit(event: FormEvent) {
    event.preventDefault();
    dispatch({
      type: "submitCampaign",
      campaign: {
        stationId,
        name,
        fuelType: "0# 柴油",
        discountType: "per_liter",
        discountValue: value,
        targetScope: "指定企业/线路",
        targetEnterpriseIds: ["ent-001"],
        targetRouteIds: ["rt-001"],
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

  return (
    <section className="mobile-stack">
      <form className="mobile-card form-card" onSubmit={submit}>
        <h3>提交优惠活动</h3>
        <p>优惠需企油通审核后，才会发布到司机端。</p>
        <label className="field">
          <span>活动名称</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span>每升优惠</span>
          <input type="number" step="0.01" value={value} onChange={(event) => setValue(Number(event.target.value))} />
        </label>
        <button className="btn primary full" type="submit"><Send size={17} /> 提交企油通审核</button>
      </form>
      <div className="mobile-card">
        <h3>我的优惠</h3>
        <div className="mobile-list">
          {campaigns.map((campaign) => (
            <div className="mobile-list-row" key={campaign.id}>
              <div>
                <strong>{campaign.name}</strong>
                <span>{campaign.fuelType} · {campaign.targetScope}</span>
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

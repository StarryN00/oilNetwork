import { Save } from "lucide-react";
import { useAppState } from "../../state/AppState";

export function StationProfile({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;

  return (
    <section className="mobile-card form-card">
      <h3>油站资料</h3>
      <p>资料提交后直接生效，企油通后台可纠错或下架。</p>
      <label className="field">
        <span>油站名称</span>
        <input value={station.name} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { name: event.target.value } })} />
      </label>
      <label className="field">
        <span>联系人</span>
        <input value={station.contactName} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { contactName: event.target.value } })} />
      </label>
      <label className="field">
        <span>联系电话</span>
        <input value={station.contactPhone} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { contactPhone: event.target.value } })} />
      </label>
      <label className="field">
        <span>营业时间</span>
        <input value={station.businessHours} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { businessHours: event.target.value } })} />
      </label>
      <label className="field">
        <span>开票能力</span>
        <textarea rows={3} value={station.invoiceCapability} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { invoiceCapability: event.target.value } })} />
      </label>
      <button className="btn primary full"><Save size={17} /> 已自动保存</button>
    </section>
  );
}

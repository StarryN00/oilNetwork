import { Save } from "lucide-react";
import { useAppState } from "../../state/AppState";

export function StationProfile({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;

  return (
    <section className="mobile-card form-card">
      <h3>油站资料</h3>
      <p>维护油站经营资料；账号、角色和登录信息已移到“我的”。</p>
      <label className="field">
        <span>油站名称</span>
        <input value={station.name} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { name: event.target.value } })} />
      </label>
      <label className="field">
        <span>油站地址</span>
        <input value={station.address} onChange={(event) => dispatch({ type: "updateStation", stationId, patch: { address: event.target.value } })} />
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

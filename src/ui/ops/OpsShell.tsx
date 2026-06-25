import { BarChart3, FileCheck2, Fuel, Map, Network, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import { OpsCampaignReview } from "./OpsCampaignReview";
import { OpsCustomerRoutes } from "./OpsCustomerRoutes";
import { OpsOrdersReconciliation } from "./OpsOrdersReconciliation";
import { OpsOverview } from "./OpsOverview";
import { OpsStations } from "./OpsStations";

const nav = [
  { id: "overview", label: "运营总览", icon: BarChart3 },
  { id: "stations", label: "油站管理", icon: Fuel },
  { id: "campaigns", label: "优惠审核", icon: FileCheck2 },
  { id: "routes", label: "客户线路", icon: Map },
  { id: "orders", label: "订单对账", icon: Network }
] as const;

export type OpsTab = (typeof nav)[number]["id"];

export function OpsShell() {
  const { data } = useAppState();
  const [tab, setTab] = useState<OpsTab>("overview");
  const activeStation = useMemo(() => data.stations[0], [data.stations]);

  return (
    <div className="ops-layout app-shell">
      <aside className="ops-rail">
        <div className="brand-block">
          <span className="brand-mark">企</span>
          <div>
            <strong>企油通</strong>
            <small>油站伙伴平台 V1</small>
          </div>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={tab === item.id ? "rail-item active" : "rail-item"} onClick={() => setTab(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <a className="station-link" href="/station">
          <Smartphone size={17} />
          打开油站移动端
        </a>
      </aside>
      <main className="ops-main">
        <header className="ops-topbar">
          <div>
            <p className="eyebrow">内部运营后台</p>
            <h1>固定站点小闭环运营台</h1>
          </div>
          <div className="topbar-station">
            <span className="muted">当前样板站</span>
            <strong>{activeStation.name}</strong>
          </div>
        </header>
        {tab === "overview" && <OpsOverview />}
        {tab === "stations" && <OpsStations />}
        {tab === "campaigns" && <OpsCampaignReview />}
        {tab === "routes" && <OpsCustomerRoutes />}
        {tab === "orders" && <OpsOrdersReconciliation />}
      </main>
    </div>
  );
}

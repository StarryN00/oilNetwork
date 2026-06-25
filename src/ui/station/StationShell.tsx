import { ClipboardList, Fuel, Home, ReceiptText, Tags } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../state/AppState";
import { StationCampaigns } from "./StationCampaigns";
import { StationDashboard } from "./StationDashboard";
import { StationOrdersBills } from "./StationOrdersBills";
import { StationProducts } from "./StationProducts";
import { StationProfile } from "./StationProfile";

const tabs = [
  { id: "home", label: "首页", icon: Home },
  { id: "profile", label: "资料", icon: ClipboardList },
  { id: "products", label: "油品", icon: Fuel },
  { id: "campaigns", label: "优惠", icon: Tags },
  { id: "bills", label: "账单", icon: ReceiptText }
] as const;

type StationTab = (typeof tabs)[number]["id"];

export function StationShell() {
  const { data } = useAppState();
  const [tab, setTab] = useState<StationTab>("home");
  const [stationId, setStationId] = useState(data.stations[0]?.id ?? "");
  const station = data.stations.find((item) => item.id === stationId) ?? data.stations[0];

  return (
    <div className="station-stage app-shell">
      <div className="phone-frame">
        <header className="station-header">
          <div>
            <span>企油通伙伴站</span>
            <h1>{station.name}</h1>
          </div>
          <select value={stationId} onChange={(event) => setStationId(event.target.value)}>
            {data.stations.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </header>
        <main className="station-content">
          {tab === "home" && <StationDashboard stationId={station.id} />}
          {tab === "profile" && <StationProfile stationId={station.id} />}
          {tab === "products" && <StationProducts stationId={station.id} />}
          {tab === "campaigns" && <StationCampaigns stationId={station.id} />}
          {tab === "bills" && <StationOrdersBills stationId={station.id} />}
        </main>
        <nav className="station-tabs">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <a className="desktop-back" href="/ops">返回内部后台</a>
    </div>
  );
}

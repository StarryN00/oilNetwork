import { MapPinned } from "lucide-react";
import { useAppState } from "../../state/AppState";
import { enterpriseStatusLabel } from "../../domain/labels";
import { formatCurrency } from "../../domain/metrics";

export function OpsCustomerRoutes() {
  const { data } = useAppState();

  return (
    <section className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h3>客户与线路匹配</h3>
          <span className="chip good">线路驱动供给组织</span>
        </div>
        <div className="panel-body route-grid">
          {data.enterprises.map((enterprise) => (
            <div className="route-card" key={enterprise.id}>
              <div className="route-card-head">
                <div>
                  <strong>{enterprise.name}</strong>
                  <span>{enterprise.contactName} · {formatCurrency(enterprise.monthlyFuelBudget)} 月油费</span>
                </div>
                <em>{enterpriseStatusLabel(enterprise.status)}</em>
              </div>
              {enterprise.routes.map((route) => (
                <div className="route-line" key={route.id}>
                  <MapPinned size={17} />
                  <div>
                    <b>{route.name}</b>
                    <span>{route.origin} → {route.destination} · {formatCurrency(route.monthlyVolume)}</span>
                  </div>
                  <div className="route-stations">
                    {route.preferredStationIds.map((stationId) => (
                      <span className="chip" key={stationId}>
                        {data.stations.find((station) => station.id === stationId)?.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

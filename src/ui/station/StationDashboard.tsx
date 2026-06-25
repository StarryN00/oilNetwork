import { ArrowUpRight, Repeat2, Sparkles, Truck } from "lucide-react";
import { useAppState } from "../../state/AppState";
import { formatCurrency, formatNumber, getStationDashboard, getStationOrders } from "../../domain/metrics";

export function StationDashboard({ stationId }: { stationId: string }) {
  const { data } = useAppState();
  const metrics = getStationDashboard(data, stationId);
  const orders = getStationOrders(data, stationId).slice(0, 5);

  return (
    <section className="mobile-stack">
      <div className="station-hero-card">
        <span>今天企油通为你带来的增量生意</span>
        <strong>{formatCurrency(metrics.todayAmount)}</strong>
        <p>{metrics.todayOrders} 笔交易 · {formatNumber(metrics.liters)} L 本月累计</p>
      </div>
      <div className="mobile-kpis">
        <MiniKpi icon={<Truck />} label="本月交易" value={formatCurrency(metrics.monthAmount)} />
        <MiniKpi icon={<Sparkles />} label="新客司机" value={`${metrics.newDriverCount} 人`} />
        <MiniKpi icon={<Repeat2 />} label="复购率" value={`${formatNumber(metrics.repeatRate * 100, 1)}%`} />
        <MiniKpi icon={<ArrowUpRight />} label="预计毛利" value={formatCurrency(metrics.estimatedGrossProfit)} />
      </div>
      <div className="mobile-card">
        <h3>增量拆分</h3>
        <div className="increment-bars">
          <Bar label="新客增量" value={metrics.incrementBreakdown.newCustomer} color="cyan" />
          <Bar label="复购增量" value={metrics.incrementBreakdown.repeat} color="lime" />
          <Bar label="活动增量" value={metrics.incrementBreakdown.campaign} color="amber" />
        </div>
      </div>
      <div className="mobile-card">
        <h3>最近订单</h3>
        <div className="mobile-list">
          {orders.map((order) => (
            <div key={order.id} className="mobile-list-row">
              <div>
                <strong>{data.enterprises.find((enterprise) => enterprise.id === order.enterpriseId)?.name}</strong>
                <span>{order.fuelType} · {formatNumber(order.liters)} L</span>
              </div>
              <b>{formatCurrency(order.paidAmount)}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniKpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="mobile-kpi">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="inc-row">
      <span>{label}</span>
      <div><i className={color} style={{ width: `${Math.max(value * 18, 8)}%` }} /></div>
      <b>{value}</b>
    </div>
  );
}

import { AlertTriangle, CheckCircle2, Clock3, Fuel, ReceiptText } from "lucide-react";
import { useAppState } from "../../state/AppState";
import { formatCurrency, formatNumber, getStationDashboard } from "../../domain/metrics";

export function OpsOverview() {
  const { data } = useAppState();
  const dashboards = data.stations.map((station) => ({ station, metrics: getStationDashboard(data, station.id) }));
  const totalAmount = dashboards.reduce((sum, item) => sum + item.metrics.monthAmount, 0);
  const pendingReviews = data.campaigns.filter((campaign) => campaign.status === "pending_review").length;
  const abnormalOpen = data.abnormalEvents.filter((event) => event.status !== "resolved").length;
  const pendingBills = data.reconciliations.filter((item) => item.status === "pending_station").length;

  return (
    <section className="page-stack">
      <div className="ops-hero">
        <div>
          <p className="eyebrow">Network Operations</p>
          <h2>把油站供给变成可运营的物流企业增量</h2>
          <p>油站提交油品和优惠，企油通审核发布并追踪订单归因、活动效果和月度对账。</p>
        </div>
        <div className="hero-metric">
          <span>本月可识别交易</span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      <div className="kpi-grid">
        <Kpi icon={<Fuel />} label="合作油站" value={`${data.stations.length} 座`} tone="cyan" />
        <Kpi icon={<Clock3 />} label="待审核优惠" value={`${pendingReviews} 条`} tone="amber" />
        <Kpi icon={<AlertTriangle />} label="未结异常" value={`${abnormalOpen} 条`} tone="red" />
        <Kpi icon={<ReceiptText />} label="待确认账单" value={`${pendingBills} 份`} tone="lime" />
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-header">
            <h3>样板站表现</h3>
            <span className="chip good">固定站点闭环</span>
          </div>
          <div className="panel-body station-score-list">
            {dashboards.map(({ station, metrics }) => (
              <div className="station-score" key={station.id}>
                <div>
                  <strong>{station.name}</strong>
                  <span>{station.city} · {station.invoiceCapability}</span>
                </div>
                <div className="score-bars">
                  <span style={{ width: `${Math.min(station.cooperationScore, 100)}%` }} />
                </div>
                <div className="station-score-numbers">
                  <b>{formatCurrency(metrics.monthAmount)}</b>
                  <small>{formatNumber(metrics.liters)} L</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>今日运营动作</h3>
            <span className="chip">运营队列</span>
          </div>
          <div className="panel-body action-feed">
            <Feed icon={<CheckCircle2 />} title="中能石化吴王站活动表现健康" text="活动 cp-001 已贡献 5 笔订单，预算使用率低于 2%。" />
            <Feed icon={<Clock3 />} title="嘉兴集卡夜间满减待审核" text="需确认夜间满减是否覆盖全部企油通客户。" />
            <Feed icon={<AlertTriangle />} title="山西众昊专票时效待补充" text="驳回优惠后需补充专票开具承诺。" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className={`kpi-card ${tone}`}>
      <div className="kpi-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Feed({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="feed-item">
      <div className="feed-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

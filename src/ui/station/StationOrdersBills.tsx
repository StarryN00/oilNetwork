import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  classifyOrderIncrement,
  formatCurrency,
  formatNumber,
  getReconciliationDetail,
  getStationMonthlyReport,
  getStationOrders
} from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function StationOrdersBills({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const orders = getStationOrders(data, stationId);
  const reconciliation = data.reconciliations.find((item) => item.stationId === stationId);
  const detail = reconciliation ? getReconciliationDetail(data, reconciliation.id) : undefined;
  const report = getStationMonthlyReport(data, stationId, "2026-06");

  return (
    <section className="mobile-stack">
      <div className="mobile-card monthly-report">
        <div className="report-title">
          <span>2026-06 月度汇总报表</span>
          <strong>{formatCurrency(report.totalAmount)}</strong>
          <p>{report.totalOrders} 笔企油通可识别交易 · {formatNumber(report.totalLiters)} L · 平均客单 {formatCurrency(report.averageTicket)}</p>
        </div>
        <div className="report-kpi-grid">
          <ReportKpi label="优惠成本" value={formatCurrency(report.totalDiscount)} />
          <ReportKpi label="升均优惠" value={`${formatNumber(report.averageDiscountPerLiter, 2)} 元/L`} />
          <ReportKpi label="异常反馈" value={`${report.abnormalCount} 条`} />
        </div>
        <div className="report-section">
          <h4>企业贡献排行</h4>
          {report.enterprises.slice(0, 3).map((enterprise) => (
            <div className="report-row" key={enterprise.name}>
              <span>{enterprise.name}</span>
              <b>{formatCurrency(enterprise.amount)}</b>
              <em>{formatNumber(enterprise.liters)} L</em>
            </div>
          ))}
        </div>
        <div className="report-section">
          <h4>油品结构</h4>
          {report.fuels.map((fuel) => (
            <div className="report-row" key={fuel.fuelType}>
              <span>{fuel.fuelType}</span>
              <b>{formatNumber(fuel.liters)} L</b>
              <em>{fuel.orders} 笔</em>
            </div>
          ))}
        </div>
        <div className="report-pill-row">
          {report.incrementBreakdown.map((item) => (
            <span className="chip good" key={item.type}>{incrementLabel(item.type)} {item.count}</span>
          ))}
          {report.invoiceBreakdown.map((item) => (
            <span className="chip" key={item.status}>发票 {item.status} {item.count}</span>
          ))}
        </div>
      </div>
      {detail && (
        <div className="mobile-card bill-card">
          <span>2026-06 月度账单</span>
          <strong>{formatCurrency(detail.totalPaidAmount)}</strong>
          <p>{detail.totalOrders} 笔订单 · {formatNumber(detail.totalLiters)} L · 优惠 {formatCurrency(detail.totalDiscountAmount)}</p>
          <button className="btn primary full" onClick={() => dispatch({ type: "confirmReconciliation", reconciliationId: detail.reconciliation.id, note: "油站端确认无误" })}>
            <CheckCircle2 size={17} />
            确认账单
          </button>
        </div>
      )}
      <div className="mobile-card">
        <h3>订单明细</h3>
        <div className="mobile-list">
          {orders.map((order) => (
            <div className="order-mobile" key={order.id}>
              <div className="route-card-head">
                <div>
                  <strong>{order.orderNo}</strong>
                  <span>{order.tradeTime} · {order.fuelType}</span>
                </div>
                <b>{formatCurrency(order.paidAmount)}</b>
              </div>
              <div className="mobile-order-meta">
                <span>{formatNumber(order.liters)} L</span>
                <span>优惠 {formatCurrency(order.discountAmount)}</span>
                <span>{classifyOrderIncrement(data, order)}</span>
              </div>
              <button className="btn small" onClick={() => dispatch({ type: "reportAbnormal", event: { orderId: order.id, stationId, type: "油站反馈", description: `${order.orderNo} 需要企油通复核` } })}>
                <AlertCircle size={16} />
                反馈异常
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="report-kpi">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function incrementLabel(type: string) {
  const labels: Record<string, string> = {
    new_customer: "新客",
    repeat: "复购",
    campaign: "活动",
    unclassified: "未分"
  };
  return labels[type] ?? type;
}

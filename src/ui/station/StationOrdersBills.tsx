import { AlertCircle, CheckCircle2 } from "lucide-react";
import { classifyOrderIncrement, formatCurrency, formatNumber, getReconciliationDetail, getStationOrders } from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function StationOrdersBills({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const orders = getStationOrders(data, stationId);
  const reconciliation = data.reconciliations.find((item) => item.stationId === stationId);
  const detail = reconciliation ? getReconciliationDetail(data, reconciliation.id) : undefined;

  return (
    <section className="mobile-stack">
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

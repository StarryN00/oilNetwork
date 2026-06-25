import { AlertTriangle, Download, FileCheck2 } from "lucide-react";
import { useState } from "react";
import { classifyOrderIncrement, formatCurrency, formatNumber, getReconciliationDetail } from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function OpsOrdersReconciliation() {
  const { data } = useAppState();
  const [stationId, setStationId] = useState("all");
  const orders = data.orders.filter((order) => (stationId === "all" ? true : order.stationId === stationId));
  const reconciliation = data.reconciliations[0];
  const detail = getReconciliationDetail(data, reconciliation.id);

  return (
    <section className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h3>同步订单与增量归因</h3>
          <select value={stationId} onChange={(event) => setStationId(event.target.value)} className="inline-select">
            <option value="all">全部油站</option>
            {data.stations.map((station) => (
              <option key={station.id} value={station.id}>{station.name}</option>
            ))}
          </select>
        </div>
        <div className="panel-body table-wrap">
          <table>
            <thead>
              <tr>
                <th>订单</th>
                <th>油站</th>
                <th>企业/司机/车辆</th>
                <th>油品</th>
                <th>金额</th>
                <th>发票</th>
                <th>归因</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNo}<br /><span className="muted">{order.tradeTime}</span></td>
                  <td>{data.stations.find((station) => station.id === order.stationId)?.name}</td>
                  <td>
                    {data.enterprises.find((enterprise) => enterprise.id === order.enterpriseId)?.name}<br />
                    <span className="muted">
                      {data.drivers.find((driver) => driver.id === order.driverId)?.name} · {data.vehicles.find((vehicle) => vehicle.id === order.vehicleId)?.plateNo}
                    </span>
                  </td>
                  <td>{order.fuelType}<br /><span className="muted">{formatNumber(order.liters)} L</span></td>
                  <td>{formatCurrency(order.paidAmount)}<br /><span className="muted">优惠 {formatCurrency(order.discountAmount)}</span></td>
                  <td><span className="chip">{order.invoiceStatus}</span></td>
                  <td><span className="chip good">{incrementLabel(classifyOrderIncrement(data, order))}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-header">
            <h3>异常队列</h3>
            <span className="chip warn">{data.abnormalEvents.filter((event) => event.status !== "resolved").length} 未结</span>
          </div>
          <div className="panel-body action-feed">
            {data.abnormalEvents.map((event) => (
              <div className="feed-item" key={event.id}>
                <div className="feed-icon warn"><AlertTriangle size={18} /></div>
                <div>
                  <strong>{event.type}</strong>
                  <p>{event.description}</p>
                  <span className="chip">{event.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>月度对账单</h3>
            <span className="chip">{detail?.reconciliation.status}</span>
          </div>
          <div className="panel-body recon-summary">
            <FileCheck2 size={34} />
            <strong>{data.stations.find((station) => station.id === reconciliation.stationId)?.name} · {reconciliation.month}</strong>
            <div className="detail-grid">
              <span>订单 <b>{detail?.totalOrders}</b></span>
              <span>升数 <b>{formatNumber(detail?.totalLiters ?? 0)} L</b></span>
              <span>实付 <b>{formatCurrency(detail?.totalPaidAmount ?? 0)}</b></span>
              <span>优惠 <b>{formatCurrency(detail?.totalDiscountAmount ?? 0)}</b></span>
            </div>
            <button className="btn primary"><Download size={17} /> 导出账单</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function incrementLabel(type: string) {
  const labels: Record<string, string> = {
    new_customer: "新客增量",
    repeat: "复购增量",
    campaign: "活动增量",
    unclassified: "未分类"
  };
  return labels[type] ?? type;
}

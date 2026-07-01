import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { stationStatusLabel } from "../../domain/labels";
import { getStationPriceSettings } from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function OpsStations() {
  const { data, dispatch } = useAppState();
  const [stationId, setStationId] = useState(data.stations[0]?.id ?? "");
  const station = data.stations.find((item) => item.id === stationId) ?? data.stations[0];
  const products = getStationPriceSettings(data, station.id);

  return (
    <section className="two-col wide-left">
      <div className="panel">
        <div className="panel-header">
          <h3>油站供给池</h3>
          <span className="chip">资料直接生效，后台可纠错</span>
        </div>
        <div className="panel-body station-list">
          {data.stations.map((item) => (
            <button key={item.id} className={station.id === item.id ? "station-row active" : "station-row"} onClick={() => setStationId(item.id)}>
              <span>
                <strong>{item.name}</strong>
                <small>{item.city} · {stationStatusLabel(item.status)}</small>
              </span>
              <b>{item.cooperationScore}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h3>{station.name}</h3>
          <span className="chip good">{station.invoiceCapability}</span>
        </div>
        <div className="panel-body form-grid">
          <label className="field">
            <span>联系人</span>
            <input value={station.contactName} onChange={(event) => dispatch({ type: "updateStation", stationId: station.id, patch: { contactName: event.target.value } })} />
          </label>
          <label className="field">
            <span>联系电话</span>
            <input value={station.contactPhone} onChange={(event) => dispatch({ type: "updateStation", stationId: station.id, patch: { contactPhone: event.target.value } })} />
          </label>
          <label className="field span-2">
            <span>地址</span>
            <input value={station.address} onChange={(event) => dispatch({ type: "updateStation", stationId: station.id, patch: { address: event.target.value } })} />
          </label>
          <label className="field">
            <span>营业时间</span>
            <input value={station.businessHours} onChange={(event) => dispatch({ type: "updateStation", stationId: station.id, patch: { businessHours: event.target.value } })} />
          </label>
          <label className="field">
            <span>合作状态</span>
            <select value={station.status} onChange={(event) => dispatch({ type: "updateStation", stationId: station.id, patch: { status: event.target.value as typeof station.status } })}>
              <option value="active">合作中</option>
              <option value="pending">待完善</option>
              <option value="paused">已暂停</option>
              <option value="offline">已下线</option>
            </select>
          </label>
          <div className="span-2 products-board">
            {products.map((product) => (
              <div key={product.id} className="product-row">
                <div>
                  <strong>{product.fuelType}</strong>
                  <span>{product.vehicleScope}</span>
                </div>
                <label className="mini-field">
                  挂牌价
                  <input type="number" step="0.01" value={product.listPrice} onChange={(event) => dispatch({ type: "updateProduct", productId: product.id, patch: { listPrice: Number(event.target.value) } })} />
                </label>
                <label className="mini-field">
                  展示价
                  <input type="number" step="0.01" value={product.partnerPrice} onChange={(event) => dispatch({ type: "updateProduct", productId: product.id, patch: { partnerPrice: Number(event.target.value) } })} />
                </label>
                <button className="btn small" onClick={() => dispatch({ type: "updateProduct", productId: product.id, patch: { active: !product.active } })}>
                  {product.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {product.active ? "上架" : "下架"}
                </button>
              </div>
            ))}
          </div>
          <button className="btn primary span-2">
            <Save size={17} />
            已自动保存，更新发布到供给池
          </button>
        </div>
      </div>
    </section>
  );
}

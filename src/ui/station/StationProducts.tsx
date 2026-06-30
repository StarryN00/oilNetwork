import { ToggleLeft, ToggleRight } from "lucide-react";
import { calculateVisibleFuelPrice, getStationPriceSettings } from "../../domain/metrics";
import { useAppState } from "../../state/AppState";

export function StationProducts({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const products = getStationPriceSettings(data, stationId);

  return (
    <section className="mobile-stack">
      <div className="mobile-card">
        <h3>油价设置</h3>
        <p>常规油品默认展示。关闭表示本站不销售该油品；展示价未来会给司机端看到。</p>
      </div>
      {products.map((product) => (
        <div className="mobile-card product-mobile" key={product.id}>
          <div className="route-card-head">
            <div>
              <strong>{product.fuelType}</strong>
              <span>{product.active ? "司机端可展示" : "本站不销售，司机端隐藏"}</span>
            </div>
            <span className={product.active ? "chip good" : "chip"}>{product.active ? "上架" : "下架"}</span>
          </div>
          <label className="field">
            <span>司机端展示价</span>
            <input type="number" step="0.01" value={product.partnerPrice} onChange={(event) => dispatch({ type: "updateProduct", productId: product.id, patch: { partnerPrice: Number(event.target.value) } })} />
          </label>
          <div className="price-preview">
            <span>普惠后到手价</span>
            <strong>{calculateVisibleFuelPrice(data, stationId, product.fuelType)?.toFixed(2) ?? "-" } 元/L</strong>
          </div>
          <button className="btn full" onClick={() => dispatch({ type: "updateProduct", productId: product.id, patch: { active: !product.active } })}>
            {product.active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
            {product.active ? "正在销售，点击禁用" : "本站销售，点击启用"}
          </button>
        </div>
      ))}
    </section>
  );
}

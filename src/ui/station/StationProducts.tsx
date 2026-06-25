import { ToggleLeft, ToggleRight } from "lucide-react";
import { useAppState } from "../../state/AppState";

export function StationProducts({ stationId }: { stationId: string }) {
  const { data, dispatch } = useAppState();
  const products = data.products.filter((product) => product.stationId === stationId);

  return (
    <section className="mobile-stack">
      <div className="mobile-card">
        <h3>油品与价格</h3>
        <p>油品信息由油站端提供，提交后直接进入供给池。</p>
      </div>
      {products.map((product) => (
        <div className="mobile-card product-mobile" key={product.id}>
          <div className="route-card-head">
            <div>
              <strong>{product.fuelType}</strong>
              <span>{product.vehicleScope}</span>
            </div>
            <span className={product.active ? "chip good" : "chip"}>{product.active ? "上架" : "下架"}</span>
          </div>
          <label className="field">
            <span>挂牌价</span>
            <input type="number" step="0.01" value={product.listPrice} onChange={(event) => dispatch({ type: "updateProduct", productId: product.id, patch: { listPrice: Number(event.target.value) } })} />
          </label>
          <label className="field">
            <span>企油通可优惠价</span>
            <input type="number" step="0.01" value={product.partnerPrice} onChange={(event) => dispatch({ type: "updateProduct", productId: product.id, patch: { partnerPrice: Number(event.target.value) } })} />
          </label>
          <button className="btn full" onClick={() => dispatch({ type: "updateProduct", productId: product.id, patch: { active: !product.active } })}>
            {product.active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
            {product.active ? "保持上架" : "重新上架"}
          </button>
        </div>
      ))}
    </section>
  );
}

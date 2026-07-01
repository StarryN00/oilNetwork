import { Building2, ChevronRight, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAppState } from "../../state/AppState";
import { StationProfile } from "./StationProfile";

export function StationAccount({ stationId }: { stationId: string }) {
  const { data } = useAppState();
  const station = data.stations.find((item) => item.id === stationId)!;

  return (
    <section className="mobile-stack">
      <div className="mobile-card account-hero">
        <div className="account-avatar">{station.contactName.slice(0, 1)}</div>
        <div>
          <span>当前登录账号</span>
          <strong>{station.contactName}</strong>
          <p>{station.contactPhone} · 油站负责人</p>
        </div>
      </div>

      <div className="mobile-card account-section">
        <h3>账号信息</h3>
        <AccountRow icon={<UserRound size={18} />} label="姓名" value={station.contactName} />
        <AccountRow icon={<ShieldCheck size={18} />} label="角色权限" value="站长 / 财务确认 / 优惠提交" />
        <AccountRow icon={<Building2 size={18} />} label="所属油站" value={station.name} />
      </div>

      <StationProfile stationId={stationId} />

      <div className="mobile-card account-section">
        <h3>常规设置</h3>
        <AccountRow label="手机号" value={station.contactPhone} action />
        <AccountRow label="登录安全" value="短信验证码登录" action />
        <AccountRow label="消息通知" value="优惠审核、账单确认、异常反馈" action />
        <AccountRow label="服务经理" value="企油通运营-林" action />
      </div>

      <div className="mobile-card account-section">
        <h3>平台信息</h3>
        <AccountRow label="合作状态" value={station.status} />
        <AccountRow label="资料最近更新" value={station.lastUpdatedAt} />
        <AccountRow label="数据范围" value="仅当前油站可见" />
      </div>

      <button className="btn full account-logout">
        <LogOut size={17} />
        退出当前账号
      </button>
    </section>
  );
}

function AccountRow({ icon, label, value, action }: { icon?: React.ReactNode; label: string; value: string; action?: boolean }) {
  return (
    <div className="account-row">
      <div className="account-row-main">
        {icon}
        <span>{label}</span>
      </div>
      <div className="account-row-value">
        <strong>{value}</strong>
        {action && <ChevronRight size={16} />}
      </div>
    </div>
  );
}

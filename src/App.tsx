import { OpsShell } from "./ui/ops/OpsShell";
import { StationShell } from "./ui/station/StationShell";

const getInitialMode = () => {
  if (window.location.pathname.startsWith("/station")) return "station";
  return "ops";
};

export function App() {
  const mode = getInitialMode();
  return mode === "station" ? <StationShell /> : <OpsShell />;
}

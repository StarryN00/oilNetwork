import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { seedData } from "../domain/mockData";
import type { AbnormalEvent, AppData, Campaign, FuelProduct, OilStation, Reconciliation } from "../domain/types";

const STORAGE_KEY = "oil-network-demo-state-v1";

type Action =
  | { type: "updateStation"; stationId: string; patch: Partial<OilStation> }
  | { type: "updateProduct"; productId: string; patch: Partial<FuelProduct> }
  | { type: "submitCampaign"; campaign: Omit<Campaign, "id" | "status" | "submittedAt"> }
  | { type: "approveCampaign"; campaignId: string; reviewer: string }
  | { type: "rejectCampaign"; campaignId: string; reviewer: string; note: string }
  | { type: "pauseCampaign"; campaignId: string; reviewer: string; note: string }
  | { type: "confirmReconciliation"; reconciliationId: string; note?: string }
  | { type: "reportAbnormal"; event: Omit<AbnormalEvent, "id" | "createdAt" | "status"> }
  | { type: "reset" };

interface AppStateContextValue {
  data: AppData;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const timestamp = () => "2026-06-25 17:30";
const nextId = (prefix: string, count: number) => `${prefix}-${String(count + 1).padStart(3, "0")}`;

export function appReducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case "updateStation":
      return {
        ...state,
        stations: state.stations.map((station) =>
          station.id === action.stationId
            ? { ...station, ...action.patch, lastUpdatedAt: timestamp(), lastUpdatedBy: "油站端" }
            : station
        )
      };
    case "updateProduct":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.productId ? { ...product, ...action.patch, updatedAt: timestamp() } : product
        )
      };
    case "submitCampaign":
      return {
        ...state,
        campaigns: [
          {
            ...action.campaign,
            id: nextId("cp", state.campaigns.length),
            status: "pending_review",
            submittedAt: timestamp()
          },
          ...state.campaigns
        ]
      };
    case "approveCampaign":
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.campaignId
            ? { ...campaign, status: "published", reviewedBy: action.reviewer, reviewedAt: timestamp(), reviewNote: "审核通过，已发布到司机端" }
            : campaign
        )
      };
    case "rejectCampaign":
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.campaignId
            ? { ...campaign, status: "rejected", reviewedBy: action.reviewer, reviewedAt: timestamp(), reviewNote: action.note }
            : campaign
        )
      };
    case "pauseCampaign":
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.campaignId
            ? { ...campaign, status: "paused", reviewedBy: action.reviewer, reviewedAt: timestamp(), reviewNote: action.note }
            : campaign
        )
      };
    case "confirmReconciliation":
      return {
        ...state,
        reconciliations: state.reconciliations.map((item) =>
          item.id === action.reconciliationId
            ? { ...item, status: "confirmed", confirmedAt: timestamp(), stationNote: action.note }
            : item
        )
      };
    case "reportAbnormal":
      return {
        ...state,
        abnormalEvents: [
          {
            ...action.event,
            id: nextId("ab", state.abnormalEvents.length),
            status: "open",
            createdAt: timestamp()
          },
          ...state.abnormalEvents
        ]
      };
    case "reset":
      return seedData;
    default:
      return state;
  }
}

function readInitialState() {
  if (typeof window === "undefined") return seedData;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedData;
  try {
    return JSON.parse(saved) as AppData;
  } catch {
    return seedData;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(appReducer, undefined, readInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const value = useMemo(() => ({ data, dispatch }), [data]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}

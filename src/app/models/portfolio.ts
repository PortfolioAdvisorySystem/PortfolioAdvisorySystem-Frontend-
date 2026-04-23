

export interface SubscriberPosition {
  stock:    string;   // symbol e.g. "AAPL"
  sector:   string;   // e.g. "TECHNOLOGY"
  strategy: string;   // e.g. "Conservative Plan"
  weight:   number;
   quantity:number;
  purchasePrice:number;
  riskCategory:string   // ₹ amount allocated
}

export interface SubscriberAllocationReport {
  subscriberId: number;
  totalAUM:     number;     // subscriber's total investment amount
  unallocated:  number;     // cash not yet allocated
  positions:    SubscriberPosition[];
}

// ── Dashboard UI shapes ───────────────────────────────────────────────────────

export interface AllocationRow {
  symbol:                string;
  sector:                string;
  riskCategory:          string;   // "N/A" — not in new endpoint
  strategies:            string;   // "Conservative Plan, Moderate Plan"
  shares:                number;   // placeholder = 1
  price:                 number;   // placeholder = 1
  totalWeight:           number;   // total ₹ across all strategies
  allocationPercent:     number;   // % of total allocated
  date:                  string;   // "-" — not in new endpoint
  markedForDeallocation: boolean;
   quantity:number;
  purchasePrice:number;
}

export interface SectorBreakdown {
  sector:      string;
  totalWeight: number;
  percent:     number;
}

export interface StrategyBreakdown {
  strategyName: string;
  totalWeight:  number;
  percent:      number;
}

export interface PortfolioDashboard {
  portfolioValue:       number;   // = totalAUM from backend
  totalGain:            number;   // 0 — needs real prices
  gainPercentage:       number;   // 0 — needs real prices
  allocatedStocksCount: number;
  unallocatedStocksCount:number;  // unique stock count
  unallocatedCash:      number;   // = unallocated from backend
  avgAnnualReturn:      number;   // 0 — needs historical data
  allocations:          AllocationRow[];
  sectorBreakdown:      SectorBreakdown[];
  strategyBreakdown:    StrategyBreakdown[];
  
}

// ── Keep Stock/Position types if used elsewhere in your app ──────────────────

export interface StrategyInfo {
  id:                    number;
  name:                  string;
  riskProfile:           string;
  maxStockConcentration: number;
  maxSectorExposure:     number;
  cashBufferPercent:     number;
  active:                boolean;
}

export interface Position {
  id:                    number;
  strategy:              StrategyInfo;
  quantity:              number;
  weight:                number;
  purchasePrice:         number;
  allocatedAt:           string;
  markedForDeallocation: boolean;
  deallocationReason:    string | null;
}

export interface Stock {
  id:            number;
  symbol:        string;
  sector:        string;
  category:      string;
  liquidityScore: number;
  avgVolume:     number;
  marketCap:     number;
  riskCategory:  string;
  positions:     Position[];
  active:        boolean;
  blacklisted:   boolean;
  suspended:     boolean;
}
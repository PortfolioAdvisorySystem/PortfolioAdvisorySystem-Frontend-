import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {
  PortfolioDashboard,
  AllocationRow,
  SectorBreakdown,
  StrategyBreakdown,
  SubscriberAllocationReport,
} from '../models/portfolio';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private baseUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  // ── Get subscriberId from localStorage ───────────────────────────────────
  private getSubscriberId(): string | null {
   // const id = localStorage.getItem('subscriberId');
    const id="1";
    if (!id) console.error('[PortfolioService] No subscriberId in localStorage');
    return id;
  }

  getAllocationBySubscriber(): Observable<SubscriberAllocationReport> {
    const subscriberId = this.getSubscriberId();

    if (!subscriberId) {
      // Return empty report if not logged in — prevents crash
      return of({
        subscriberId: 0,
        totalAUM:     0,
        unallocated:  0,
        positions:    [],
      });
    }

    return this.http.get<SubscriberAllocationReport>(
      `${this.baseUrl}/allocation/subscriber/${subscriberId}`
    );
  }

  // ── Transform report → dashboard shape (used by dashboard component) ──────
  getPortfolioDashboard(): Observable<PortfolioDashboard> {
    return this.getAllocationBySubscriber().pipe(
      map(report => this.buildDashboardFromReport(report))
    );
  }

  buildDashboardFromReport(report: SubscriberAllocationReport): PortfolioDashboard {
    const positions = report.positions ?? [];
    const totalAUM  = report.totalAUM  ?? 0;
    const stockMap = new Map<string, AllocationRow>();

    positions.forEach(pos => {
      if (stockMap.has(pos.stock)) {
        // Already seen this stock — accumulate weight + append strategy
        const existing       = stockMap.get(pos.stock)!;
        existing.totalWeight = parseFloat((existing.totalWeight + pos.weight).toFixed(2));
        if (!existing.strategies.includes(pos.strategy)) {
          existing.strategies += ', ' + pos.strategy;
        }
      } else {
        // First occurrence — create new row
        stockMap.set(pos.stock, {
          symbol:                pos.stock,
          sector:                pos.sector,
          riskCategory:          pos.riskCategory,   
          strategies:            pos.strategy,
          shares:                pos.quantity,        // placeholder
          price:                 pos.purchasePrice,        // placeholder
          totalWeight:           parseFloat(pos.weight.toFixed(2)),
          allocationPercent:     0,        // calculated after all weights known
          date:                  '-',      // not in this endpoint
          markedForDeallocation: false,
          quantity:pos.quantity,
          purchasePrice:pos.purchasePrice
        });
      }
    });

    // ── Calculate allocation % after all weights are summed ───────────────
    const totalAllocated = Array.from(stockMap.values())
      .reduce((sum, row) => sum + row.totalWeight, 0);

    stockMap.forEach(row => {
      row.allocationPercent = totalAllocated > 0
        ? parseFloat(((row.totalWeight / totalAllocated) * 100).toFixed(2))
        : 0;
    });

    const allocationRows = Array.from(stockMap.values());

    // ── Sector breakdown for pie chart ────────────────────────────────────
    const sectorMap: Record<string, number> = {};
    positions.forEach(pos => {
      sectorMap[pos.sector] = (sectorMap[pos.sector] || 0) + pos.weight;
    });
    const sectorBreakdown: SectorBreakdown[] = Object.entries(sectorMap)
      .map(([sector, weight]) => ({
        sector,
        totalWeight: parseFloat(weight.toFixed(2)),
        percent:     totalAllocated > 0
                       ? parseFloat(((weight / totalAllocated) * 100).toFixed(1))
                       : 0,
      }))
      .sort((a, b) => b.totalWeight - a.totalWeight);

    // ── Strategy breakdown — Conservative vs Moderate split ───────────────
    const strategyMap: Record<string, number> = {};
    positions.forEach(pos => {
      strategyMap[pos.strategy] = (strategyMap[pos.strategy] || 0) + pos.weight;
    });
    const strategyBreakdown: StrategyBreakdown[] = Object.entries(strategyMap)
      .map(([strategyName, weight]) => ({
        strategyName,
        totalWeight: parseFloat(weight.toFixed(2)),
        percent:     totalAllocated > 0
                       ? parseFloat(((weight / totalAllocated) * 100).toFixed(1))
                       : 0,
      }));

    return {
      portfolioValue:       totalAUM,             // totalAUM from backend
      totalGain:            0,                    // needs real market prices
      gainPercentage:       0,                    // needs real market prices
      allocatedStocksCount: stockMap.size,
      unallocatedStocksCount:0,        // unique stocks
      unallocatedCash:      report.unallocated ?? 0, // unallocated from backend
      avgAnnualReturn:      0,
      allocations:          allocationRows,
      sectorBreakdown,
      strategyBreakdown
    };
  }
}
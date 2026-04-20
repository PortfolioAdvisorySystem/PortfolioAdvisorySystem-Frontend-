import { Injectable } from '@angular/core';

export interface UserAnswers {
  age: number;
  income: number;
  liabilities: number;
  riskTolerance: number;
  investmentHorizon: number;
  financialGoal: number;
  experience: number;
  liquidityNeed: number;
}

export interface RiskResult {
  score: number;
  profile: string;
  breakdown: any[];
  explanation: string[];
  recommendations: any[];
  funds: any[];
}

export interface StockAllocation {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  allocation: number;
  change: number;
  date: string;
}

export interface PortfolioData {
  portfolioValue: number;
  totalGain: number;
  gainPercentage: number;
  allocatedStocks: number;
  avgAnnualReturn: number;
  allocations: StockAllocation[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  answers: UserAnswers | null = null;
  result: RiskResult | null = null;
  portfolio: PortfolioData | null = null;

  getDefaultPortfolio(): PortfolioData {
    return {
      portfolioValue: 34200,
      totalGain: 9700,
      gainPercentage: 28.36,
      allocatedStocks: 4,
      avgAnnualReturn: 12.5,
      allocations: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, price: 185.5, value: 1855, allocation: 5.4, change: 2.1, date: '2024-06-01' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 8, price: 425.2, value: 3401.6, allocation: 9.9, change: 1.8, date: '2024-06-02' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 5, price: 192.8, value: 964, allocation: 2.8, change: 3.2, date: '2024-06-03' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 12, price: 195.5, value: 2346, allocation: 6.9, change: 0.9, date: '2024-06-04' }
      ]
    };
  }

  getUpdatedPortfolio(riskProfile: string): PortfolioData {
    // Generate portfolio based on risk profile
    if (!this.portfolio) {
      this.portfolio = this.getDefaultPortfolio();
    }
    return this.portfolio;
  }

}
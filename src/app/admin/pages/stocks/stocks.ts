import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Status = 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
type Risk = 'LOW' | 'MEDIUM' | 'HIGH';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  liquidity: number;
  risk: Risk;
  status: Status;
}

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stocks.html',
  styleUrls: ['./stocks.css']
})
export class StocksComponent {

  activeTab: 'ALL' | 'ELIGIBLE' = 'ALL';
  selectedSector = 'ALL';
  searchText = '';

  stocks: Stock[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Tech', price: 214, liquidity: 98, risk: 'LOW', status: 'ACTIVE' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Tech', price: 432, liquidity: 96, risk: 'LOW', status: 'ACTIVE' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Tech', price: 129, liquidity: 99, risk: 'MEDIUM', status: 'ACTIVE' },
    { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financials', price: 217, liquidity: 84, risk: 'MEDIUM', status: 'ACTIVE' },
    { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', price: 112, liquidity: 72, risk: 'HIGH', status: 'SUSPENDED' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 28, liquidity: 68, risk: 'MEDIUM', status: 'ACTIVE' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer', price: 249, liquidity: 92, risk: 'HIGH', status: 'ACTIVE' },
    { symbol: 'BA', name: 'Boeing Co.', sector: 'Industrials', price: 162, liquidity: 55, risk: 'HIGH', status: 'ACTIVE' },
    { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financials', price: 498, liquidity: 78, risk: 'MEDIUM', status: 'ACTIVE' },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Tech', price: 512, liquidity: 95, risk: 'MEDIUM', status: 'ACTIVE' },
  ];

  sectors = ['ALL', 'Tech', 'Financials', 'Energy', 'Healthcare', 'Consumer', 'Industrials'];

  // ---------------- ACTIONS ----------------

  toggleSuspend(stock: Stock) {
    stock.status = stock.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
  }

  activate(stock: Stock) {
    stock.status = 'ACTIVE';
  }

  blacklist(stock: Stock) {
    stock.status = 'BLACKLISTED';
  }

  // ---------------- FILTER ----------------

  get filteredStocks() {
    return this.stocks.filter(stock => {

      // 🔹 Tab filter (IMPORTANT)
      const tabMatch =
        this.activeTab === 'ALL' ||
        (this.activeTab === 'ELIGIBLE' && stock.status === 'ACTIVE');

      // 🔹 Sector filter
      const sectorMatch =
        this.selectedSector === 'ALL' ||
        stock.sector === this.selectedSector;

      // 🔹 Search filter
      const search = this.searchText.toLowerCase();
      const searchMatch =
        stock.symbol.toLowerCase().includes(search) ||
        stock.name.toLowerCase().includes(search);

      return tabMatch && sectorMatch && searchMatch;
    });
  }
}
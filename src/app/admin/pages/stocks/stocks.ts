import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stock } from '../../../models/admin';
import { ApiServices } from '../../../services/api-services';

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

  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];   // ✅ FIX (missing)

  currentPage = 1;
  pageSize = 10;
  paginatedStocks: Stock[] = [];

  constructor(private apiService: ApiServices, private cdr: ChangeDetectorRef) { }

  sectors: string[] = [
    'ALL',
    'Tech',
    'Financials',
    'Energy',
    'Healthcare',
    'Consumer',
    'Industrials'
  ];

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.apiService.getStocks().subscribe({
      next: (data: any[]) => {
        this.stocks = data.map(stock => ({
          id:stock.id,
          symbol: stock.symbol,
          sector: this.capitalize(stock.sector ?? 'UNKNOWN'),
          price: stock.price ?? 0,
          liquidity: stock.liquidityScore ?? stock.liquidity ?? 0,
          riskCategory: stock.riskCategory ?? stock.risk ?? 'LOW',
          active: stock.active ?? false,
          avgVolume: stock.avgVolume ?? 0,
          marketCap: stock.marketCap ?? 0,
          category: stock.category ?? ''
        }));

        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching stocks', err);
      }
    });
  }


 toggleSuspend(stock: Stock) {

  if (stock.active) {
    this.apiService.suspendStock(stock.id).subscribe({
      next: () => {
        stock.active = false;
      },
      error: (err) => {
        console.error('Suspend failed', err);
        alert('Failed to suspend stock');
      }
    });

  } else {
    this.apiService.activateStock(stock.id).subscribe({
      next: () => {
        stock.active = true;
      },
      error: (err) => {
        console.error('Activate failed', err);
        alert('Failed to activate stock');
      }
    });
  }

}

  activate(stock: Stock) {

  this.apiService.activateStock(stock.id).subscribe({
    next: () => {
      stock.active = true;
    },
    error: (err) => {
      console.error('Activate failed', err);
      alert('Failed to activate stock');
    }
  });

}

//   blacklist(stock: Stock) {

//   this.apiService.blacklistStock(stock.id).subscribe({
//     next: () => {
//       stock.active = false;
//       this.applyFilters();
//     },
//     error: (err) => {
//       console.error('Blacklist failed', err);
//       alert('Failed to blacklist stock');
//     }
//   });
// }


  applyFilters() {
    this.filteredStocks = this.stocks.filter(stock => {

      const tabMatch =
        this.activeTab === 'ALL' ||
        (this.activeTab === 'ELIGIBLE' && stock.active);

      const sectorMatch =
        this.selectedSector === 'ALL' ||
        stock.sector === this.selectedSector;

      const search = this.searchText.toLowerCase();

      const searchMatch =
        String(stock.symbol ?? '').toLowerCase().includes(search);

      return tabMatch && sectorMatch && searchMatch;
    });

    this.currentPage = 1;
    this.updatePagination();
    this.cdr.detectChanges(); 
  }


  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedStocks = this.filteredStocks.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredStocks.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }


  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  get totalPages(): number {
    return Math.ceil(this.filteredStocks.length / this.pageSize) || 1;
  }
}
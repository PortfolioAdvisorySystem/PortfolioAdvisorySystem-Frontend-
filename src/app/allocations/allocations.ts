import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../services/portfolio';
import { SubscriberAllocationReport, SubscriberPosition } from '../models/portfolio'; 
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import {ApiServices} from '../services/api-services'
export interface AllocationTableRow {
  symbol:      string;
  company:     string;
  sector:      string;
  shares:      number;
  price:       number;
  value:       number;
  change:      number;
  status:      'Active' | 'Pending Deallocation';
  riskCategory: string;
  strategies:  string;
}

@Component({
  selector: 'app-allocations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    NavbarComponent,
  ],
  templateUrl: './allocations.html',
  styleUrls: ['./allocations.css']
})
export class AllocationsComponent implements OnInit {
  subscriberId=1;
  //Number(localStorage.getItem("subscriberId"))||
  showForm = false;
  inflowAmount: number = 0;
  allAllocations:      AllocationTableRow[] = [];
  filteredAllocations: AllocationTableRow[] = [];

  searchQuery  = '';
  filterStatus = 'All';
  isLoading    = true;
  errorMsg     = '';

  totalAllocated  = 0;
  activePositions = 0;
  totalPositions  = 0;
  bestPerformer   = '-';

  constructor(
    private portfolioService: PortfolioService,
    private apiService:ApiServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAllocations();
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────

  fetchAllocations(): void {
    this.isLoading = true;
    this.errorMsg  = '';

    this.portfolioService.getAllocationBySubscriber().subscribe({
      next: (report: SubscriberAllocationReport) => {
        console.log(report);
        this.buildTable(report.positions);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg  = 'Could not load allocations. Is the backend running?';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('[Allocations] Fetch error:', err);
      }
    });
  }

  // ── Build table rows from positions ───────────────────────────────────────

  private buildTable(positions: SubscriberPosition[]): void {

    const stockMap = new Map<string, AllocationTableRow>();

    positions.forEach((pos: SubscriberPosition) => {
      if (stockMap.has(pos.stock)) {
        const existing   = stockMap.get(pos.stock)!;
        existing.value   = parseFloat((existing.value + pos.weight).toFixed(2));
        if (!existing.strategies.includes(pos.strategy)) {
          existing.strategies += ', ' + pos.strategy;
        }
      } else {
        stockMap.set(pos.stock, {
          symbol:      pos.stock,
          company:     pos.stock,   // no company name in this endpoint
          sector:      pos.sector,
          shares:      1,            // placeholder — backend returns 1
          price:       1,            // placeholder — backend returns 1
          value:       parseFloat(pos.weight.toFixed(2)),
          change:      0,            // needs real market prices
          status:      'Active',
          riskCategory: pos.riskCategory,      
          strategies:  pos.strategy,
        });
      }
    });

    this.allAllocations = Array.from(stockMap.values());

    // Summary card values
    this.totalAllocated  = parseFloat(
      this.allAllocations.reduce((sum, r) => sum + r.value, 0).toFixed(2)
    );
    this.activePositions = this.allAllocations.filter(r => r.status === 'Active').length;
    this.totalPositions  = this.allAllocations.length;
    this.bestPerformer   = [...this.allAllocations]
      .sort((a, b) => b.value - a.value)[0]?.symbol ?? '-';

    this.applyFilter();
  }

  // ── Search + Filter ────────────────────────────────────────────────────────

  onSearch(): void {
    this.applyFilter();
  }

  setFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  private applyFilter(): void {
    let result = [...this.allAllocations];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.symbol.toLowerCase().includes(q)  ||
        r.company.toLowerCase().includes(q) ||
        r.sector.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus === 'Active') {
      result = result.filter(r => r.status === 'Active');
    } else if (this.filterStatus === 'Pending') {
      result = result.filter(r => r.status === 'Pending Deallocation');
    }

    this.filteredAllocations = result;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  getRiskClass(risk: string): string {
    const map: Record<string, string> = {
      LOW:    'badge-green',
      MEDIUM: 'badge-orange',
      HIGH:   'badge-red',
    };
    return map[risk] ?? 'badge-grey';
  }

  getSectorColor(sector: string): string {
    const map: Record<string, string> = {
      TECHNOLOGY: '#10b981',
      FINANCE:    '#3b82f6',
      HEALTHCARE: '#06b6d4',
      ENERGY:     '#f97316',
    };
    return map[sector] ?? '#8b5cf6';
  }

  onEdit(row: AllocationTableRow): void {
    console.log('Edit:', row.symbol);
  }

  onDelete(row: AllocationTableRow): void {
    console.log('Delete:', row.symbol);
  }


submitInflow() {
  if (!this.inflowAmount || this.inflowAmount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const payload = {
   
    amount: this.inflowAmount
  };

  this.apiService.addInflows(this.subscriberId, payload).subscribe({
    next: () => {
      this.showForm = false;
      this.inflowAmount = 0;
      this.fetchAllocations();
    },
    error: () => {
      alert("Failed to add inflow");
    }
  });
}
}
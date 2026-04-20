import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Allocation {
  symbol: string;
  company: string;
  sector: string;
  shares: number;
  price: number;
  value: number;
  change: number;
  status: 'Active' | 'Pending';
}

@Component({
  selector: 'app-allocations',
  imports: [Sidebar, NavbarComponent, CommonModule, FormsModule],
  templateUrl: './allocations.html',
  styleUrl: './allocations.css',
})
export class AllocationsComponent {
  searchQuery: string = '';
  filterStatus: string = 'All';

  allocations: Allocation[] = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      sector: 'Technology',
      shares: 10,
      price: 185.5,
      value: 1855,
      change: 2.1,
      status: 'Active'
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corp.',
      sector: 'Technology',
      shares: 8,
      price: 425.2,
      value: 3401.6,
      change: 1.8,
      status: 'Active'
    },
    {
      symbol: 'JPM',
      company: 'JP Morgan Chase',
      sector: 'Finance',
      shares: 15,
      price: 195.3,
      value: 2929.5,
      change: -0.5,
      status: 'Active'
    },
    {
      symbol: 'XOM',
      company: 'Exxon Mobil',
      sector: 'Energy',
      shares: 20,
      price: 110.5,
      value: 2210,
      change: -1.3,
      status: 'Pending'
    }
  ];

  get filteredAllocations(): Allocation[] {
    return this.allocations.filter(allocation => {
      const matchesSearch = 
        allocation.symbol.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        allocation.company.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'All' || allocation.status === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  setFilter(status: string) {
    this.filterStatus = status;
  }
}

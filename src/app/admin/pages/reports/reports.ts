import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {

  activeTab: string = 'allocation';

  setTab(tab: string) {
    this.activeTab = tab;
  }

  // -------- DATA --------

  strategies = [
    { name: 'Conservative', value: 42 },
    { name: 'Moderate', value: 78 },
    { name: 'Aggressive', value: 56 },
    { name: 'Income', value: 31 },
    { name: 'Growth', value: 64 }
  ];

  subscribers = [
    { id: 'SUB-223', profile: 'Aggressive', aum: '$3,408,153' },
    { id: 'SUB-222', profile: 'Moderate', aum: '$3,270,842' },
    { id: 'SUB-221', profile: 'Conservative', aum: '$3,133,531' }
  ];

  migrations = [
    { id: 'MIG-700', sub: 'SUB-200', from: 'Conservative', to: 'Moderate', amount: '$50,000', when: '2h ago' },
    { id: 'MIG-699', sub: 'SUB-201', from: 'Moderate', to: 'Aggressive', amount: '$123,211', when: '20h ago' }
  ];

  rebalances = [
    { run: 'run_834', by: 'system', subs: 80, status: 'RUNNING' },
    { run: 'run_833', by: 'alice', subs: 117, status: 'COMPLETED' }
  ];

  risks = [
    { name: 'Sector cap', value: 40, type: 'warn' },
    { name: 'Concentration', value: 100, type: 'danger' },
    { name: 'Liquidity', value: 20, type: 'warn' }
  ];

  unallocated = [
    { sub: 'SUB-204', amount: '$320,000', reason: 'KYC refresh', days: '3d' }
  ];

  deallocation = [
    { id: 'DQ-1', symbol: 'XOM', reason: 'Suspended', amount: '$1,240,000', when: 'just now' }
  ];
}
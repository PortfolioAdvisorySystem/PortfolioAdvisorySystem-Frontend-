import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServices } from '../../../services/api-services';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent {

  activeTab: string = 'allocation';
pageSize = 10;

// separate page tracking
allocationPage = 1;
migrationPage = 1;
rebalancePage = 1;
riskPage = 1;
unallocatedPage = 1;
deallocationPage = 1;
 setTab(tab: string) {
  this.activeTab = tab;

  // reset pages
  this.allocationPage = 1;
  this.migrationPage = 1;
  this.rebalancePage = 1;
  this.riskPage = 1;
  this.unallocatedPage = 1;
  this.deallocationPage = 1;
}
strategies: any[] = [];
subscribers: any[] = [];
migrations: any[] = [];
rebalances: any[] = [];
risks: any[] = [];
unallocated: any[] = [];
deallocation: any[] = [];


constructor(private apiService: ApiServices,private cdr:ChangeDetectorRef) {}
ngOnInit() {
  this.loadReports();

}
loadReports() {

  // 🔹 Strategy Report
  this.apiService.getStrategyReport().subscribe(data => {
    this.strategies = (data || []).map(s => ({
      name: s.strategyName,
      value: s.percentage
    }));
    this.allocationPage = 1;
        this.cdr.detectChanges();

  });

  // 🔹 Subscribers
  this.apiService.getSubscriberReport().subscribe(data => {
    this.subscribers = (data || []).map(s => ({
      id: s.subscriberId,
      profile: this.formatRisk(s.riskProfile),
      aum: this.formatCurrency(s.aum)
    }));
  });

  // 🔹 Migrations
  this.apiService.getMigrationReport().subscribe(data => {
    this.migrations = (data || []).map(m => ({
      id: m.id,
      sub: m.subscriberId,
      details: m.migrationReason,
      amount: this.formatCurrency(m.amountShifted),
      when: m.timeAgo || 'recent'
    }));
  });

  // 🔹 Rebalances
  this.apiService.getRebalanceReport().subscribe(data => {
  this.rebalances = (data || []).map(r => ({
    id: r.id,
    reason: r.triggerReason,
    by: r.triggeredBy,
    status: r.status,
    summary: r.summary,
    triggeredAt: this.formatDate(r.triggeredAt),
    completedAt: this.formatDate(r.completedAt)
  }));
});


  // 🔹 Risks
  this.apiService.getRiskReport().subscribe(data => {
    this.risks = (data || []).map(r => ({
      name: r.ruleName,
      value: r.percent,
      type: r.severity
    }));
  });

  // 🔹 Unallocated
  this.apiService.getUnallocatedReport().subscribe(data => {
    this.unallocated = (data || []).map(u => ({
      sub: "SUB " + u.subscriberId,
      amount: this.formatCurrency(u.unallocatedAmount),
      allocated: this.formatCurrency(u.allocatedAmount)
    }));
  });

  // 🔹 Deallocation
  this.apiService.getDeallocationReport().subscribe(data => {
    this.deallocation = (data || []).map(d => ({
      id: d.id,
      symbol: d.stockSymbol,
      reason: d.reason,
      amount: this.formatCurrency(d.amount),
      when: d.timeAgo || 'recent'
    }));
  });
}
formatRisk(risk: string): string {
  return risk?.charAt(0).toUpperCase() + risk?.slice(1).toLowerCase();
}

formatCurrency(value: number): string {
  return '₹' + (value || 0).toLocaleString();
}
get paginatedStrategies() {
  return this.paginate(this.strategies, this.allocationPage);
}

get paginatedSubscribers() {
  return this.paginate(this.subscribers, this.allocationPage);
}

get paginatedMigrations() {
  return this.paginate(this.migrations, this.migrationPage);
}

get paginatedRebalances() {
  return this.paginate(this.rebalances, this.rebalancePage);
}

get paginatedRisks() {
  return this.paginate(this.risks, this.riskPage);
}

get paginatedUnallocated() {
  return this.paginate(this.unallocated, this.unallocatedPage);
}

get paginatedDeallocation() {
  return this.paginate(this.deallocation, this.deallocationPage);
}
formatDate(date: string): string {
  return new Date(date).toLocaleString();
}
paginate(data: any[], page: number) {
  const start = (page - 1) * this.pageSize;
  return data.slice(start, start + this.pageSize);
}

getTotalPages(data: any[]) {
  return Math.ceil(data.length / this.pageSize) || 1;
}
}
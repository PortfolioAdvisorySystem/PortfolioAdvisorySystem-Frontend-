import { Component, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  templateUrl: './profile-dashboard.html',
  styleUrls: ['./profile-dashboard.css'],
  imports: [Sidebar, NavbarComponent, CommonModule]
})
export class ProfileDashboardComponent {

  strategies: any[] = [];
  currentStrategy: {
  strategyId: number;
  strategyName: string;
  risk: string;
} | null = null;

currentStrategyId: number | null = null;
selectedStrategyId: number | null = null;
  

  isEditingPlan: boolean = false;

  name = '';
  email = '';
  investmentAmount = 0;
  memberSince = '';

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadStrategies();
     this.loadCurrentStrategy(); 
  }

  // ================= PROFILE =================
  loadProfile() {
    this.portfolioService.getSubscriberProfile().subscribe({
      next: (data: any) => {

        this.name = data.name;
        this.email = data.email;
        this.investmentAmount = data.investmentAmount;

        this.memberSince = 'Member since ' + this.formatDate(data.createdAt);

        this.setCurrentStrategy();  

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Profile error', err)
    });
  }

  // ================= STRATEGIES =================
  loadStrategies() {
    this.portfolioService.getStrategies().subscribe({
      next: (data: any[]) => {

        this.strategies = data.filter(s => s.active);

        this.setCurrentStrategy();   

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Strategy error', err)
    });
  }

  // ================= CORE LOGIC =================
  setCurrentStrategy() {

    if (!this.strategies.length || !this.currentStrategyId) return;

    this.currentStrategy = this.strategies.find(
      s => s.id === this.currentStrategyId
    );
  }

  // ================= UI =================
  enableEdit() {
    this.isEditingPlan = true;
  }

  selectStrategy(strategy: any) {
    this.selectedStrategyId = strategy.id;
  }
cancelEdit() {
  this.isEditingPlan = false;
  this.selectedStrategyId = this.currentStrategyId; // reset selection
}
  savePlan() {

  if (!this.selectedStrategyId || this.selectedStrategyId === this.currentStrategyId) {
    this.isEditingPlan = false;
    return;
  }

  const payload = [
    {
      strategyId: this.selectedStrategyId,
      allocationPercent: 100   
    }
  ];

  this.portfolioService.updateSubscriberPlan(payload).subscribe({
    next: () => {

      this.isEditingPlan = false;
      this.loadCurrentStrategy();
      this.cdr.detectChanges();

    },
    error: (err) => {
      console.error('Update failed', err);
      alert('Failed to update strategy');
    }
  });
}
loadCurrentStrategy() {
  this.portfolioService.getCurrentStrategy().subscribe({
    next: (data: any) => {
      this.currentStrategy = {
        strategyId: Number(data.strategyId),
        strategyName: data.strategyName,
        risk: data.risk
      };

      this.currentStrategyId = this.currentStrategy.strategyId;
      this.selectedStrategyId = this.currentStrategy.strategyId;

      this.cdr.detectChanges();
    },
    error: (err) => console.error('Current strategy error', err)
  });
}
  // ================= HELPERS =================
  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}
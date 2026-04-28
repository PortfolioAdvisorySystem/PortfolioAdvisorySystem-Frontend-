import { Component,ChangeDetectorRef } from '@angular/core';
import { ApiServices } from '../../../services/api-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

  constructor(private api: ApiServices,private cdr:ChangeDetectorRef) {}

  dashboard: any = {};

  strategies: any[] = [];
  breaches: any[] = [];

  max = 0;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
  this.api.getDashboard().subscribe({
    next: (data) => {

      this.dashboard = data;

      // 🔥 FIXED MAPPING
      this.strategies = (data.allocationByStrategy || []).map((s: any) => ({
        name: s.strategyName,
        value: Number(s.percentage) // ✅ USE percentage
      }));

      // 🔥 SAFE MAX
      this.max = this.strategies.length
        ? Math.max(...this.strategies.map(s => s.value))
        : 1;

      this.breaches = data.ruleBreaches || {};
     this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Dashboard error', err);
    }
  });
}
}
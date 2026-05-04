import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent }  from '../navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.html',
  styleUrls: ['./profile-dashboard.css'],
  imports: [Sidebar, NavbarComponent,CommonModule]
})
export class ProfileDashboardComponent {

  isEditingPlan: boolean = false;

  currentPlan: string = 'Moderate';
  selectedPlan: string = 'Moderate';

  plans = [
    {
      name: 'Conservative',
      desc: 'Low risk, stable returns',
      color: 'blue'
    },
    {
      name: 'Moderate',
      desc: 'Balanced risk and returns',
      color: 'green'
    },
    {
      name: 'Aggressive',
      desc: 'High risk, high returns',
      color: 'red'
    }
  ];

  enableEdit() {
    this.isEditingPlan = true;
    this.selectedPlan = this.currentPlan;
  }

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  savePlan() {
    this.currentPlan = this.selectedPlan;
    this.isEditingPlan = false;
  }
}
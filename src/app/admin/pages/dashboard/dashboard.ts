import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  data = {
    conservative: 40,
    moderate: 80,
    aggressive: 60
  };

  max = Math.max(
    this.data.conservative,
    this.data.moderate,
    this.data.aggressive
  );
}
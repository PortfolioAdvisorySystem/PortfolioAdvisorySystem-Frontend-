import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Sidebar} from '../sidebar/sidebar';  // ✅ correct import

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Sidebar],   
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.createLineChart();
    this.createPieChart();
  }

  createLineChart() {
    new Chart("lineChart", {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Portfolio Growth',
          data: [25000, 27000, 26000, 29000, 31000, 34000],
          borderColor: '#1db954'
        }]
      }
    });
  }

  createPieChart() {
    new Chart("pieChart", {
      type: 'doughnut',
      data: {
        labels: ['Tech', 'Finance', 'Healthcare', 'Energy'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#1db954', '#00cfe8', '#3b82f6', '#f59e0b']
        }]
      }
    });
  }
  
}
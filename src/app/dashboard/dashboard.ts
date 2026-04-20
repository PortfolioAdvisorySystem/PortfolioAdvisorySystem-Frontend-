import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { DataService, PortfolioData } from '../services/data';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('lineChart') lineChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  portfolio: PortfolioData;

  constructor(private dataService: DataService) {
    // Get portfolio data from service or use default
    this.portfolio = this.dataService.portfolio || this.dataService.getDefaultPortfolio();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createLineChart();
      this.createPieChart();
    });
  }

  createLineChart() {
    if (!this.lineChartRef) return;

    new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [25000, 27000, 26000, 29000, 31000, 34000],
          borderColor: '#1db954',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1db954'
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: '#8ca0b3' },
            grid: { color: '#1f2a3a' }
          },
          y: {
            ticks: { color: '#8ca0b3' },
            grid: { color: '#1f2a3a' }
          }
        }
      }
    });
  }

  createPieChart() {
    new Chart(this.pieChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Tech', 'Finance', 'Healthcare', 'Energy'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#1db954', '#00cfe8', '#3b82f6', '#f59e0b'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });
  }
}
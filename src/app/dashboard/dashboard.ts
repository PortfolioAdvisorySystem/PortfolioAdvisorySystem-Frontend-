import {
  Component, OnInit, AfterViewInit,
  ViewChild, ElementRef, OnDestroy
  ,NgZone,ChangeDetectorRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PortfolioService } from '../services/portfolio';
import { PortfolioDashboard } from '../models/portfolio';

// ── Import your sidebar and navbar ────────────────────────────────────────────
// Update paths if your folder structure is different
import { Sidebar } from '../sidebar/sidebar';
import { NavbarComponent }  from '../navbar/navbar';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,       // needed for *ngIf, *ngFor, pipes
    Sidebar,   // fixes: 'app-sidebar' is not a known element
    NavbarComponent,    // fixes: 'app-navbar' is not a known element
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart')  pieChartRef!:  ElementRef<HTMLCanvasElement>;

  portfolio!: PortfolioDashboard;
  isLoading = true;
  errorMsg  = '';

  private lineChartInstance?: Chart;
  private pieChartInstance?:  Chart;

  // Sector → colour mapping (matches your actual sectors from backend)
  readonly sectorColors: Record<string, string> = {
    TECHNOLOGY: '#10b981',
    FINANCE:    '#3b82f6',
    HEALTHCARE: '#06b6d4',
    ENERGY:     '#f97316',
  };

  constructor(private portfolioService: PortfolioService,private ngZone:NgZone,private cdr: ChangeDetectorRef ) {}

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.fetchPortfolio();
    
  }

  ngAfterViewInit(): void {
    // Charts drawn after data arrives inside fetchPortfolio()
  }

  ngOnDestroy(): void {
    this.lineChartInstance?.destroy();
    this.pieChartInstance?.destroy();
  }

  // ── Data fetch ─────────────────────────────────────────────────────────────

  fetchPortfolio(): void {
    this.isLoading = true;
    this.errorMsg  = '';

    this.portfolioService.getPortfolioDashboard().subscribe({
      next: (data) => {
        console.log(data);
          this.ngZone.run(() => {       
        this.portfolio = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.drawCharts(), 100);
      });
      },
      error: (err) => {
        this.errorMsg  = 'Could not load portfolio data. Is the backend running?';
        this.isLoading = false;
        console.error('[Dashboard] Fetch error:', err);
      }
    });
  }

  // ── Charts ─────────────────────────────────────────────────────────────────

  private drawCharts(): void {
    this.drawLineChart();
    this.drawPieChart();
  }

  private drawLineChart(): void {
    if (!this.lineChartRef?.nativeElement) return;
    this.lineChartInstance?.destroy();
    const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const endVal  = this.portfolio.portfolioValue;
    const startVal = endVal * 0.72;
    const step     = (endVal - startVal) / (labels.length - 1);
    const data = labels.map((_, i) =>
      parseFloat((startVal + step * i + (Math.random() - 0.5) * step * 0.25).toFixed(2))
    );
    data[data.length - 1] = endVal; // pin last point to real value

    this.lineChartInstance = new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label:           'Portfolio Value ($)',
          data,
          borderColor:     '#10b981',
          backgroundColor: 'rgba(16,185,129,0.07)',
          borderWidth:     2.5,
          pointRadius:     4,
          pointBackgroundColor: '#10b981',
          tension:         0.4,
          fill:            true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `$${(ctx.raw as number).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: { callback: v => `$${(v as number).toLocaleString()}` },
            grid:  { color: 'rgba(0,0,0,0.04)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private drawPieChart(): void {
    if (!this.pieChartRef?.nativeElement) return;
    if (!this.portfolio.sectorBreakdown.length) return;
    this.pieChartInstance?.destroy();

    const sectors = this.portfolio.sectorBreakdown;
    const colors  = sectors.map(s => this.sectorColors[s.sector] ?? '#8b5cf6');

    this.pieChartInstance = new Chart(this.pieChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels:   sectors.map(s => s.sector),
        datasets: [{
          data:            sectors.map(s => s.percent),
          backgroundColor: colors,
          borderWidth:     2,
          borderColor:     '#ffffff',
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  // ── Template helpers ───────────────────────────────────────────────────────

  getSectorColor(sector: string): string {
    return this.sectorColors[sector] ?? '#8b5cf6';
  }

  getRiskBadgeClass(risk: string): string {
    return {
      LOW:    'badge-green',
      MEDIUM: 'badge-orange',
      HIGH:   'badge-red',
    }[risk] ?? 'badge-grey';
  }
}
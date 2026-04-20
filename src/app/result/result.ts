import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class ResultComponent implements OnInit {

  result: any = { score: 0, profile: 'Unknown' };

  breakdownList: any[] = [];
  explanations: string[] = [];
  recommendations: any[] = [];
  funds: any[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  // ngOnInit() {
  //   const navigation = this.router.getCurrentNavigation();
  //   const answers = navigation?.extras?.state?.['answers'];

  //   if (answers) {
  //     const calculated = calculateRisk(answers);

  //     this.result = calculated;
  //     this.breakdownList = calculated.breakdown || [];
  //     this.explanations = calculated.explanation || [];
  //     this.recommendations = calculated.recommendations || [];
  //     this.funds = calculated.funds || [];
  //   }
  // }

  // ngOnInit() {

  //   const result = this.dataService.result;

  //   if (result) {
  //     this.result = result;
  //     this.breakdownList = result.breakdown || [];
  //     this.explanations = result.explanation || [];
  //     this.recommendations = result.recommendations || [];
  //     this.funds = result.funds || [];
  //   } else {
  //     // fallback (if user refreshes page)
  //     this.result = { score: 0, profile: 'Unknown' };
  //   }
  // }

  ngOnInit() {

  console.log("DataService RESULT:", this.dataService.result);

  if (!this.dataService.result) {
    console.error("❌ No result found. Redirecting...");
    this.router.navigate(['/questions']);
    return;
  }

  const result = this.dataService.result;

  this.result = result;
  this.breakdownList = result.breakdown || [];
  this.explanations = result.explanation || [];
  this.recommendations = result.recommendations || [];
  this.funds = result.funds || [];

  // Generate portfolio allocations based on risk profile
  this.generatePortfolioAllocations(result.profile);
}

private generatePortfolioAllocations(riskProfile: string) {
  // Generate portfolio data based on risk profile
  const portfolio = this.dataService.getUpdatedPortfolio(riskProfile);
  
  // Store the portfolio in the data service
  this.dataService.portfolio = portfolio;
  
  console.log("✓ Portfolio allocations generated:", portfolio);
}

  getGaugeColor(score: number): string {
    if (score <= 33) return '#2ed573';
    if (score <= 66) return '#ffa502';
    return '#ff4757';
  }

  getPieSegment(startPercent: number, percent: number): string {
    const startAngle = (startPercent / 100) * 360;
    const endAngle = ((startPercent + percent) / 100) * 360;

    const start = this.polarToCartesian(100, 100, 80, endAngle);
    const end = this.polarToCartesian(100, 100, 80, startAngle);

    const largeArcFlag = percent > 50 ? 1 : 0;

    return `
      M 100 100
      L ${start.x} ${start.y}
      A 80 80 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      Z
    `;
  }

  polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  retakeAssessment() {
    this.router.navigate(['/']);
  }
}
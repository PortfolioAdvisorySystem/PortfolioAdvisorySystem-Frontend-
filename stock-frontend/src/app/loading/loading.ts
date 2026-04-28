import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { calculateRisk, UserAnswers } from '../services/risk-engine';
import { DataService } from '../services/data';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading implements OnInit {

  currentMessage = '';
  progress = 0;
  answers!: UserAnswers;
  result: any;

  analysisSteps = [
    { message: 'Analyzing personal information...', duration: 400 },
    { message: 'Evaluating risk tolerance...', duration: 500 },
    { message: 'Processing investment timeline...', duration: 400 },
    { message: 'Calculating optimal allocation...', duration: 500 },
    { message: 'Generating personalized portfolio...', duration: 400 },
    { message: 'Finalizing recommendations...', duration: 300 }
  ];

  currentStepIndex = 0;

  constructor(private router: Router, private dataService: DataService) { }

  
  ngOnInit() {

  if (!this.dataService.answers) {
    console.error("❌ Answers missing");
    this.router.navigate(['/questions']);
    return;
  }

  this.answers = this.dataService.answers;

  console.log('ANSWERS:', this.answers);

  this.startAnalysis();
}

  private startAnalysis() {
    this.runAnalysisStep();
  }

  private runAnalysisStep() {

    if (this.currentStepIndex >= this.analysisSteps.length) {

     
      console.log('ANSWERS:', this.answers);
      this.result = this.dataService.result;


if (!this.result) {
  console.error("❌ Result missing in DataService");
  this.router.navigate(['/questions']);
  return;
}


this.dataService.result = this.result;

setTimeout(() => {
  this.router.navigate(['/result']); 
}, 100);

      return;
    }

    const step = this.analysisSteps[this.currentStepIndex];
    this.currentMessage = step.message;

    const targetProgress = ((this.currentStepIndex + 1) / this.analysisSteps.length) * 100;
    this.animateProgress(this.progress, targetProgress, step.duration);

    setTimeout(() => {
      this.currentStepIndex++;
      this.runAnalysisStep();
    }, step.duration);
  }

  private animateProgress(start: number, end: number, duration: number) {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      this.progress = start + (end - start) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
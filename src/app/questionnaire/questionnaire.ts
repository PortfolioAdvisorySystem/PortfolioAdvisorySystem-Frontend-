import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data';
import { calculateRisk } from '../services/risk-engine';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questionnaire.html',
  styleUrls: ['./questionnaire.css']
})
export class QuestionnaireComponent {

  private _currentStep = 0;
  ageError = '';
  incomeError = '';
  liabilitiesError = '';
  optionsError = '';
  showError = false;
  hasAttemptedToProgress = false; 

  constructor(private router: Router, private dataService: DataService) {
    
    this.clearErrors();
  }

  get currentStep() {
    return this._currentStep;
  }

  set currentStep(value: number) {
    this._currentStep = value;
    
    this.clearErrors();
    this.hasAttemptedToProgress = false;
  }

  answers: any = {
    age: null,
    income: null,
    liabilities: null,
    risk: null,
    horizon: null,
    goal: null,
    experience: null,
    liquidity: null
  };

  questions = [
    {
      key: 'age',
      label: 'Personal Info',
      title: 'How old are you?',
      description: 'Age helps us gauge your investment timeline'
    },
    {
      key: 'income',
      label: 'Personal Info',
      title: "What's your monthly income?",
      description: 'Helps assess your financial capacity'

    },
    {
      key: 'liabilities',
      label: 'Personal Info',
      title: 'Total outstanding liabilities?',
      description: 'EMIs, loans, credit card debt, etc.'
    },
    {
      key: 'risk',
      label: 'Risk Tolerance',
      title: 'If your portfolio dropped 20% in a month, you would…',
      description: '',
      options: [
        'Sell everything immediately',
        'Sell some to reduce losses',
        'Hold and wait it out',
        'Buy more at lower prices',
        'Aggressively buy the dip'
      ]
    },
    {
      key: 'horizon',
      label: 'Time Horizon',
      title: 'How long do you plan to stay invested?',
      description: '',
      options: [
        'Less than 1 year',
        '1–3 years',
        '3–5 years',
        '5–10 years',
        '10+ years'
      ]
    },
    {
      key: 'goal',
      label: 'Financial Goals',
      title: "What's your primary financial goal?",
      description: '',
      options: [
        'Capital preservation',
        'Regular income',
        'Balanced growth',
        'Aggressive wealth creation',
        'Maximum returns, any risk'
      ]
    },
    {
      key: 'experience',
      label: 'Experience',
      title: 'How experienced are you with investing?',
      description: '',
      options: [
        'Complete beginner',
        'Know the basics',
        'Moderate experience',
        'Experienced investor',
        'Expert / Professional'
      ]
    },
    {
      key: 'liquidity',
      label: 'Liquidity',
      title: 'How soon might you need this money?',
      description: '',
      options: [
        "Won't need it for years",
        'Unlikely in next 2 years',
        'Might need some in a year',
        'Could need it in 6 months',
        'May need it anytime'
      ]
    }
  ];

  next() {
    const key = this.questions[this.currentStep].key;
    const answer = this.answers[key];

    
    this.hasAttemptedToProgress = true;

    
    this.clearErrors();


    if (this.isEmptyAnswer(key, answer)) {
      if (['age', 'income', 'liabilities'].includes(key)) {
        this.setError(key, 'This field is required');
      } else {
        this.optionsError = 'Please select an option before continuing';
      }
      return;
    }

    if (key === 'age' && (answer < 18 || answer > 80)) {
      this.ageError = 'Age must be at least 18 and 80';
      return;
    }

   
    if (['age', 'income'].includes(key) && answer <= 0) {
      this.setError(key, 'Please enter a valid amount greater than 0');
      return;
    }

    if (key === 'liabilities' && answer < 0) {
      this.setError(key, 'Please enter a valid amount (0 or greater)');
      return;
    }

  
    this.clearErrors();
    this.hasAttemptedToProgress = false;  

    
    if (this.currentStep === this.questions.length - 1) {

      const formattedAnswers = {
        age: this.answers.age,
        income: this.answers.income,
        liabilities: this.answers.liabilities,

        riskTolerance: this.mapOptionToScore(this.answers.risk),
        investmentHorizon: this.mapOptionToScore(this.answers.horizon),
        financialGoal: this.mapOptionToScore(this.answers.goal),
        experience: this.mapOptionToScore(this.answers.experience),
        liquidityNeed: this.mapOptionToScore(this.answers.liquidity)
      };
      console.log("Formatted",formattedAnswers);
      

      const result = calculateRisk(formattedAnswers);
      console.log("result");
      

      this.dataService.answers = formattedAnswers;
      this.dataService.result = result;

    
      this.router.navigate(['/loading']);

      return;
    }

   
    this.currentStep = this.currentStep + 1;
  }

  private isEmptyAnswer(key: string, answer: any): boolean {
    if (['age', 'income', 'liabilities'].includes(key)) {
      // For numeric inputs, check for null, undefined, empty string, or NaN
      // Note: 0 is valid for liabilities (no debt), but not for age/income
      if (key === 'liabilities') {
        return answer === null ||
          answer === undefined ||
          answer === '' ||
          isNaN(answer);
      } else {
        return answer === null ||
          answer === undefined ||
          answer === '' ||
          isNaN(answer) ||
          answer === 0;
      }
    } else {
      // For options, check for null, undefined, or empty string
      return !answer || answer === null || answer === undefined || answer === '';
    }
  }

  selectOptionAndAdvance(option: string) {
    const key = this.questions[this.currentStep].key;
    this.answers[key] = option;

    // Clear errors and reset attempt flag when option is selected
    this.clearErrors();
    this.hasAttemptedToProgress = false;

    // Small delay to show selection before advancing
    setTimeout(() => {
      this.next();
    }, 200);
  }

  selectOption(opt: any) {
    const key = this.questions[this.currentStep].key;

    this.answers[key] = opt;

    // remove error instantly when user selects
    this.clearErrors();
    this.hasAttemptedToProgress = false;
  }

  handleContainerEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    // Only handle Enter key presses
    if (keyboardEvent.key !== 'Enter') {
      return;
    }

    const target = event.target as HTMLElement;

    // If the Enter was pressed on an input field, let the input handler deal with it
    if (target.tagName === 'INPUT') {
      return;
    }

    // If Enter was pressed on an option, let the option handler deal with it
    if (target.classList.contains('option')) {
      return;
    }

    // For any other Enter press in the container, try to advance with validation
    event.preventDefault();
    this.next();
  }

  back() {
    if (this.currentStep > 0) {
      this.hasAttemptedToProgress = false; 
      this.currentStep = this.currentStep - 1;
    }
  }

  private clearErrors() {
    this.ageError = '';
    this.incomeError = '';
    this.liabilitiesError = '';
    this.optionsError = '';
  }

  private setError(field: string, message: string) {
    switch (field) {
      case 'age':
        this.ageError = message;
        break;
      case 'income':
        this.incomeError = message;
        break;
      case 'liabilities':
        this.liabilitiesError = message;
        break;
    }
  }

  get progress() {
    return ((this.currentStep + 1) / this.questions.length) * 100;
  }

  handleEnter() {
    this.next();
  }

  mapOptionToScore(option: string): number {
    const mapping: any = {

     
      'Sell everything immediately': 1,
      'Sell some to reduce losses': 2,
      'Hold and wait it out': 3,
      'Buy more at lower prices': 4,
      'Aggressively buy the dip': 5,

      
      'Less than 1 year': 1,
      '1–3 years': 2,
      '3–5 years': 3,
      '5–10 years': 4,
      '10+ years': 5,

      
      'Capital preservation': 1,
      'Regular income': 2,
      'Balanced growth': 3,
      'Aggressive wealth creation': 4,
      'Maximum returns, any risk': 5,

     
      'Complete beginner': 1,
      'Know the basics': 2,
      'Moderate experience': 3,
      'Experienced investor': 4,
      'Expert / Professional': 5,

     
      "Won't need it for years": 1,
      'Unlikely in next 2 years': 2,
      'Might need some in a year': 3,
      'Could need it in 6 months': 4,
      'May need it anytime': 5
    };

    return mapping[option] || 3;
  }
}
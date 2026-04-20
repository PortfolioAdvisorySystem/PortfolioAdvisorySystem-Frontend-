import { Injectable } from '@angular/core';

export interface UserAnswers {
  age: number;
  income: number;
  liabilities: number;
  riskTolerance: number;
  investmentHorizon: number;
  financialGoal: number;
  experience: number;
  liquidityNeed: number;
}

export interface RiskResult {
  score: number;
  profile: string;
  breakdown: any[];
  explanation: string[];
  recommendations: any[];
  funds: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  answers: UserAnswers | null = null;
  result: RiskResult | null = null;

}
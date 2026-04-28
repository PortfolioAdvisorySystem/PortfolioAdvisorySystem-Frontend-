
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

export function calculateRisk(answers: UserAnswers) {

  const riskToleranceScore = answers.riskTolerance * 20;
  const horizonScore = answers.investmentHorizon * 20;
  const goalScore = answers.financialGoal * 20;
  const experienceScore = answers.experience * 20;
  const liquidityScore = (5 - answers.liquidityNeed) * 20;

  const finalScore = Math.round(
    riskToleranceScore * 0.25 +
    horizonScore * 0.20 +
    goalScore * 0.15 +
    experienceScore * 0.10 +
    liquidityScore * 0.10 +
    60 * 0.20 // dummy risk capacity
  );

  let profile = 'Moderate';
  if (finalScore > 66) profile = 'Aggressive';
  else if (finalScore < 33) profile = 'Conservative';

  return {
    score: finalScore,
    profile,

    breakdown: [
      { label: 'Risk Tolerance', score: riskToleranceScore },
      { label: 'Risk Capacity', score: 60 },
      { label: 'Investment Horizon', score: horizonScore },
      { label: 'Financial Goals', score: goalScore },
      { label: 'Experience', score: experienceScore },
      { label: 'Liquidity Flexibility', score: liquidityScore }
    ],

    explanation: [
      'You have a strong appetite for growth.',
      'You can tolerate market volatility.',
      'Long-term investing suits your profile.'
    ],

    recommendations: [
      { category: 'Equity (Multi Cap)', percentage: 40, color: '#00ffc3' },
      { category: 'Mid & Small Cap', percentage: 25, color: '#00d4aa' },
      { category: 'Sectoral/Thematic', percentage: 20, color: '#ffc107' },
      { category: 'Hybrid Funds', percentage: 15, color: '#6c5ce7' }
    ],

    funds: [
      { name: 'Parag Parikh Flexi Cap', type: 'Equity', risk: 'High' },
      { name: 'Axis Small Cap Fund', type: 'Equity', risk: 'Very High' },
      { name: 'Nippon India Growth Fund', type: 'Equity', risk: 'High' }
    ]
  };
}
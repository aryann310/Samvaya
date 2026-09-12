export function calculateHealthScore(margin: number, cashRunwayMonths: number, dti: number, inventoryTurnover: string, revGrowth: number) {
  let marginScore = 0;
  if (margin > 20) marginScore = 100;
  else if (margin >= 15) marginScore = 80;
  else if (margin >= 10) marginScore = 60;
  else if (margin >= 5) marginScore = 40;
  else marginScore = 20;

  let runwayScore = 0;
  if (cashRunwayMonths > 6) runwayScore = 100;
  else if (cashRunwayMonths >= 3) runwayScore = 70;
  else if (cashRunwayMonths >= 1) runwayScore = 40;
  else runwayScore = 10;

  let dtiScore = 0;
  if (dti === 0) dtiScore = 100;
  else if (dti < 20) dtiScore = 80;
  else if (dti < 40) dtiScore = 60;
  else if (dti < 60) dtiScore = 40;
  else dtiScore = 20;

  let turnoverScore = 0;
  if (inventoryTurnover === 'high') turnoverScore = 100;
  else if (inventoryTurnover === 'medium') turnoverScore = 60;
  else turnoverScore = 30;

  let revScore = 0;
  if (revGrowth > 5) revScore = 100;
  else if (revGrowth >= 2) revScore = 80;
  else if (revGrowth >= 0) revScore = 60;
  else revScore = 30;

  const score = (marginScore * 0.25) + (runwayScore * 0.20) + (dtiScore * 0.20) + (turnoverScore * 0.15) + (revScore * 0.20);
  
  let explanation = '';
  if (score >= 80) explanation = 'Excellent financial health.';
  else if (score >= 60) explanation = 'Good health, but room for improvement.';
  else explanation = 'Needs immediate attention.';

  return { score: Math.round(score), explanation };
}

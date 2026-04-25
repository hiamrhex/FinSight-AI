const calculateMetrics = (income, expenses, savings, debt) => {
  const savingsRate = ((savings / income) * 100).toFixed(1);

  const expenseRatio = ((expenses / income) * 100).toFixed(1);

  const debtRatio = ((debt / income) * 100).toFixed(1);

  const runway = (savings / (expenses || 1)).toFixed(1);

  return {
    savingsRate: Number(savingsRate),
    expenseRatio: Number(expenseRatio),
    debtRatio: Number(debtRatio),
    runway: Number(runway),
  };
};

const calculateRiskScore = ({
  savingsRate,
  debtRatio,
  expenseRatio,
  runway,
}) => {
  let score = 0;

  if (debtRatio > 50) score += 40;
  if (savingsRate < 20) score += 30;
  if (expenseRatio > 70) score += 30;

  score = Math.min(score, 100);

  let riskLevel;
  if (score <= 40) riskLevel = "Low";
  else if (score <= 70) riskLevel = "Medium";
  else riskLevel = "High";

  let bankVerdict;
  if (debtRatio < 35)
    bankVerdict =
      "APPROVED — Your DTI is healthy. A bank would likely approve your loan application.";
  else if (debtRatio < 50)
    bankVerdict =
      "BORDERLINE — A bank would hesitate. You need to reduce your debt first.";
  else
    bankVerdict =
      "REJECTED — Your DTI is too high. No serious bank would approve a loan right now.";

  let runwayVerdict;
  if (runway < 1)
    runwayVerdict =
      "CRITICAL — Less than 1 month runway. One emergency finishes you.";
  else if (runway < 3)
    runwayVerdict =
      "DANGEROUS — Less than 3 months runway. You are one job loss away from crisis.";
  else if (runway < 6)
    runwayVerdict = "WEAK — Aim for at least 6 months emergency fund.";
  else runwayVerdict = "SOLID — You have a healthy emergency buffer.";

  return { riskScore: score, riskLevel, bankVerdict, runwayVerdict };
};

module.exports = { calculateMetrics, calculateRiskScore };

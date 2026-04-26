const {
  calculateMetrics,
  calculateRiskScore,
} = require("../services/financialService");
const { generateAnalysis } = require("../services/aiService");

const analyzeFinancials = async (req, res) => {
  try {
    const { income, expenses, savings, debt, goal } = req.body;
  
    const metrics = calculateMetrics(income, expenses, savings, debt);
    const riskData = calculateRiskScore(metrics);
  
    const analysis = await generateAnalysis(riskData, goal, income);
    res.status(200).json({
      ...metrics,
      ...riskData,
      analysis,
    });
  } catch (error) {
    console.error('Controller error', error.message)
    res.status(500).json({error: 'Something went wrong. Please try again.'})
  }
};

module.exports = { analyzeFinancials }

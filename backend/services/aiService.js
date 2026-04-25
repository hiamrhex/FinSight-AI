const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModek({ model: "gemini-1.5-flash" });

const generateAnalysis = async (metrics, goal, income) => {
 try {
     const prompt = `
       You are a ruthless but caring financial advisor for Nigerians.
       A user has submitted their financial data. Analyze it and give them honest, specific, actionable advice.
   
       USER FINANCIAL PROFILE:
       - Monthly Income: ₦${income}
       - Financial Goal: ${goal}
   
       CALCULATED METRICS:
       - Savings Rate: ${metrics.savingsRate}%
       - Expense Ratio: ${metrics.expenseRatio}%
       - Debt Ratio: ${metrics.debtRatio}%
       - Runway: ${metrics.runway} months
       - Risk Score: ${metrics.riskScore}/100 (${metrics.riskLevel} Risk)
       - Bank Verdict: ${metrics.bankVerdict}
       - Runway Verdict: ${metrics.runwayVerdict}
   
       Provide:
       1. A brutal honest summary of their financial situation in Nigerian context (mention naira inflation, purchasing power)
       2. Their top 3 specific financial risks right now
       3. Three concrete actionable steps they can take this month
       4. What their money could look like in 5 years if they change now vs if they don't
   
       Keep it direct, specific to their numbers, and avoid generic advice.
       `;
   
     const result = await model.generateContent(prompt);
     const response = result.response.text();
     return response;
   
 } catch (error) {
    console.error('Gemini API error:', error.message)
    return `AI analysis is temporary unavailable. Your risk score is ${metrics.riskScore}/100 (${metrics.riskLevel} Risk). Please review your metrics above and take action based on your bank verdict and runway status.`
 }
};
module.exports = {generateAnalysis}
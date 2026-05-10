const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateAnalysis = async (metrics, goal, income) => {
  try {
    const debtNote = metrics.debtRatio === 0 ? 'They have zero debt which is great.' : `Their debt is ${metrics.debtRatio}% of their monthly income.`;
    const prompt = `
You are a brutally honest Nigerian financial advisor. Speak like a smart Nigerian friend. No big grammar. No jargon. No section headers or labels.

USER NUMBERS:
- Monthly Income: ₦${income}
- Goal: ${goal}
- They save ${metrics.savingsRate}% of their income
- They spend ${metrics.expenseRatio}% of their income
- ${debtNote}
- If they lose income today, their money lasts ${metrics.runway} months
- Risk Score: ${metrics.riskScore}/100 — ${metrics.riskLevel} Risk

Write one short paragraph of maximum 80 words. Plain everyday English. No bullet points. No headers.

Tell them: how their money situation looks right now, the one thing that can finish them if they ignore it, and two specific actions using their actual naira amounts. Mention real Nigerian platforms like PiggyVest, Cowrywise, or Risevest where relevant. Be direct and caring like a friend.
`;

    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error.message);
    return `AI analysis temporarily unavailable. Your risk score is ${metrics.riskScore}/100 (${metrics.riskLevel} Risk). Please review your metrics above and take action based on your bank verdict and runway status.`;
  }
};

module.exports = { generateAnalysis };

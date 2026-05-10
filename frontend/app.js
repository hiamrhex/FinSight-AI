const currentPage = window.location.pathname;

if (currentPage.includes("index") || currentPage.endsWith("/")) {
  const btn = document.getElementById("analyzeBtn");
  const errorMsg = document.getElementById("error-msg");

  btn.addEventListener("click", async () => {
    const income = document.getElementById("income").value;
    const expenses = document.getElementById("expenses").value;
    const savings = document.getElementById("savings").value;
    const debt = document.getElementById("debt").value;
    const goal = document.getElementById("goal").value;

    if (!income || !expenses || !savings || !debt || !goal) {
      errorMsg.textContent = "Please fill in all fields.";
      return;
    }

    btn.disabled = true;
    btn.querySelector(".btn-text").textContent = "Analyzing...";
    errorMsg.textContent = "";

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          income: Number(income),
          expenses: Number(expenses),
          savings: Number(savings),
          debt: Number(debt),
          goal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.error || "Something went wrong.";
        btn.disabled = false;
        btn.querySelector(".btn-text").textContent = "Analyze My Finances";
        return;
      }

      localStorage.setItem("finsightResults", JSON.stringify(data));
      window.location.href = "results.html";
    } catch (error) {
      errorMsg.textContent = "Could not connect to server. Make sure it is running.";
      btn.disabled = false;
      btn.querySelector(".btn-text").textContent = "Analyze My Finances";
    }
  });
}

if (currentPage.includes("results")) {
  const data = JSON.parse(localStorage.getItem("finsightResults"));

  if (!data) {
    window.location.href = "index.html";
  } else {
    document.getElementById("loading").style.display = "none";
    document.getElementById("results").style.display = "block";

    // Risk banner
    const banner = document.getElementById("risk-banner");
    banner.className = `score-banner ${data.riskLevel.toLowerCase()}`;

    document.getElementById("risk-score").textContent = `${data.riskScore}/100`;
    document.getElementById("risk-label").textContent = `${data.riskLevel} Risk`;
    document.getElementById("ring-num").textContent = data.riskScore;

    // Animate ring
    const ringFill = document.getElementById("ring-fill");
    const circumference = 314;
    const offset = circumference - (data.riskScore / 100) * circumference;
    setTimeout(() => {
      ringFill.style.strokeDashoffset = offset;
    }, 300);

    // Metrics with color
    const savingsEl = document.getElementById("savings-rate");
    savingsEl.textContent = `${data.savingsRate}%`;
    savingsEl.style.color = data.savingsRate >= 20 ? "#00E5B0" : data.savingsRate >= 10 ? "#FFB830" : "#FF4757";

    const expenseEl = document.getElementById("expense-ratio");
    expenseEl.textContent = `${data.expenseRatio}%`;
    expenseEl.style.color = data.expenseRatio <= 50 ? "#00E5B0" : data.expenseRatio <= 70 ? "#FFB830" : "#FF4757";

    const debtEl = document.getElementById("debt-ratio");
    debtEl.textContent = `${data.debtRatio}%`;
    debtEl.style.color = data.debtRatio === 0 ? "#00E5B0" : data.debtRatio <= 35 ? "#FFB830" : "#FF4757";

    const runwayEl = document.getElementById("runway");
    runwayEl.textContent = `${data.runway} mo`;
    runwayEl.style.color = data.runway >= 6 ? "#00E5B0" : data.runway >= 3 ? "#FFB830" : "#FF4757";

    // Verdicts
    document.getElementById("bank-verdict").textContent = data.bankVerdict;
    document.getElementById("runway-verdict").textContent = data.runwayVerdict;

    // Wealth projector
    document.getElementById("do-nothing-value-display").textContent = `₦${Number(data.doNothingValue).toLocaleString()}`;
    document.getElementById("wealth-year1").textContent = `₦${Number(data.wealthProjection.year1).toLocaleString()}`;
    document.getElementById("wealth-year3").textContent = `₦${Number(data.wealthProjection.year3).toLocaleString()}`;
    document.getElementById("wealth-year5").textContent = `₦${Number(data.wealthProjection.year5).toLocaleString()}`;

    // AI analysis
    document.getElementById("analysis").textContent = data.analysis;
  }
}
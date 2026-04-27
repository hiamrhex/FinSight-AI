const currentPage = window.location.pathname;

if (currentPage.includes('index') || currentPage.endsWith('/')) {
  const btn = document.getElementById('analyzeBtn');
  const errorMsg = document.getElementById('error-msg');

  btn.addEventListener('click', async () => {
    const income = document.getElementById('income').value;
    const expenses = document.getElementById('expenses').value;
    const savings = document.getElementById('savings').value;
    const debt = document.getElementById('debt').value;
    const goal = document.getElementById('goal').value;

    if (!income || !expenses || !savings || !debt || !goal) {
      errorMsg.textContent = 'Please fill in all fields.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Analyzing...';
    errorMsg.textContent = '';

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        errorMsg.textContent = data.error || 'Something went wrong.';
        btn.disabled = false;
        btn.textContent = 'Analyze My Finances';
        return;
      }

      localStorage.setItem('finsightResults', JSON.stringify(data));
      window.location.href = 'results.html';

    } catch (error) {
      errorMsg.textContent = 'Could not connect to server. Make sure it is running.';
      btn.disabled = false;
      btn.textContent = 'Analyze My Finances';
    }
  });
}

if (currentPage.includes('results')) {
  const data = JSON.parse(localStorage.getItem('finsightResults'));

  if (!data) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const banner = document.getElementById('risk-banner');
    banner.className = `risk-banner ${data.riskLevel.toLowerCase()}`;

    document.getElementById('risk-score').textContent = `${data.riskScore}/100`;
    document.getElementById('risk-label').textContent = `${data.riskLevel} Risk`;
    document.getElementById('savings-rate').textContent = `${data.savingsRate}%`;
    document.getElementById('expense-ratio').textContent = `${data.expenseRatio}%`;
    document.getElementById('debt-ratio').textContent = `${data.debtRatio}%`;
    document.getElementById('runway').textContent = `${data.runway} mo`;
    document.getElementById('bank-verdict').textContent = data.bankVerdict;
    document.getElementById('runway-verdict').textContent = data.runwayVerdict;
    document.getElementById('analysis').textContent = data.analysis;
  }
}
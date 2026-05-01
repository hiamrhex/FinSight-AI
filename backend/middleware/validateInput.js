const validateInput = (req, res, next) => {
  const { income, expenses, savings, debt, goal } = req.body;

  if (
    income === undefined || income === null || income === '' ||
    expenses === undefined || expenses === null || expenses === '' ||
    savings === undefined || savings === null || savings === '' ||
    debt === undefined || debt === null || debt === '' ||
    !goal
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(income) || isNaN(expenses) || isNaN(savings) || isNaN(debt)) {
    return res.status(400).json({ error: 'income, expenses, savings and debt must be numbers' });
  }

  if (Number(income) <= 0) {
    return res.status(400).json({ error: 'income must be greater than zero' });
  }

  if (Number(expenses) < 0 || Number(savings) < 0 || Number(debt) < 0){
    return res.status(400).json({ error: 'Values cannot be negative'})
  }

  const validGoals = ['short-term', 'long-term', 'emergency'];
  if (!validGoals.includes(goal)) {
    return res.status(400).json({ error: 'goal must be short-term, long-term or emergency' });
  }

  next();
};

module.exports = { validateInput };
const express = require('express');
const router = express.Router();

const { analyzeFinancials } = require('../controllers/analyzeController');
const { validateInput } = require('../middleware/validateInput');

router.post('/analyze', validateInput, analyzeFinancials);

module.exports = router;
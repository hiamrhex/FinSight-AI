const express = require('express');
const cors = require('cors');
const path = require('path');

const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', analyzeRoutes);

module.exports = app;
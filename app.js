const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/transactions', transactionRoutes);

module.exports = app;

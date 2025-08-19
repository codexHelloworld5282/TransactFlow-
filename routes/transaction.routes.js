const express = require('express');
const router = express.Router();
const { processNextChunk } = require('../controllers/transaction.controller');

// POST endpoint to process next 50 records
router.post('/process-chunk', processNextChunk);

module.exports = router;

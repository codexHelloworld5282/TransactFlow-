const Transaction = require('../models/transaction.model');

const saveTransactions = async (transactions) => {
    try {
        return await Transaction.insertMany(transactions, { ordered: false }); // continue even if duplicates
    } catch (err) {
        console.error('Error saving transactions:', err);
        throw err;
    }
};

module.exports = { saveTransactions };

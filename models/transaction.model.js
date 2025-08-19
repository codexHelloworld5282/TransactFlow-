const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    st_brand_id: { type: Number, unique: true },
    brand_name: { type: String, required: true },
    product_name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

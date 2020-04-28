var mongoose = require("mongoose");

var transactionsSchema = new mongoose.Schema({
    id: String,
    userId: String,
    isComplete: Boolean,
    bookId: [String]
});

var Transactions = mongoose.model('transactions', transactionsSchema, 'transactions');
module.exports = Transactions;
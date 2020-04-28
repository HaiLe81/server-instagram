var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    id: String,
    cart: [{ bookId: String, count: Number }]
});

var Sessions = mongoose.model('sessions', sessionSchema, 'sessions');
module.exports = Sessions;
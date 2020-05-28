var mongoose = require("mongoose");

var accSchema = new mongoose.Schema({
    id: String,
    username: String,
    fullname: String,
    email: String,
    password: String,
    logged_in: Boolean,
    urlAvatar: String,
    follower: [String],
    followMember: [String]
});

var Account = mongoose.model('accounts', accSchema, 'accounts');

module.exports = Account;
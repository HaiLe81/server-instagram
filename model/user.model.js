var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    wrongLoginCount: Number,
    avatarUrl: String,
});

var User = mongoose.model('listUsers', userSchema, 'listUsers');
module.exports = User;
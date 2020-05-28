var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String
});

var usersShare = mongoose.model('usersShare', userSchema, 'usersShare');
module.exports = usersShare;
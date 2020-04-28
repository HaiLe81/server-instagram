var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    coverUrl: String
});

var User = mongoose.model('listBooks', bookSchema, 'listBooks');
module.exports = User;
var mongoose = require("mongoose");

var postsSchema = new mongoose.Schema({
    id: String,
    title: String,
    content: String,
    dateCreate: String,
    url: String,
});

var Posts = mongoose.model('posts', postsSchema, 'posts');
module.exports = Posts;
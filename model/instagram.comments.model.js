var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    userId: String,
    postId: String,
    content: String
},{timestamps: true});

var Comment = mongoose.model('comments', commentSchema, 'comments');

module.exports = Comment;
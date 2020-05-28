var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    userId: String,
    postId: String,
    caption: String,
    imageUrls: [ String ],
    usersLiked: [ { userId: String } ]
},{timestamps: true});

var PostsInstagram = mongoose.model('postsInstagram', postSchema, 'postsInstagram');

// postSchema.methods.getUserById = function(idUserComment){
//   const user = Accounts.findOne({ id: idUserComment })
//   return user.username;
// }

module.exports = PostsInstagram;
var cloudinary = require("cloudinary").v2;
const shortid = require("shortid");
const Account = require("../../model/instagram.accounts.model");
const Post = require("../../model/instagram.posts.model");
const Comment = require("../../model/instagram.comments.model");
const Noti = require("../../model/instagram.notifications.model");

const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  getPost: async (req,res) => {
    try{
      const { id } = req.params;
      const user = await Account.findOne({ id })
      // get followers
      const followers = user.follower;
      // get posts
      await followers.map((item, index) => {
         const result = Post.find({ userId: item })
        .then(doc => {
          return res.status(200).json({ message: "get posts success", posts: doc })
        })
         .catch(err => console.log(err))
      })
      // const posts = await Post.find({ postId:  })
    } catch({ message = "Invalid request" }){
        res.status(400).json({ message })
    }
  },
  getComments: async (req, res) => {
    try{
      const { postId } = req.params;
      const comment = await Comment.find({ postId })
      return res.status(200).json({ message: "get comments success", comments: comment })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  }, 
  postLike: async (req, res) => {
    const { userId, postId, authorId } = req.body;
    try {
      const post = await Post.findOne({ postId: postId })
      // check post liked or not found
      if(!post) {
        throw new Error('Post not found or user liked')
      } 
      const index = post.usersLiked.findIndex(x => x.userId === userId)
      // check user liked
      if(index !== -1) throw new Error('user liked')
      await post.usersLiked.push({ userId: userId })
      await post.save();
      // add notification for post author
      const notification = new Noti({
        toUserId: authorId,
        byUser: userId,
        byPostId: postId,
        action: 'like'
      })
      await notification.save();
      return res.status(200).send({ post})
    } catch({ message }){
      res.status(400).json({ message })
    }
  },
  postComment: async (req, res) => {
    const { postId, authorId, userId, content } = req.body
    try{
      const comment = new Comment({
        userId: userId,
        postId: postId,
        content: content
      })
      await comment.save();
      // add notification for post author
      const noti = new Noti({
        toUserId: authorId,
        byUser: userId,
        byPostId: postId,
        action: "comment"
      })
      await noti.save();
      await Comment.find().then(doc => {
        return res.status(200).json({ message: "Add comment success", comments: doc })
      })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  },
  addPost: async (req, res) => {
    const { userId, caption, imageUrl } = req.body;
    const id = shortid.generate();
    try{
      const listImage = [];
      listImage.push(imageUrl);
      const post = new Post({
        postId: id,
        userId: userId,
        caption: caption,
        imageUrls: listImage,
        usersLiked: []
      })
      await post.save();
      return res.status(200).json({ message: "add post success", post })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  },
  getPostInstagtam: async (req, res) => {
    try{
      await Post.find()
    .then(doc =>  res.status(200).json({ message: "get posts success", posts: doc }))
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  }
};

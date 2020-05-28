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
  postLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      if(!username || !password ) {
        throw new Error("username or passwrod is required!");
      }
      const user = await Account.findOne({ username })
      console.log('user', user)
      if (!user) {
        throw new Error("username incorrect!");
      } 
      if(user.password !== password){
        throw new Error("password incorrect!")
      } else {
        user.logged_in = true;
        user.save();
        res.status(200).json({
          message: "You have successfully logged in",
          user: user
        });
      }
      
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  SignUp: async (req, res) => {
    const id = shortid.generate();
    const { username, fullname, email, password } = req.body;
    try {
      if(!username || !fullname || !email || !password){
        throw new Error("please check again")
      }
      const user = await Account.findOne({ email })
      if(user){
        throw new Error("The email already exist. Please use a different email")
      }
      const newAcc = new Account({
        id: id,
        username: username,
        fullname: fullname,
        email: email,
        password: password,
        logged_in: false
      })
      newAcc.save();
      res.status(200).json({ message: "Signup successfully" })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  },
  forgetPassword: async (req, res) => {
    const randomPassword = shortid.generate();
    const { email } = req.body;
    try{
      const user = await Account.findOneAndUpdate({ email }, { password: randomPassword }, {new: true})
      user.password = randomPassword;
      user.save()
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: 'nguyenvy3681@gmail.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: "Reset Password",
        html: `<strong>this is a new password for your account</strong>: ${randomPassword}`,
      };
      sgMail.send(msg);
      res.status(200).json({ message: "ResetPassword Success" })
    } catch({ message = "Invalid request" }){
      res.status(400).json({ message })
    }
  },
  uploadImage: async (req, res) => {
    const { url } = req.body;
    try{
      if(!url) throw new Error('invalid avatarUrl');
      const { id } = req.params;
      const user = await Account.findOne({ id })
      if(!user) throw new Error('Not Found')
      user.urlAvatar = url;
      user.save();
      res.status(200).json({ message: "Change Avatar Success" })
      } catch({ message = "Invalid request" }){
              res.status(400).json({ message })
      }
  },
  getUserById: async (req, res, next) => {
    try{
    const {id} = req.params
		if(!id) throw new Error('invalid id');
		const user = await Account.findById(id, {password: 0, createdAt: 0, updatedAt: 0, __v: 0})
		if(!user) throw new Error('user not found', res.status(404))
		return res.status(200).send({user})
    } catch(err){
      next(err)
    }
  },
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
  getAccounts: async (req,res) => {
    try{
      const acc = await Account.find()
      return res.status(200).json({ message: "get posts success", accounts: acc })
      // const posts = await Post.find({ postId:  })
    } catch({ message = "Invalid request" }){
        res.status(400).json({ message })
    }
  }, 
  getComments: async (req, res) => {
    try{
      const { postId } = req.params;
      console.log('postId', postId)
      const comment = await Comment.find({ postId })
      console.log('comments', comment)
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
  getNotification: async (req, res) => {
    const { id } = req.params;
    try{
      const noti = Noti.find({ toUserId: id })
      if(!noti) throw new Error('notification not found')
      noti.then(doc => {
        console.log('doc', doc)
        if(!doc.length){
          return res.status(404).json({ message: "not found" })
        } else {
          return res.status(200).json({ message: "get notification success", noti: doc })
        }
      })
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

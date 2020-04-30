var cloudinary = require("cloudinary").v2;
// const md5 = require("md5");
const shortid = require("shortid");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../../model/user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  index: async (req, res) => {
    try {
      let page = parseInt(req.query.page) || 1;
      let perPage = 3;

      let start = (page - 1) * perPage;
      let end = page * perPage;

      // let dataBooks = db.get("listBooks").value();

      await User.find().then(doc => {
        let pageSize = Math.ceil(doc.length / 3);

        let paginationSizes = pageSize >= 3 ? 3 : pageSize;

        let pageCurrent = parseInt(req.query.page);
        return res.status(200).json({
          listUser: doc.slice(start, end),
          fullUser: doc,
          paginationSize: paginationSizes,
          pageSize: pageSize,
          page_Current: pageCurrent
        });
        return res.status(200).json({
          listUser: doc.slice(start, end),
          fullUser: doc,
          paginationSize: paginationSizes,
          pageSize: pageSize,
          page_Current: pageCurrent
        });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).send({ message });
    }
  },
  search: async (req, res) => {
    try {
      var valueSearch = "";
      var q = req.query.q;
      valueSearch = q;
      await User.find().then(doc => {
        const matchedTodos = doc.filter(item => {
          return item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        return res.status(200).json({
          listUser: matchedTodos,
          value: valueSearch
        });
        // res.render("./users/user.pug", {
        //   listUser: matchedTodos,
        //   value: valueSearch
        // });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  view: async (req, res) => {
    try {
      const { id } = req.params;

      await User.findOne({ id: id }).then(doc => {
        return res.status(200).json({ user: doc });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const { name, email, password } = req.body;
      const isExisted = await User.exists({ email });
      // check null username
      if (!name) {
        throw "User is required";
      }
      // check length username
      if (name.length > 30 || name.length < 2) {
        throw new Error("Greater than 2 characters and less than 30 chracters, Try again");
      }
      //check email null
      if (!email) {
        throw new Error("Emal is required");
      }

      // check exist email
      if (isExisted) {
        throw new Error("The email already exist. Please use a different email");
      }

      //check password null
      if (!password) {
        throw new Error("Password is required");
      }
      // const userInput = req.body.name;
      await bcrypt.hash(req.body.password, saltRounds, async function(
        err,
        hash
      ) {
        const newUser = new User({
          id: id,
          name: req.body.name,
          email: req.body.email,
          isAdmin: false,
          avatarUrl: 'https://i.ya-webdesign.com/images/default-avatar-png-18.png',
          password: hash,
          wrongLoginCount: 0
        });
        await newUser.save();
        return res.status(200).json({ newUser });
      });
      // res.redirect("/users/");
    } catch ({ message = "Invalid request!" }) {
      return res.status(400).json({ message });
    }
  },
  delete: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id) throw new Error("not found");
      const user = await User.deleteOne({ id: id });
      return res.status(200).json({ user, message: "Delete successfully" });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  editPost: async (req, res) => {
    var errors = [];
    var { id } = req.params;
    var { name } = req.body;
    try {
      // let id = parseInt(req.params.id);
      const user = await User.findOne({ id: id });
      if (!user) {
        throw new Error("opps! Please try again");
      }
      if (user.name === name) {
        throw new Error("name already exists, please try another name");
      }
      user.name = name;
      await user.save();
      return res.status(200).json({ user });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  profile: async (req, res) => {
    try {
      const id = req.params.id;
      await User.find({ id: id }).then(doc => {
        console.log('doc', doc[0])
        return res.status(200).json({ user: doc[0] });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  },
  postProfile: async (req, res) => {
    req.user = {};
    try {
      const id = req.params.id;
      const { name, email, password } = req.body;
      const user = await User.findOne({ id: id });

      if (!user) {
        throw new Error("oops! Please try again");
      }
      if (!name) {
        throw new Error("Name is required!");
      }
      if (!email) {
        throw new Error("Email is required!");
      }
      // const file = req.file.path;
      var path;
      !req.file
        ? (path = "https://i.ya-webdesign.com/images/default-avatar-png-18.png")
        : (path = await cloudinary.uploader
            .upload(req.file.path)
            .then(result => result.url)
            .catch(error => console.log("erro:::>", error)));
      console.log('path', path)
      await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        user.name = name;
        user.email = email;
        user.password = hash;
        user.avatarUrl = path;
        user.isAdmin = false
        user.save();
        return res.status(200).json({ user });
      });
    } catch ({ message = "Invalid request" }) {
      return res.status(400).json({ message });
    }
  }
};

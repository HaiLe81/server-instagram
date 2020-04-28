var cloudinary = require("cloudinary").v2;
// const md5 = require("md5");
const shortid = require("shortid");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var User = require("../model/user.model");

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
        res.render("./users/user.pug", {
          listUser: doc.slice(start, end),
          fullUser: doc,
          paginationSize: paginationSizes,
          pageSize: pageSize,
          page_Current: pageCurrent
        });
      });
    } catch (err) {
      console.log(err);
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
        res.render("./users/user.pug", {
          listUser: matchedTodos,
          value: valueSearch
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  view: async (req, res) => {
    try {
      const id = req.params.id;

      await User.findOne({ id: id }).then(doc => {
        res.render("./users/viewUser.pug", {
          user: doc
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  create: (req, res) => {
    try {
      res.render("./users/createUser.pug");
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      const id = shortid.generate();
      const userInput = req.body.name;
      await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
          id: id,
          name: req.body.name,
          email: req.body.email,
          password: hash
        });
        newUser.save();
      });
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  delete: async (req, res) => {
    try {
      let id = req.params.id;
      if (!id) throw new Error("not found");
      await User.deleteOne({ id: id });
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) return res.send("Invalid id");

      const userItem = await User.find({ id: id });
      res.render("./users/editUser.pug", {
        user: userItem[0],
        id: id
      });
    } catch (err) {
      console.log(err);
    }
  },
  editPost: async (req, res) => {
    var errors = [];
    var id = req.params.id;
    var name = req.body.name;
    name.trim();
    try {
      // let id = parseInt(req.params.id);
      const user = await User.findOne({ id: id });
      console.log("user", user);
      if (!user) {
        errors.push("opps! Please try again");
      }
      if (user.name === name) {
        errors.push("name already exists, please try another name");
      }

      if (errors.length > 0) {
        const userItem = await User.find({ id: id });
        res.render("./users/editUser.pug", {
          user: userItem[0],
          id: id,
          errors: errors
        });
      } else {
        user.name = name;
        await user.save();
        res.redirect("/users/");
      }
    } catch (err) {
      console.log(err);
    }
  },
  profile: async (req, res) => {
    try {
      const id = req.signedCookies.userId;
      await User.find({ id: id }).then(doc => {
        res.render("./users/profile.pug", {
          user: doc[0]
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  postProfile: async (req, res) => {
    var errors = [];
    try {
      const id = req.signedCookies.userId;
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({ id: id });

      if (!user) {
        errors.push("oops! Please try again");
      }
      if (!name) {
        errors.push("Name is required!");
      }
      if (!email) {
        errors.push("Email is required!");
      }
      if (errors.length > 0) {
        await User.find({ id: id }).then(doc => {
          console.log("doc", doc[0]);
          res.render("./users/profile.pug", {
            user: doc[0],
            errors: errors
          });
        });
      } else {
        // const file = req.file.path;
        var path;
        !req.file
          ? (path =
              "https://i.ya-webdesign.com/images/default-avatar-png-18.png")
          : (path = await cloudinary.uploader
              .upload(req.file.path)
              .then(result => result.url)
              .catch(error => console.log("erro:::>", error)));
        
        await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          user.name = name;
          user.email = email;
          user.password = hash;
          user.avatarUrl = path;
          user.save();
        });
        if(req.file){
          fs.unlinkSync(req.file.path);
        }
        res.redirect("/users/");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

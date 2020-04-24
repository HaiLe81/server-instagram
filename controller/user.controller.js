var cloudinary = require("cloudinary").v2;
// const md5 = require("md5");
const db = require("../db");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const saltRounds = 10;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  index: (req, res) => {
    try {
      res.render("./users/user.pug", {
        listUser: db.get("listUser").value()
      });
    } catch (err) {
      console.log(err);
    }
  },
  search: (req, res) => {
    try {
      var valueSearch = "";
      var q = req.query.q;
      valueSearch = q;
      var matchedTodos = db
        .get("listUser")
        .value()
        .filter(item => {
          return item.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
      res.render("./users/user.pug", {
        listUser: matchedTodos,
        value: valueSearch
      });
    } catch (err) {
      console.log(err);
    }
  },
  view: (req, res) => {
    try {
      const id = req.params.id;
      const user = db
        .get("listUser")
        .find({ id: id })
        .value();
      res.render("./users/viewUser.pug", {
        user: user
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
  createPost: (req, res) => {
    try {
      const id = shortid.generate();
      const userInput = req.body.name;
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        db.get("listUser")
          .push({
            id: id,
            name: req.body.name,
            email: req.body.email,
            password: hash
          })
          .write();
      });
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  delete: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      let id = req.params.id;
      db.get("listUser")
        .remove({ id: id })
        .write();
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  edit: (req, res) => {
    try {
      const id = req.params.id;
      const user = db
        .get("listUser")
        .find({ id: id })
        .value();
      console.log("user", user);
      res.render("./users/editUser.pug", {
        user: user,
        id: id
      });
    } catch (err) {
      console.log(err);
    }
  },
  editPost: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      console.log("body1", req.body);

      let id = req.params.id;
      db.get("listUser")
        .find({ id: id })
        .assign({ name: req.body.name })
        .write();
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  profile: (req, res) => {
    try {
      const id = req.signedCookies.userId;
      const user = db
        .get("listUser")
        .find({ id: id })
        .value();
      res.render("./users/profile.pug", {
        user: user
      });
    } catch (err) {
      console.log(err);
    }
  },
  postProfile: async (req, res) => {
    try {
      const id = req.signedCookies.userId;
      const file = req.file.path;
      const path = await cloudinary.uploader
        .upload(file)
        .then(result => result.url)
        .catch(error => console.log("erro:::>", error));
      db.get("listUser")
        .find({ id: id })
        .assign({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatarUrl: path
        })
        .write();
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  }
};

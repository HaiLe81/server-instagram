const db = require("../db");
const shortid = require("shortid");

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
      console.log("user", user);
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
        
      db.get("listUser")
        .push({
          id: id,
          name: req.body.name
        })
        .write();
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  },
  delete: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      let id = req.params.id;
      console.log("id", id);
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
      console.log("body", req.body);
    } catch (err) {
      console.log(err);
    }
  },
  editPost: (req, res) => {
    try {
      // let id = parseInt(req.params.id);
      console.log("body1", req.body);

      let id = req.params.id;
      console.log("id:", id);
      db.get("listUser")
        .find({ id: id })
        .assign({ name: req.body.name })
        .write();
      res.redirect("/users/");
    } catch (err) {
      console.log(err);
    }
  }
};

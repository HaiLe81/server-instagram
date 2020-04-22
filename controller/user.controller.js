const db = require("../db");
const shortid = require("shortid");

module.exports = {
  index: (request, response) => {
    response.render("./users/user.pug", {
      listUser: db.get("listUser").value()
    });
  },
  search: (req, res) => {
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
  },
  view: (req, res) => {
    const id = req.params.id;
    const user = db
      .get("listUser")
      .find({ id: id })
      .value();
    console.log("user", user);
    res.render("./users/viewUser.pug", {
      user: user
    });
  },
  create: (request, response) => {
    response.render("./users/createUser.pug");
  },
  createPost: (req, res) => {
    const id = shortid.generate();
    // console.log('body', req.body)
    db.get("listUser")
      .push({
        id: id,
        name: req.body.name
      })
      .write();
    res.redirect("/users/");
  },
  delete: (req, res) => {
    // let id = parseInt(req.params.id);
    let id = req.params.id;
    console.log("id", id);
    db.get("listUser")
      .remove({ id: id })
      .write();
    res.redirect("/users/");
  },
  edit: (req, res) => {
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
  },
  editPost: (req, res) => {
    // let id = parseInt(req.params.id);
    console.log("body1", req.body);

    let id = req.params.id;
    console.log("id:", id);
    db.get("listUser")
      .find({ id: id })
      .assign({ name: req.body.name })
      .write();
    res.redirect("/users/");
  }
};

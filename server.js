// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const shortid = require('shortid');

// Set some defaults (required if your JSON file is empty)
db.defaults({ listBooks: [] })
  .write()

const show_DB = db.get('listBooks').value()

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static("public"));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.render("index.pug");
});

app.get("/books", (request, response) => {
  response.render("books.pug", {
    listBook: db.get('listBooks').value()
  });
});

app.get("/books/search", (req, res) => {
  var valueSearch = '';
  var q = req.query.q;
  valueSearch = q;
  var matchedTodos = db.get('listBooks').value().filter(item => {
    return item.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  })
  res.render('books.pug', {
    listBook: matchedTodos,
    value: valueSearch
  })
});

app.get('/books/view/:id', (req, res) => {
  const id = req.params.id
  const book = db.get('listBooks').find({ id: id }).value()
  console.log('book', book)
  res.render('view.pug', {
    book: book
  })
})

app.get("/books/create", (request, response) => {
  response.render('create.pug')
});

app.post("/books/create", (req, res) => {
  const id = shortid.generate()
  // console.log('body', req.body)
  db.get('listBooks').push({
    id: id,
    title: req.body.title,
    description: req.body.description
  }).write();
  res.redirect('/books')
});

app.get("/books/:id/delete", (req, res) => {
  // let id = parseInt(req.params.id);
    let id = req.params.id
  console.log('id', id)
  db.get('listBooks')
  .remove({ id: id })
  .write()
  res.redirect('/books')
})

app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id
  const book = db.get('listBooks').find({ id: id }).value()
  console.log('book', book)
  res.render('edit.pug', {
    book: book,
    id: id
  })
  console.log('body', req.body)
})

app.post("/books/edit/:id", (req, res) => {
  // let id = parseInt(req.params.id);
  console.log('body1', req.body)

  let id = req.params.id
  console.log('id:', id)
  db.get('listBooks')
  .find({ id: id })
  .assign({ title: req.body.title, description: req.body.description })
  .write()
  res.redirect('/books')
  console.log('bookEdit', show_DB)
})

db.get('posts')
  .remove({ title: 'low!' })
  .write()
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

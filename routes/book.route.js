var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid');

const bookController = require('../controller/book.controller')


router.get("/books", bookController.index);

router.get("/books/search", bookController.search);

router.get('/books/view/:id', bookController.view)

router.get("/books/create", bookController.create);

router.post("/books/create", bookController.createPost);

router.get("/books/:id/delete", bookController.delete)

router.get("/books/edit/:id", bookController.edit)

router.post("/books/edit/:id", bookController.editPost)

module.exports = router;
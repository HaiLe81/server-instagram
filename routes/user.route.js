var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid');

const userController = require('../controller/user.controller')


router.get("/", userController.index);

router.get("/search", userController.search);

router.get('/view/:id', userController.view)

router.get("/create", userController.create);

router.post("/create", userController.createPost);

router.get("/:id/delete", userController.delete)

router.get("/edit/:id", userController.edit)

router.post("/edit/:id", userController.editPost)

module.exports = router;
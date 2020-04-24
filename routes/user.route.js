var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid');

const userController = require('../controller/user.controller')
const validate = require('../validate/user.validate.js')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

router.get("/", userController.index);

router.get("/search", userController.search);

router.get('/view/:id', userController.view)

router.get("/create", userController.create);

router.post("/create", validate.postCreate ,userController.createPost);

router.get("/:id/delete", userController.delete)

router.get("/edit/:id", userController.edit)

router.post("/edit/:id",  userController.editPost)

router.get("/profile", userController.profile)

router.post("/profile", upload.single('avatar'), userController.postProfile)

module.exports = router;
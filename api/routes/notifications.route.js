var express = require("express");
var router = express.Router();
const notiController = require("../controller/notifications.controller.js");

router.get("/notification/:id", notiController.getNotification);

module.exports = router;

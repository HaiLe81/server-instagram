var express = require('express')
var router = express.Router()
const suggestionFollowController = require('../controller/suggestions.controller.js')

// get suggestions follow to user
router.get('/suggestions/:userId', suggestionFollowController.getfollowsuggestions)

module.exports = router; 
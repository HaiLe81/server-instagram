var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    id: String,
    userId: String,
    name: String,
    listBook: [ 
      { idBook: String, status: String }
    ],
    status: Boolean
});

var Shops = mongoose.model('shops', sessionSchema, 'shop');
module.exports = Shops;
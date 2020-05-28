var mongoose = require("mongoose");

var numberSchema = new mongoose.Schema({
    id: String,
    byUser: String,
    numberLucky: String
});

var numberShare = mongoose.model('numberLucky', numberSchema, 'numberLucky');
module.exports = numberShare;
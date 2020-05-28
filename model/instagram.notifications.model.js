var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
    toUserId: String,
    byUser: String,
    byPostId: String,
    action: {
      type:String,
      required: true,
      enum: ['like', 'comment']
    }
},{timestamps: true});

var Noti = mongoose.model('notifications', notificationSchema, 'notifications');

module.exports = Noti;
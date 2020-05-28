var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    byUser: String,
    description: String,
    coverUrl: String,
    subType: {
      type:String,
      required: true,
      enum: ['public', 'private']
    },
    type: {
      type: String,
      required: true,
      enum: ['Chính Trị', 'Giáo Trình', 'Tiểu Thuyết','Văn Học Nghệ Thuật', 'Lịch Sử', 'Chinh Thám']
    }
});

var booksShare = mongoose.model('booksShare', bookSchema, 'booksShare');
module.exports = booksShare;
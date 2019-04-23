const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShareSchema= new Schema({
  shareId: String,
  out: Date,
  infoId: String
});

module.exports = mongoose.model('share', ShareSchema);
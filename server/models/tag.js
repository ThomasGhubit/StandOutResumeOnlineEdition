const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema= new Schema({
  name: String,
  total: Number
});

module.exports = mongoose.model('tag', TagSchema);
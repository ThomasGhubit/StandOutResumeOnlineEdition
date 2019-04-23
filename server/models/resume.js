const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
  userId: String,
  infoId: String,
  template: String,
  path: String,
  updateDate: Date,
  publish: Boolean,
  share: String,
  tags: Array,
  sum: Number,
  num: Number
});

module.exports = mongoose.model('resume', ResumeSchema);
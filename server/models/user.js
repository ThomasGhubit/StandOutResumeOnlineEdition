const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema= new Schema({
  email: String,
  password: String,
  username: String,
  admin: Boolean
});

module.exports = mongoose.model('user', UserSchema);
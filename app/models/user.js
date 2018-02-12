const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    email:String,
    password: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  }
});
// Note. It is using hanhSync, genSaltSync and compareSync to hold the process.
// Callback versions are not used as we do not the process to be continued
// until the password has been generated or validated.
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
}
module.exports = mongoose.model('User',userSchema);

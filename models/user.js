var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('Movie', UserSchema);

module.exports = User;
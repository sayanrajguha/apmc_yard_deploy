var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id : String,
  name : String,
  address : String,
  contact : String,
  email : String,
  role : String,
  username : String,
  password : String
});
UserSchema.plugin(mongoosePaginate);
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if(err) callback(error,null);
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err) callback(error,null);
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}
module.exports.getUserByEmail = function(email, callback) {
  var query = {email : email};
  User.findOne(query,callback);
}
module.exports.getAllUsers = function(page,callback) {
  if(page && callback && page != -1) {
    User.paginate({}, { sort : {_id : -1}, page: page, limit: config.userPageLimit }, function(err, result) {
      // result.docs
      // result.total
      // result.limit - 10
      // result.page - 3
      // result.pages
      if(err) {
        callback(err,undefined);
      } else {
        callback(undefined,result);
      }
    });
  } else if(page && callback && page == -1) {
      User.find({}, function(err, result) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages
        if(err) {
          callback(err,undefined);
        } else {
          callback(undefined,result);
        }
      });
  }
}
module.exports.getUserByUsername = function(username, callback) {
  var query = {username : username};
  User.findOne(query,callback);
}

module.exports.getUserById = function(id, callback) {
  // var query = {_id : username};
  User.findById(id,callback);
}
module.exports.comparePassword = function(userPassword, hash, callback) {
  bcrypt.compare(userPassword, hash, function(err, isMatch) {
    if(err) callback(err,false);
    callback(null,isMatch);
  })
}

module.exports.updateUser = function(id,newUser,callback) {
  User.findOneAndUpdate({_id : id}, newUser, function(err,user) {
    if(err) {
      return callback(err,null);
    } else if(!user) {
      return callback(null,false);
    }
    console.log('user with username : ' + user.username + ' found and updated');
    return callback(null,true);
  });
}

module.exports.deleteUser = function(username,callback) {
  User.remove({ username: username },callback);
}

module.exports.removeUserById = function(id,callback) {
  User.remove({ _id : id },callback);
}

module.exports.changePassword = function(username, newPassword, callback) {
  User.getUserByUsername(username, function(err,user) {
    if(err) throw err;
    if(!user) {
      callback(null,false);
    }
    console.log('user with username : ' + username + ' found');
    bcrypt.genSalt(10, function(err, salt) {
      if(err) callback(error,null);
      bcrypt.hash(newPassword, salt, function(err, hash) {
        if(err) callback(error,null);
        user.password = hash;
        user.save(callback);
      });
    });
  });
}

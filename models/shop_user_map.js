var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ShopUserSchema = new Schema({
  shop_id : String,
  user_id : String
});

var ShopUser = module.exports = mongoose.model('ShopUser',ShopUserSchema);

module.exports.createShopUserMap = function(newShopUserMap, callback) {
  newShopUserMap.save(callback);
}

module.exports.updateShopUserMap = function(id,newShopUserMap,callback) {
  Shop.findOneAndUpdate({shop_id : id}, newShopUserMap, function(err,shopUserMap) {
    if(err) {
      return callback(err,null);
    } else if(!shopUserMap) {
      return callback(null,false);
    }
    console.log('found and updated');
    return callback(null,true);
  });
}

module.exports.deleteShopUserMap = function(id,callback) {
  ShopUser.remove({ shop_id: id },callback);
}

module.exports.getShopUserMap = function(id,callback) {
  ShopUser.find({ shop_id : id },callback);
}

module.exports.getShopByUser = function(user_id,callback) {
  ShopUser.findOne({ user_id  : user_id },callback);
}

module.exports.getUserShopMatch = function(userId,shopId,callback) {
  ShopUser.findOne({ user_id: userId, shop_id : shopId },function(err,user) {
    if(err || !user) {
      callback(err,false);
    } else {
      callback(null,true);
    }
  });
}

module.exports.getAllShopUserMaps = function(callback) {
  ShopUser.find({},callback);
}

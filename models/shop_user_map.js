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
  Shop.findOneAndUpdate({_id : id}, function(err,shopUserMap) {
    if(err) throw err;
    if(!shopUserMap) {
      callback(null,false);
    }
    console.log('found and updated');
    callback(null,true);
    // shopUserMap.shop_id = newShopUserMap.shop_id;
    // shopUserMap.user_id = newShopUserMap.user_id;
    //
    // shopUserMap.save(callback);
  });
}

module.exports.deleteShopUserMap = function(id,callback) {
  ShopUser.remove({ _id: id },callback);
}

module.exports.getShopUserMap = function(id,callback) {
  ShopUser.findOne({ _id: id },callback);
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

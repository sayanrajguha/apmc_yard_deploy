var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ShopSchema = new Schema({
  name : String,
  address : String,
  owner_id : String,
  representative_ids : Array,
  contact : String
});
ShopSchema.plugin(mongoosePaginate);
var Shop = module.exports = mongoose.model('Shop',ShopSchema);

module.exports.createShop = function(newShop, callback) {
  newShop.save(callback);
}

module.exports.updateShop = function(id,newShop,callback) {
  Shop.findOneAndUpdate({_id : id}, newShop, function(err,shop) {
    if(err) {
      return callback(err,null);
    } else if(!shop) {
      return callback(null,false);
    }
    console.log('shop with shop name : ' + shop.name + ' found and updated');
    return callback(null,true);
  });
}

module.exports.deleteShop = function(id,callback) {
  Shop.remove({ _id: id },callback);
}

module.exports.getShop = function(id,callback) {
  Shop.findOne({ _id: id },callback);
}

module.exports.getAllShops = function(page,callback) {
  // Shop.find({},callback);
  Shop.paginate({}, { sort : {_id : -1}, page: page, limit: config.shopPageLimit }, function(err, result) {
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

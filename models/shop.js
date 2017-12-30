var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ShopSchema = new Schema({
  id : String,
  name : String,
  address : String,
  owner_id : String,
  representative_ids : Array,
  contact : String
});

var Shop = module.exports = mongoose.model('Shop',ShopSchema);

module.exports.createShop = function(newShop, callback) {
  newShop.save(callback);
}

module.exports.updateShop = function(id,newShop,callback) {
  Shop.findOneAndUpdate({_id : id}, function(err,shop) {
    if(err) throw err;
    if(!shop) {
      callback(null,false);
    }
    console.log('shop with shop name : ' + shop.name + ' found and updated');
    callback(null,true);
    // shop.name = newShop.name;
    // shop.address = newShop.address;
    // shop.owner_id = newUser.owner_id;
    // shop.rep_ids = newUser.rep_ids;
    // shop.contact = newUser.contact;
    //
    // shop.save(callback);
  });
}

module.exports.deleteShop = function(id,callback) {
  Shop.remove({ _id: id },callback);
}

module.exports.getShop = function(id,callback) {
  Shop.findOne({ _id: id },callback);
}

module.exports.getAllShops = function(callback) {
  Shop.find({},callback);
}

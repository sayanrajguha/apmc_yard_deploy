var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ShopSubscriptionSchema = new Schema({
  id : String,
  shop_id : String,
  price : String,
  startDate : String,
  endDate : String,
  amountDue : String,
  history : {
    date : String,
    amount : String,
    trans_id : String
  }
});

var ShopSubscription = module.exports = mongoose.model('ShopSubscription',ShopSubscriptionSchema);

module.exports.createShopSubscription = function(newShopSubscription, callback) {
  newShopSubscription.save(callback);
}

module.exports.updateShopSubscription = function(id,newShopSubscription,callback) {
  ShopSubscription.findOneAndUpdate({_id : id}, function(err,shopSubscription) {
    if(err) throw err;
    if(!shopSubscription) {
      callback(null,false);
    }
    console.log('found and updated');
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

module.exports.deleteShopSubscription = function(id,callback) {
  ShopSubscription.remove({ _id: id },callback);
}

module.exports.getShopSubscription = function(id,callback) {
  ShopSubscription.findOne({ _id: id },callback);
}

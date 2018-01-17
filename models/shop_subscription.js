var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ShopSubscriptionSchema = new Schema({
  shop_id : String,
  price : String,
  startDate : String,
  endDate : String,
  amountDue : String,
  history : [new Schema({
    date : String,
    amount : String,
    trans_id : String
  },{_id : false})]
});

var ShopSubscription = module.exports = mongoose.model('ShopSubscription',ShopSubscriptionSchema);

module.exports.createShopSubscription = function(newShopSubscription, callback) {
  let transRecord = {
    date : new Date(),
    amount : newShopSubscription.price,
    trans_id : mongoose.Types.ObjectId()
  };
  newShopSubscription.history = [transRecord];
  newShopSubscription.save(callback);
}

module.exports.updateShopSubscription = function(id,newShopSubscription,tenure,callback) {
  ShopSubscription.findOne({shop_id : id}, function(err,shopSubscription) {
    if(err) {
      callback(err,null);
    } else if(!shopSubscription) {
      callback(null,false);
    } else {
      console.log('shop subscription found');
      // callback(null,true);
      shopSubscription.price = newShopSubscription.price;
      let startDate = new Date(shopSubscription.startDate);
      let endDate = new Date(shopSubscription.startDate);
      endDate = new Date(endDate.setFullYear(endDate.getFullYear() + Number(tenure)));
      console.log(endDate);
      shopSubscription.endDate = endDate;
      shopSubscription.save(callback);
    }
  });
}

module.exports.deleteShopSubscription = function(id,callback) {
  ShopSubscription.remove({ shop_id : id },callback);
}

module.exports.getShopSubscription = function(id,callback) {
  ShopSubscription.findOne({ shop_id : id },callback);
}

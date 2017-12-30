var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var StockSchema = new Schema({
  id : String,
  shop_id : String,
  party_id : String,
  stockName : String,
  stockMark : String,
  quantity : String,
  trackNumber : String,
  gatePassNumber : String,
  arrivalDate : String,
  party_place : String,
  item_name : String,
  item_type : String,
  advance : String,
  freight_id : String,
  extraCharges : String,
  grossWeight : String
});

var Stock = module.exports = mongoose.model('Stock',StockSchema);

module.exports.createStock = function(newStock, callback) {
  newStock.save(callback);
}

module.exports.updateStock = function(id,newStock,callback) {
  Stock.findOneAndUpdate({_id : id}, function(err,stock) {
    if(err) throw err;
    if(!stock) {
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

module.exports.deleteStock = function(id,callback) {
  Stock.remove({ _id: id },callback);
}

module.exports.getStock = function(id,callback) {
  Stock.findOne({ _id: id },callback);
}

module.exports.getAllStocks = function(callback) {
  Stock.find({},callback);
}

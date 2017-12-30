var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var SaleSchema = new Schema({
  id : String,
  invoiceNumber : String,
  truckNumber : String,
  transactionType : String,
  chequeNUmber : String,
  item_id : String,
  item_type : String,
  item_name : String,
  quantity : String,
  grossWeight : String,
  pricePerUnit : String,
  advance : String,
  rmc : String,
  commission : String,
  coolieCharges : String,
  netAmount : String,
  rdCharges : String,
  customer_name : String,
  customer_id : String
});

var Sale = module.exports = mongoose.model('Sale',SaleSchema);

module.exports.createSale = function(newSale, callback) {
  newSale.save(callback);
}

module.exports.updateSale = function(id,newSale,callback) {
  Sale.findOneAndUpdate({_id : id}, function(err,sale) {
    if(err) throw err;
    if(!sale) {
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

module.exports.deleteSale = function(id,callback) {
  Sale.remove({ _id: id },callback);
}

module.exports.getSale = function(id,callback) {
  Sale.findOne({ _id: id },callback);
}

module.exports.getAllSales = function(callback) {
  Sale.find({},callback);
}

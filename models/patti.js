var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var PattiSchema = new Schema({
  id : String,
  stock_id : String,
  advance : String,
  status : String,
  rmc : String,
  coolieCharges : String,
  creationDate : String,
  commission : String,
  rdCharges : String,
  originalTotal : String,
  netTotal : String,
  stockSold : String,
  truckNumber : String,
  changeHistory : [{
    date : String,
    changedBy : String,
    amount : String
  }]
});

var Patti = module.exports = mongoose.model('Patti',PattiSchema);

module.exports.createPatti = function(newPatti, callback) {
  newPatti.save(callback);
}

module.exports.updatePatti = function(id,newPatti,callback) {
  Patti.findOneAndUpdate({_id : id}, function(err,patti) {
    if(err) throw err;
    if(!patti) {
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

module.exports.deletePatti = function(id,callback) {
  Patti.remove({ _id: id },callback);
}

module.exports.getPatti = function(id,callback) {
  Patti.findOne({ _id: id },callback);
}

module.exports.getAllPattis = function(callback) {
  Patti.find({},callback);
}

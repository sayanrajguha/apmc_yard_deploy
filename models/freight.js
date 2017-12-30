var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var FreightSchema = new Schema({
  id : String,
  cashAmount : String,
  chequeAmount : String,
  chequeRef : String,
  extraAmount : String,
  extraRef : String
});

var Freight = module.exports = mongoose.model('Freight',FreightSchema);

module.exports.createFreight = function(newFreight, callback) {
  newFreight.save(callback);
}

module.exports.updateFreight = function(id,newFreight,callback) {
  Freight.findOneAndUpdate({_id : id}, function(err,freight) {
    if(err) throw err;
    if(!freight) {
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

module.exports.deleteFreight = function(id,callback) {
  Freight.remove({ _id: id },callback);
}

module.exports.getFreight = function(id,callback) {
  Freight.findOne({ _id: id },callback);
}

module.exports.getAllFreights = function(callback) {
  Freight.find({},callback);
}

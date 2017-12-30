var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  id : String,
  name : String,
  desc : String,
  unit : String,
  rmcRate : String,
  item_type : String
});

var Item = module.exports = mongoose.model('Item',ItemSchema);

module.exports.createItem = function(newItem, callback) {
  newItem.save(callback);
}

module.exports.updateItem = function(id,newItem,callback) {
  Item.findOneAndUpdate({_id : id}, function(err,item) {
    if(err) throw err;
    if(!item) {
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

module.exports.deleteItem = function(id,callback) {
  Item.remove({ _id: id },callback);
}

module.exports.getItem = function(id,callback) {
  Item.findOne({ _id: id },callback);
}

module.exports.getAllItems = function(callback) {
  Item.find({},callback);
}

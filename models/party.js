var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var PartySchema = new Schema({
  id : String,
  name : String,
  address : String,
  contact : String,
  location : String,
  partyCode : String
});

var Party = module.exports = mongoose.model('Party',PartySchema);

module.exports.createParty = function(newParty, callback) {
  newParty.save(callback);
}

module.exports.updateParty = function(id,newParty,callback) {
  Party.findOneAndUpdate({_id : id}, function(err,party) {
    if(err) throw err;
    if(!party) {
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

module.exports.deleteParty = function(id,callback) {
  Party.remove({ _id: id },callback);
}

module.exports.getParty = function(id,callback) {
  Party.findOne({ _id: id },callback);
}

module.exports.getAllParties = function(callback) {
  Party.find({},callback);
}

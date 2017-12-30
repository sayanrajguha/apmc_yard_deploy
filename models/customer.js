var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  id : String,
  name : String,
  address : {
    city : String,
    state : String,
    pincode : String
  },
  contact : String,
  emailId : String,
  amountDue : String,
  kycDocNo : String,
  kycName : String
});

var Customer = module.exports = mongoose.model('Customer',CustomerSchema);

module.exports.createCustomer = function(newCustomer, callback) {
  newCustomer.save(callback);
}

module.exports.updateCustomer = function(id,newCustomer,callback) {
  Customer.findOneAndUpdate({_id : id}, function(err,customer) {
    if(err) throw err;
    if(!customer) {
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

module.exports.deleteCustomer = function(id,callback) {
  Customer.remove({ _id: id },callback);
}

module.exports.getCustomer = function(id,callback) {
  Customer.findOne({ _id: id },callback);
}

module.exports.getAllCustomers = function(callback) {
  Customer.find({},callback);
}

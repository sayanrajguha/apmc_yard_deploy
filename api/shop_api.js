const express = require('express');
const Shop = require('../models/shop');
const ShopUserMap = require('../models/shop_user_map');
const ShopSubscription = require('../models/shop_subscription');
const config = require('../config/config');
const router = express.Router();
var response = {};

router.use(function(req,res,next) {
  response = {};
  next();
});

router.get('/getAllShops',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - getAllShops --------------');
    Shop.getAllShops((err,shops) => {
      if(err || !shops) {
        response = {
          "statusCode" : "500",
          "action" : "getAllShops",
          "status" : "error",
          "message" : "Internal Server Error"
        };
        return res.status(500).json(response);
      } else {
        response = {
          "statusCode" : "200",
          "action" : "getAllShops",
          "status" : "success",
          "shops" : shops
        };
        return res.status(200).json(response);
      }
    });
  });

  module.exports = router;

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

router.get('/getAllShops/:pageNo',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - getAllShops -- page No : '+ req.params.pageNo +'---');
    Shop.getAllShops(req.params.pageNo,(err,shops) => {
      if(err || !shops) {
        response = {
          "statusCode" : "500",
          "action" : "getAllShops",
          "status" : "error",
          "message" : "Internal Server Error"
        };
        return res.status(500).json(response);
      } else {
        // shops.docs
        // shops.total
        // shops.limit - 10
        // shops.page - 3
        // shops.pages
        response = {
          "statusCode" : "200",
          "action" : "getAllShops",
          "status" : "success",
          "shops" : shops.docs,
          "total" : shops.total,
          "entries" : shops.docs.length,
          "page" : shops.page,
          "totalPages" : shops.pages
        };
        return res.status(200).json(response);
      }
    });
  });

  module.exports = router;

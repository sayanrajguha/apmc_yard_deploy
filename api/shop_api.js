const express = require('express');
const loop = require('node-async-loop');
const Shop = require('../models/shop');
const User = require('../models/user');
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
        let shopList = [];
        loop(shops.docs, (shop, nextShop) => {
            User.getUserById(shop.owner_id,(err,user) => {
              if(!err && user) {
                let ownerString = user.name + ' - '+ user.address + ' - ' + user._id;
                shop.owner_id = ownerString;
                // shopList.push(shop);
              }
              let repIds = [];
              loop(shop.representative_ids, (rep_id,nextRep) => {
                if(rep_id && rep_id.trim() != '') {
                  User.getUserById(rep_id,(err,user) => {
                    if(!err && user) {
                      let repString = user.name + ' - '+ user.address + ' - ' + user._id;
                      repIds.push(repString);
                      nextRep();
                    } else {
                      nextRep();
                    }
                  });
                } else {
                  nextRep();
                }
              }, (err) => {
                console.log('Finished looping through rep ids');
                shop.representative_ids = repIds;
                shopList.push(shop);
                nextShop();
              });
            });
        }, (err) => {
          console.log('Finished looping through shops!');
          response.shops = shopList;
          return res.status(200).json(response);
        });
      }
    });
  });

  module.exports = router;

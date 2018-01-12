const express = require('express');
const loop = require('node-async-loop');
const User = require('../models/user');
const Shop = require('../models/shop');
const ShopUserMap = require('../models/shop_user_map');
const config = require('../config/config');
const router = express.Router();
var response = {};

router.use(function(req,res,next) {
  response = {};
  next();
});

router.get('/getUserSuggestions',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - getUserSuggestions --------------');
    User.getAllUsers((err,users) => {
      if(err || !users) {
        console.log('------'+new Date()+'------ APMC - Error - getUserSuggestions --------------');
        console.log(err);
        return res.status(200).json([]);
      } else {
        let userList = [];
        for(let i=0;i<users.length;i++) {
          let userString= users[i].name+' - '+users[i].address+' - '+users[i]._id;
          userList.push(userString);
        }
        return res.status(200).json(userList);
      }
    });
  });

  router.get('/getAllUsers/:pageNo',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - getAllUsers -- page '+req.params.pageNo+'--');
      User.getAllUsers(req.params.pageNo, function(err,users){
        // console.log(users);
        if(err || !users) {
          console.log('------'+new Date()+'------ APMC - Error - getAllUsers --------------');
          console.log(err);
          let response = {
            "statusCode" : "500",
            "action" : "getAllUsers",
            "status" : "error",
            "message" : "Internal Server Error"
          };
          return res.status(500).json(response);
        } else {
          let userList = [];
          loop(users.docs, (userObj,nextUser)=> {
            if(userObj == null || userObj == undefined || !userObj) {
              nextUser();
            }
            let user = {
              'id' : userObj._id,
              'name' : userObj.name,
              'address' : userObj.address,
              'contact' : userObj.contact,
              'email' : userObj.email,
              'role' : userObj.role,
              'username' : userObj.username,
              'shopId' : '',
              'shopDetails' : ''
            };
            ShopUserMap.getShopByUser(user.id,(err,map) => {
              if(!err && map) {
                Shop.getShop(map.shop_id,(err,shop) => {
                  if(!err && shop) {
                    user.shopId = shop._id;
                    let shopString = shop.name + ' - ' + shop.address + ' - ' + shop.contact;
                    user.shopDetails = shopString;
                    userList.push(user);
                    nextUser();
                  } else {
                    userList.push(user);
                    nextUser();
                  }
                });
              } else {
                  userList.push(user);
                  nextUser();
              }
            });
          }, (err) => {
            console.log('Finished looping through users');
            let response = {
              "statusCode" : "200",
              "action" : "getAllUsers",
              "status" : "success",
              "users" : userList,
              "total" : users.total,
              "entries" : userList.length,
              "page" : users.page,
              "totalPages" : users.pages
            };
            return res.status(200).json(response);
          });
        }
      });
    });

    router.get('/getUserDetails/:userId',(req,res) => {
      console.log('------'+new Date()+'------ APMC - Error -getUserDetails --------------');
      User.getUserById(req.params.userId, (err,user) => {
        if(err || !user) {
          console.log('------'+new Date()+'------ APMC - Error - getUserDetails --------------');
          console.log(err);
          let response = {
            "statusCode" : "500",
            "action" : "getUserDetails",
            "status" : "error",
            "message" : "Internal Server Error"
          };
          return res.status(500).json(response);
        } else {
          let response = {
            "statusCode" : "200",
            "action" : "getUserDetails",
            "status" : "success",
            "user_id" : user._id,
            "name" : user.name,
            "address" : user.address
          };
          return res.status(200).json(response);
        }
      });
    });

  module.exports = router;

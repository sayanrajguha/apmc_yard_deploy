const express = require('express');
const mongoose = require('mongoose');
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
    User.getAllUsers(-1,(err,users) => {
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
            console.log(userObj);
            if(userObj != null && userObj != undefined) {
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
            } else {
              nextUser();
            }
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

    router.get('/getUser/:userId',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation -getUser --------------');
      User.getUserById(req.params.userId, (err,user) => {
        if(err || !user) {
          console.log('------'+new Date()+'------ APMC - Error - getUser --------------');
          console.log(err);
          let response = {
            "statusCode" : "500",
            "action" : "getUser",
            "status" : "error",
            "message" : "Internal Server Error"
          };
          return res.status(500).json(response);
        } else {
          let response = {
            "statusCode" : "200",
            "action" : "getUser",
            "status" : "success",
            "id" : user._id,
            "name" : user.name,
            "address" : user.address,
            "contact" : user.contact,
            "email" : user.email,
            "role" : user.role,
            "username" : user.username
          };
          return res.status(200).json(response);
        }
      });
    });

    router.put('/editUser/:userId',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation -editUser -- id : '+req.params.userId+'--');
      console.log('Data received : ');
      console.log('%j',req.body);
      let newUserObj = new User({
        "_id" : mongoose.Types.ObjectId(req.params.userId),
        "name" : req.body.name,
        "address" : req.body.address,
        "contact" : req.body.contact,
        "email" : req.body.email,
        "role" : req.body.role,
        "username" : req.body.username
      });
      User.updateUser(req.params.userId,newUserObj,(err,status) => {
        if(err || !status) {
          console.log('------'+new Date()+'------ APMC - API - editUser - Error Occured or update failed ------');
          console.log(err);
          response = {
            "statusCode" : "500",
            "action" : "editUser",
            "status" : "fail",
            "message" : "Update Failed. Please try later."
          };
          return res.status(500).json(response);
        } else {
          console.log('------'+new Date()+'------ APMC - Action - User updated ------------');
          response = {
            "statusCode" : "200",
            "action" : "editUser",
            "status" : "success",
            "id" : req.params.id
          };
          res.status(200).json(response);
        }
      });
    });

    router.delete('/deleteUser', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - deleteUser ---');
      console.log('Data received');
      console.log(req.body);
      let userIds = req.body.ids || req.body["ids[]"];
      if(!(userIds instanceof Array)) {
        userIds = [userIds];
      }
      if(userIds && userIds.length >= 1) {
        for(var i = 0; i< userIds.length; i++) {
            let id = userIds[i];
            console.log('Removing user with id '+id);
            User.removeUserById(id, (err,status) => {
              if(err || !status) {
                console.log('Delete failed due to : ('+err + '  ' + status+' )');
              }
            });
        }
        response = {
          "statusCode" : "200",
          "action" : "editUser",
          "status" : "success"
        };
        return res.status(200).json(response);
      }
    });

  module.exports = router;

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

router.post('/registerUser',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - registerUser --------------');
    console.log('Data received : ');
    console.log('%j',req.body);

    let newUserObj = new User({
      name : req.body.name,
      address : req.body.address,
      contact : req.body.contact,
      email : req.body.email,
      role : req.body.role,
      username : req.body.username,
      password : req.body.password
    });

    User.createUser(newUserObj,(err,data) => {
      if(err || !data) {
        console.log('------'+new Date()+'------ APMC - API - registerUser - Error Occured or empty data ------');
        console.log(err);
        response = {
          "statusCode" : "500",
          "action" : "register",
          "status" : "fail",
          "message" : "Internal Server Error. Please try later."
        };
        return res.status(500).json(response);
      } else {
        response = {
          "statusCode" : "200",
          "action" : "register",
          "status" : "success",
          "id" : data._id,
          "username" : data.username,
          "role" : data.role
        };
        return res.status(200).json(response);
      }
    });
  });

  router.post('/registerShop',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - registerShop ------------');
    console.log('Data received : ');
    console.log('%j',req.body);

    let newShopObj = new Shop({
        "name" : req.body.name,
        "address" : req.body.address,
        "owner_id" : req.body.owner_id,
        "representative_ids" : req.body.representative_ids,
        "contact" : req.body.contact
      });
    Shop.createShop(newShopObj, (err,data) => {
      if(err || !data) {
        console.log('------'+new Date()+'------ APMC - API - registerShop - Error Occured or empty data ------');
        console.log(err);
        response = {
          "statusCode" : "500",
          "action" : "registerShop",
          "status" : "fail",
          "message" : "Internal Server Error. Please try later."
        };
        return res.status(500).json(response);
      } else {
        console.log('------'+new Date()+'------ APMC - Action - Shop created ------------');
        response = {
          "statusCode" : "200",
          "action" : "registerShop",
          "status" : "success",
          "id" : data._id,
          "owner_id" : data.owner_id,
          "representative_ids" : data.representative_ids
        };
        Promise.resolve()
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution started. Mapping owner to shop ------');
          let newShopUserMap = new ShopUserMap({
            shop_id : data._id,
            user_id : data.owner_id
          });
          ShopUserMap.createShopUserMap(newShopUserMap,(err,data1) => {
            if(err || !data1) {
              console.log('------'+new Date()+'------ APMC - API - registerShop - Error Occured or empty data ------');
              console.log(err);
              throw new Error(err);
            } else {
              console.log('------'+new Date()+'------ APMC - Action - Mapped owner # '+data1.user_id+' to shop # '+data1.shop_id+' ------');
              return;
            }
          });
        })
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution. Mapping reps to shop ------');
          loop(data.representative_ids, function (rep_id, next){
            console.log('------'+new Date()+'------ APMC - Action - Mapping rep id '+rep_id+' ------');
            let newShopUserMap = new ShopUserMap({
              shop_id : data._id,
              user_id : rep_id
            });
            ShopUserMap.createShopUserMap(newShopUserMap,(err,data2) => {
              if(err || !data2) {
                console.log('------'+new Date()+'------ APMC - API - registerShop - Error Occured or empty data ------');
                console.log(err);
                throw new Error(err);
              } else {
                console.log('------'+new Date()+'------ APMC - Action - Mapped rep # '+data2.user_id+' to shop # '+data2.shop_id+' ------');
              }
              next();
            });
          }, () => {
              console.log('Looping Finished! Representative Mapping Complete');
              return;
          });
        })
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution complete. Returning response ------');
          return res.status(200).json(response);
        })
        .catch((err) => {
          console.log('Promise error');
          console.log(err);
          response = {
            "statusCode" : "500",
            "action" : "registerShop",
            "status" : "fail",
            "message" : "Error in mapping users. Please edit shop and try again."
          };
          return res.status(500).json(response);
        });
      }
    });
  });

  router.post('/login',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - login ------------');
    console.log('Data received : ');
    console.log('%j',req.body.username);
    console.log('%j',req.body.shop_id);

    User.getUserByUsername(req.body.username, (err,user) => {
      if(err || !user) {
        console.log('------'+new Date()+'------ APMC - login - Error or user not found ------------');
        response = {
          "statusCode" : "401",
          "action" : "login",
          "status" : "fail",
          "message" : "Invalid Credentials"
        };
        return res.status(401).json(response);
      }
      console.log('------'+new Date()+'------ APMC - login - user found ------------');
      ShopUserMap.getUserShopMatch(user._id, req.body.shop_id, (err,matchStatus) => {
        if(err || !matchStatus) {
          console.log('------'+new Date()+'------ APMC - login - user and shop match fail ------------');
          response = {
            "statusCode" : "401",
            "action" : "login",
            "status" : "deny",
            "message" : "Error in user shop login. Access Denied."
          };
          return res.status(401).json(response);
        } else {
          console.log('------'+new Date()+'------ APMC - login - user and shop match! ------------');
          console.log(matchStatus);
          User.comparePassword(req.body.password, user.password, (err,status) => {
            if(err || !status) {
              console.log('------'+new Date()+'------ APMC - login - user password match fail ------------');
              response = {
                "statusCode" : "401",
                "action" : "login",
                "status" : "fail",
                "message" : "Invalid Credentials"
              };
              return res.status(401).json(response);
            } else {
              console.log('------'+new Date()+'------ APMC - login - login success ------------');
              response = {
                "statusCode" : "200",
                "action" : "login",
                "status" : "success",
                "message" : "Login Success"
              };
              return res.status(200).json(response);
            }
          });
        }
      });
    });
  });

  module.exports = router;

const express = require('express');
const loop = require('node-async-loop');
const mongoose = require('mongoose');
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

router.get('/getShop/:id', (req,res) => {
  console.log('------'+new Date()+'------ APMC - API invocation - getShop -- id : '+ req.params.id +'---');
  Shop.getShop(req.params.id, (err,shop) => {
    if(err || !shop) {
      console.log('------'+new Date()+'------ APMC - Error - getShop -- '+err);
      response = {
        "statusCode" : "500",
        "action" : "getShop",
        "status" : "error",
        "message" : "Internal Server Error"
      };
      return res.status(500).json(response);
    } else {
      let shopObj = {
        "id" : shop._id,
        "name" : shop.name,
        "address" : shop.address,
        "owner_id" : shop.owner_id,
        "contact" : shop.contact,
        "representative_ids" : shop.representative_ids,
        "price" : "",
        "tenure" : "",
        "startDate" : "",
        "endDate" : "",
        "amountDue" : "",
        "history" : []
      };
        ShopSubscription.getShopSubscription(shop._id, (err,shopSubscr) => {
          console.log(err);
          console.log(shopSubscr);
          if(!err && shopSubscr) {
            shopObj.price = shopSubscr.price;
            shopObj.startDate = shopSubscr.startDate;
            shopObj.endDate = shopSubscr.endDate;
            let startDate = new Date(shopObj.startDate);
            let endDate = new Date(shopObj.endDate);
            let dateDiff = new Date(endDate-startDate);
            let tenure = Math.abs(dateDiff.getUTCFullYear() - 1970);
            shopObj.tenure = tenure;
            shopObj.amountDue = shopSubscr.amountDue;
            shopObj.history = shopSubscr.history;
          }
          User.getUserById(shopObj.owner_id,(err,user) => {
            if(!err && user) {
              let ownerString = user.name + ' - '+ user.address + ' - ' + user._id;
              shopObj.owner_id = ownerString;
              // shopList.push(shop);
            }
            let repIds = [];
            loop(shopObj.representative_ids, (rep_id,nextRep) => {
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
              shopObj.representative_ids = repIds;
              response = {
                "statusCode" : "200",
                "action" : "getShop",
                "status" : "success",
                "shop" : shopObj
              };
              return res.status(200).json(response);
            });
          });
        });
    }
  });
});

router.put('/editShop/:id', (req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - editShop -- for shop id : '+ req.params.id +'--');
    console.log('Data received : ');
    console.log('%j',req.body);
    var representative_ids = req.body.representative_ids || req.body['representative_ids[]'];
    let newShopObj = new Shop({
        "_id" : mongoose.Types.ObjectId(req.params.id),
        "name" : req.body.name,
        "address" : req.body.address,
        "owner_id" : req.body.owner_id,
        "representative_ids" : representative_ids,
        "contact" : req.body.contact
      });
    Shop.updateShop(req.params.id, newShopObj, (err,status) => {
      if(err || !status) {
        console.log('------'+new Date()+'------ APMC - API - editShop - Error Occured or update failed ------');
        console.log(err);
        response = {
          "statusCode" : "500",
          "action" : "editShop",
          "status" : "fail",
          "message" : "Update Failed. Please try later."
        };
        return res.status(500).json(response);
      } else {
        console.log('------'+new Date()+'------ APMC - Action - Shop updated ------------');
        response = {
          "statusCode" : "200",
          "action" : "editShop",
          "status" : "success",
          "id" : req.params.id
        };
        Promise.resolve()
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution started. Updating owner shop map ------');
          return new Promise((resolve,reject) => {
            ShopUserMap.deleteShopUserMap(req.params.id,(err,status) => {
              console.log('ShopUserMap deleting existing : '+err+' | '+status);
              let newShopUserMap = new ShopUserMap({
                shop_id : req.params.id,
                user_id : req.body.owner_id
              });
              ShopUserMap.createShopUserMap(newShopUserMap,(err,status) => {
                if(err || !status) {
                  console.log('------'+new Date()+'------ APMC - API - editShop - Error Occured or update failed ------');
                  console.log(err);
                  reject(err);
                } else {
                  console.log('------'+new Date()+'------ APMC - Action - Updated owner # '+req.body.owner_id+' to shop # '+req.params.id+' ------');
                  resolve();
                }
              });
            });
          });
        })
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution. Updating mapped reps to shop ------');
          return new Promise((resolve,reject) => {
            loop(newShopObj.representative_ids, function (rep_id, next){
              console.log('------'+new Date()+'------ APMC - Action - Mapping rep id '+rep_id+' ------');
              let newShopUserMap = new ShopUserMap({
                shop_id : req.params.id,
                user_id : rep_id
              });
              ShopUserMap.createShopUserMap(newShopUserMap,(err,data2) => {
                if(err || !data2) {
                  console.log('------'+new Date()+'------ APMC - API - editShop - Error Occured or empty data ------');
                  throw new Error(err);
                  console.log(err);
                } else {
                  console.log('------'+new Date()+'------ APMC - Action - Mapped rep # '+data2.user_id+' to shop # '+data2.shop_id+' ------');
                }
                next();
              });
            }, () => {
                console.log('Looping Finished! Representative Mapping Complete');
                resolve();
            });
          });
        })
        .then(() => {
          console.log('------'+new Date()+'------ APMC - Action - Promise execution. Updating shop subscription ------');
          return new Promise((resolve,reject) => {
            let shopSubscription = new ShopSubscription({
              shop_id : req.params.id,
              price : req.body.price             // needs more work -> update rest of the data
              // startDate : new Date(),
              // endDate : new Date(new Date().setFullYear(new Date().getFullYear() + Number(req.body.tenure))),
              // amountDue : 0
            });
            ShopSubscription.updateShopSubscription(req.params.id, shopSubscription,req.body.tenure, (err,status) => {
              if(err || !status) {
                console.log('------'+new Date()+'------ APMC - API - editShop - Error Occured or update failed ------');
                console.log(err);
                reject(err);
              } else {
                console.log('------'+new Date()+'------ APMC - Action - Shop Subscription updated with id # '+req.params.id+' ------');
                resolve();
              }
            });
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
            "action" : "editShop",
            "status" : "fail",
            "message" : "Error in mapping users. Please edit shop and try again."
          };
          return res.status(500).json(response);
        });
      }
    });
});

router.delete('/deleteShop', (req,res) => {
  console.log('------'+new Date()+'------ APMC - API invocation - deleteShop ---');
  console.log('Data received');
  console.log(req.body);
  let shopIds = req.body.ids || req.body["ids[]"];
  if(!(shopIds instanceof Array)) {
    shopIds = [shopIds];
  }
  if(shopIds && shopIds.length >= 1) {
    for(var i = 0; i< shopIds.length; i++) {
      let id = shopIds[i];
      Promise.resolve()
      .then(() => {
        console.log('------'+new Date()+'------ APMC - Action - deleting shop subscriptions with shop id : '+id);
        return new Promise((resolve,reject) => {
          ShopSubscription.deleteShopSubscription(id, (err) => {
            if(err) {
              console.log('------'+new Date()+'------ APMC - Error - deleting shop subscription failed ');
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
      .then(() => {
        console.log('------'+new Date()+'------ APMC - Action - deleting shop user mappings with shop id : '+id);
        return new Promise((resolve,reject) => {
          ShopUserMap.deleteShopUserMap(id, (err) => {
            if(err) {
              console.log('------'+new Date()+'------ APMC - Error - deleting shop user map failed ');
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
      .then(() => {
        console.log('------'+new Date()+'------ APMC - Action - deleting shop with id '+id);
        return new Promise((resolve,reject) => {
          Shop.deleteShop(id, (err) => {
            if(err) {
              console.log('------'+new Date()+'------ APMC - Error - deleting shop failed ');
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })
      .then(() => {
        console.log('------'+new Date()+'------ APMC - Action - Promise execution deletShop complete. Returning response ------');
        response = {
          "statusCode" : "200",
          "action" : "deleteShop",
          "status" : "success"
        };
        return res.status(200).json(response);
      })
      .catch(() => {
        response = {
          "statusCode" : "500",
          "action" : "deleteShop",
          "status" : "error",
          "message" : "Failed to delete shop. Please try again."
        };
        return res.status(500).json(response);
      });
    }
  }
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

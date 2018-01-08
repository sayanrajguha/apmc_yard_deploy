const express = require('express');
const User = require('../models/user');
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
        console.log(users);
        if(err || !users) {
          console.log('------'+new Date()+'------ APMC - Error - getAllUsers --------------');
          console.log(err);
          let response = {
            "statusCode" : "500",
            "action" : "getAllUsers",
            "status" : "error",
            "message" : "Internal Server Error"
          };
          return res.status(200).json(response);
        } else {
          let userList = [];
          for(let i=0;i<users.docs.length;i++) {
            // let userString= users[i].name+' - '+users[i].address+' - '+users[i]._id;
            let user = {
              'name' : users.docs[i].name,
              'address' : users.docs[i].address,
              'contact' : users.docs[i].contact,
              'email' : users.docs[i].email,
              'role' : users.docs[i].role,
              'username' : users.docs[i].username
            };
            userList.push(user);
          }
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
        }
      });
    });

  module.exports = router;

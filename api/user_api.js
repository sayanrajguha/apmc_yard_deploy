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

  module.exports = router;

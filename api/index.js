const express = require('express');
const config = require('../config/config');
const router = express.Router();
var response = {};

router.use(function(req,res,next) {
  response = {};
  next();
});

router.get('/',(req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - index --------------');
    res.status(200).end('Application up and running...!');
  });

  module.exports = router;

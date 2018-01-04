const express = require('express');
const config = require('../config/config');
const router = express.Router();
var response = {};

router.use(function(req,res,next) {
  response = {};
  next();
});

  router.post('/party', (req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - sync Party --------------');
    res.status(200).end('Sync User API called...');
  });

  router.post('/item', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Item --------------');
      res.status(200).end('Sync User API called...');
  });

  router.post('/stock', (req,res) => {
        console.log('------'+new Date()+'------ APMC - API invocation - sync Stock --------------');
        res.status(200).end('Sync User API called...');
  });

  router.post('/freight', (req,res) => {
          console.log('------'+new Date()+'------ APMC - API invocation - sync freight --------------');
          res.status(200).end('Sync User API called...');
  });

  router.post('/sale', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Sale --------------');
      res.status(200).end('Sync User API called...');
  });

  router.post('/customer', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Customer --------------');
      res.status(200).end('Sync User API called...');
  });

  router.post('/patti', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Patti --------------');
      res.status(200).end('Sync User API called...');
  });

  module.exports = router;

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
    res.render('index.html');
  });

  router.get('/dashboard',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - dashboard --------------');
      res.render('dashboard.html');
    });

  router.get('/shopOnboard',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - shopOnboard --------------');
      res.render('dashboard_shop_onboard.html');
    });

  router.get('/dashboardOwner',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - dashboardOwner --------------');
      res.render('dashboard_owner.html');
    });

  router.get('/manageShops',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - manageShops --------------');
      res.render('dashboard_manage_shops.html');
    });

  router.get('/manageUsers',(req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - manageUsers --------------');
      res.render('dashboard_manage_users.html');
    });

  module.exports = router;

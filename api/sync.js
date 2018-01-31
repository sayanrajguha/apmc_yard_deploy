const express = require('express');
const loop = require('node-async-loop');
const config = require('../config/config');
const router = express.Router();
var response = {};

router.use(function(req,res,next) {
  response = {};
  next();
});

  router.post('/party', (req,res) => {
    console.log('------'+new Date()+'------ APMC - API invocation - sync Party --------------');
    let partyList = req.body.list;
    if(!partyList || partyList.length < 1) {

    } else {
      loop(partyList, (party,next) => {

      }, (err) => {

      });
    }
    res.status(200).end('Sync Party API called...');
  });

  router.post('/item', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Item --------------');
      let itemList = req.body.list;
      if(!itemList || itemList.length < 1) {

      } else {
        loop(itemList, (item,next) => {

        }, (err) => {

        });
      }
      res.status(200).end('Sync Item API called...');
  });

  router.post('/stock', (req,res) => {
        console.log('------'+new Date()+'------ APMC - API invocation - sync Stock --------------');
        let stockList = req.body.list;
        if(!stockList || stockList.length < 1) {

        } else {
          loop(stockList, (stock,next) => {

          }, (err) => {

          });
        }
        res.status(200).end('Sync Stock API called...');
  });

  router.post('/freight', (req,res) => {
          console.log('------'+new Date()+'------ APMC - API invocation - sync freight --------------');
          let freightList = req.body.list;
          if(!freightList || freightList.length < 1) {

          } else {
            loop(freightList, (friehgt,next) => {

            }, (err) => {

            });
          }
          res.status(200).end('Sync Freight API called...');
  });

  router.post('/sale', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Sale --------------');
      let saleList = req.body.list;
      if(!saleList || saleList.length < 1) {

      } else {
        loop(saleList, (sale,next) => {

        }, (err) => {

        });
      }
      res.status(200).end('Sync Sale API called...');
  });

  router.post('/customer', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Customer --------------');
      let customerList = req.body.list;
      if(!customerList || customerList.length < 1) {

      } else {
        loop(customerList, (customer,next) => {

        }, (err) => {

        });
      }
      res.status(200).end('Sync Customer API called...');
  });

  router.post('/patti', (req,res) => {
      console.log('------'+new Date()+'------ APMC - API invocation - sync Patti --------------');
      let pattiList = req.body.list;
      if(!pattiList || pattiList.length < 1) {

      } else {
        loop(pattiList, (patti,next) => {

        }, (err) => {

        });
      }
      res.status(200).end('Sync Patti API called...');
  });

  module.exports = router;

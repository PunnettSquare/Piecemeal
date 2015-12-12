
"use strict";

var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestOne = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestTwo = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestThree = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var url = 'http://piecemeal.herokuapp.com';
var Promise = require('bluebird');
var _ = require('lodash');


require('./botPiecemeal')(helpers, webdriver, hostBrowser, guestOne, guestTwo, guestThree, url)
.then(function() {
  var directions = [
    [hostBrowser, 'hostBill'],
    [guestOne, 'guestBill'],
    [guestTwo, 'guestBill'],
    [guestThree, 'allDishes'],
  ]
  console.time();
  return Promise.all(_.map(directions, function(array) {
    return helpers.goToPage(webdriver, array[0], array[1]);
  }))
  
})
.then(function() {
  console.time();
  console.log('finished');
})

// helpers.makeRoom(webdriver, hostBrowser, 'Host', url)
// .then(function(code) {
//   console.log(code);
//   roomCode = code;
// })
// .then(function() {
//   return helpers.goToPage(webdriver, hostBrowser, 'hostBill');
// })
// .then(function(route) {
//   hostBrowser.sleep(3000);
//   return helpers.goToPage(webdriver, hostBrowser, 'allDishes');
// })

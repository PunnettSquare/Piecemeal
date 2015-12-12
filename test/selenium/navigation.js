
"use strict";

var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var By = webdriver.By;
var Promise = require('bluebird');
var _ = require('underscore');
var url = 'localhost:8080/';


var roomCode;

helpers.makeRoom(webdriver, hostBrowser, 'Host', url)
.then(function(code) {
  console.log(code);
  roomCode = code;
})
.then(function() {
  return helpers.goToPage(webdriver, hostBrowser, 'hostBill');
})
.then(function(route) {
  hostBrowser.sleep(3000);
  return helpers.goToPage(webdriver, hostBrowser, 'allDishes');
})

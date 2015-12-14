
"use strict";

var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestOne = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestTwo = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestThree = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
// var url = 'http://piecemeal.herokuapp.com';
var url = 'localhost:8080/'
var Promise = require('bluebird');
var _ = require('lodash');
var tipInput = '20';
var taxInput = '8';
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
  return helpers.setTipAndTax(webdriver, hostBrowser, tipInput, taxInput)
})
.then(function() {
  return helpers.getTip(webdriver, guestTwo)
})
.then(function(tip) {
  tip = tip.split(' ');
  tip = tip[3];
  tip = tip.split('')
  tip.pop();
  tip = tip.join('')
  if (tip === tipInput) {
    console.log('Correct tip sent to guests');
  } else {
    console.error('Incorrect tip sent to guests, expected ' + tip + ' to equal ' + tipInput);
  }
})
.then(function() {
  return helpers.getTax(webdriver, guestTwo)
})
.then(function(tax) {
  tax = tax.split(' ');
  tax = tax[3];
  tax = tax.split('')
  tax.pop();
  tax = tax.join('')
  if (tax === taxInput) {
    console.log('Correct tax sent to guests');
  } else {
    console.error('Incorrect tax sent to guests, expected ' + tax + ' to equal ' + taxInput);
  }
})
.then(function() {
  return helpers.goToPage(webdriver, guestThree, 'guestBill')
})
.then(function() {
  return helpers.getTip(webdriver, guestThree)
})
.then(function(tip) {
  tip = tip.split(' ');
  tip = tip[3];
  tip = tip.split('')
  tip.pop();
  tip = tip.join('')
  if (tip === tipInput) {
    console.log('Correct tip displayed for user moving to hostBill after final bill is sent');
  } else {
    console.error('Incorrect tip sent to users moving to hostBill after final bill is sent, \n Expected ' + tip + ' to equal ' + tipInput);
  }
})
.then(function() {
  return helpers.getTax(webdriver, guestThree)
})
.then(function(tax) {
  tax = tax.split(' ');
  tax = tax[3];
  tax = tax.split('')
  tax.pop();
  tax = tax.join('')
  if (tax === taxInput) {
    console.log('Correct tax displayed for user moving to hostBill after final bill is sent');
  } else {
    console.error('Incorrect tax sent to users moving to hostBill after final bill is sent, \n Expected ' + tax + ' to equal ' + taxInput);
  }
})

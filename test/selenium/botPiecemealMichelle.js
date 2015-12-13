var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var Michelle = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var jason = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var justin = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var tiphanie = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var By = webdriver.By;
var Promise = require('bluebird');
var _ = require('underscore');
var url = 'localhost:8080/';

// setTimeout(function() {
//  helpers.closeBrowser(Michelle);
//  helpers.closeBrowser(jason);
//  helpers.closeBrowser(justin);
//  helpers.closeBrowser(tiphanie);
// }, 20000)

var roomCode;

helpers.makeRoom(webdriver, Michelle, 'Michelle', url)
  .then(function(code) {
    console.log(code);
    roomCode = code;
  })
  .then(function() {
    Michelle.getCurrentUrl()
      .then(function(url) {
        console.log(typeof url);
        console.log(url);
      });
    helpers.joinRoom(webdriver, jason, url, roomCode, 'jason');
    return helpers.joinRoom(webdriver, justin, url, roomCode, 'justin');
  })
  .then(function() {
    return helpers.goToAddDish(webdriver, Michelle);
  })

.then(function() {
    var dishes = [{
      name: 'Pho',
      cost: '12.99'
    }, {
      name: 'xiaolongbao',
      cost: '4.99'
    }, {
      name: 'salmon sashimi',
      cost: '9.24'
    }];
    return Promise.all(_.map(dishes, function(dish) {
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    return helpers.goToAddDish(webdriver, jason);
  })
  .then(function() {
    var dishes = [{
      name: 'edamame',
      cost: '3.99'
    }, {
      name: 'takoyaki',
      cost: '8.99'
    }, {
      name: 'red bean soup',
      cost: '8.50'
    }];
    return Promise.all(_.map(dishes, function(dish) {
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    return helpers.goToAddDish(webdriver, justin);
  })
  .then(function() {
    var dishes = [{
      name: 'char siu',
      cost: '15.99'
    }, {
      name: 'chongqing spicy chicken',
      cost: '30.94'
    }, {
      name: 'dandan noodles',
      cost: '9.24'
    }];
    return Promise.all(_.map(dishes, function(dish) {
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    helpers.goToAllDishes(webdriver, Michelle);
    helpers.goToAllDishes(webdriver, justin);
    return helpers.goToAllDishes(webdriver, jason);
  })
  .then(function() {
    return helpers.joinRoom(webdriver, tiphanie, url, roomCode, 'tiphanie');
  })
  .then(function() {
    return tiphanie.wait(webdriver.until.elementLocated(webdriver.By.css(".share")), 8 * 1000);
  })
  .then(function(share) {
    return share.click();
  })
  .then(function() {
    helpers.shareDishes(webdriver, jason, 8);
    helpers.shareDishes(webdriver, justin, 8);
    return helpers.shareDishes(webdriver, tiphanie, 9);
  })
  .then(function() {
    tiphanie.sleep(500);
    return helpers.unshareDishes(webdriver, tiphanie, 9);
  });
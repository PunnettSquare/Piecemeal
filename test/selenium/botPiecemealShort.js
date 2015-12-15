var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var Michelle = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var Jason = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var Tiphanie = new webdriver.Builder().usingServer().withCapabilities({
  'browserName': 'chrome'
}).build();
var By = webdriver.By;
var Promise = require('bluebird');
var _ = require('underscore');
var url = 'localhost:8080/';

setTimeout(function() {
  // helpers.closeBrowser(Michelle);
  helpers.closeBrowser(Jason);
  // helpers.closeBrowser(Tiphanie);
}, 40000);

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
    return helpers.joinRoom(webdriver, Jason, url, roomCode, 'Jason');
  })
  .then(function() {
    Jason.sleep(500);
    Michelle.sleep(500);
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
      Jason.sleep(500);
      Michelle.sleep(500);
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    return helpers.goToAddDish(webdriver, Jason);
  })
  .then(function() {
    var dishes = [{
      name: 'edamame',
      cost: '3.99'
    }, {
      name: 'red bean soup',
      cost: '8.50'
    }];
    return Promise.all(_.map(dishes, function(dish) {
      Jason.sleep(500);
      Michelle.sleep(500);
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    var dishes = [{
      name: 'dandan noodles',
      cost: '9.24'
    }];
    return Promise.all(_.map(dishes, function(dish) {
      Jason.sleep(500);
      Michelle.sleep(500);
      return helpers.addDish(webdriver, Michelle, dish.name, dish.cost);
    }));
  })
  .then(function() {
    helpers.goToAllDishes(webdriver, Michelle);
    Jason.sleep(500);
    Michelle.sleep(500);
    return helpers.goToAllDishes(webdriver, Jason);
  })
  .then(function() {
    return helpers.joinRoom(webdriver, Tiphanie, url, roomCode, 'Tiphanie');
  })
  .then(function() {
    return Tiphanie.wait(webdriver.until.elementLocated(webdriver.By.css(".share")), 8 * 1000);
  })
  .then(function(share) {
    Jason.sleep(500);
    Michelle.sleep(500);
    return share.click();
  })
  .then(function() {
    helpers.shareDishes(webdriver, Jason, 8);
    Jason.sleep(500);
    return helpers.shareDishes(webdriver, Tiphanie, 9);
  }); // .then(function() {
//   Tiphanie.sleep(500);
//   return helpers.unshareDishes(webdriver, Tiphanie, 9);
// });


"use strict";

var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestOne = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestTwo = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestThree = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var By = webdriver.By;

var url = 'localhost:8080/';

setTimeout(function() {
	helpers.closeBrowser(hostBrowser);
	helpers.closeBrowser(guestOne);
	helpers.closeBrowser(guestTwo);
	helpers.closeBrowser(guestThree);
}, 20000)

var roomCode;

helpers.makeRoom(webdriver, hostBrowser, 'Host', url)
.then(function(code) {
	console.log(code);
	roomCode = code;
})
.then(function() {
	helpers.joinRoom(webdriver, guestOne, url, roomCode, 'guestOne');
	helpers.joinRoom(webdriver, guestTwo, url, roomCode, 'guestTwo');
})
.then(function() {
	return helpers.goToAddDishes(webdriver, hostBrowser);
})

.then(function() {
	return helpers.addDish(webdriver, hostBrowser, 'Host Dish 1', '19.99');
})
.then(function() {
	return helpers.addDish(webdriver, hostBrowser, 'Host Dish 2', '12.99');
})
.then(function() {
	return helpers.addDish(webdriver, hostBrowser, 'Host Dish 3', '8.39');
})
.then(function() {
	return helpers.goToAddDishes(webdriver, guestOne);
})
.then(function() {
	return helpers.addDish(webdriver, guestOne, 'guestOne Dish 1', '8.39');
})
.then(function() {
	return helpers.addDish(webdriver, guestOne, 'guestOne Dish 2', '9.39');
})
.then(function() {
	return helpers.addDish(webdriver, guestOne, 'guestOne Dish 3', '14.39');
})
.then(function() {
	return helpers.goToAddDishes(webdriver, guestTwo);
})
.then(function() {
	return helpers.addDish(webdriver, guestTwo, 'guestTwo Dish 1', '8.39');
})
.then(function() {
	return helpers.addDish(webdriver, guestTwo, 'guestTwo Dish 2', '9.39');
})
.then(function() {
	return helpers.addDish(webdriver, guestTwo, 'guestTwo Dish 3', '14.39');
})
.then(function() {
	helpers.goToAllDishes(webdriver, hostBrowser);
	helpers.goToAllDishes(webdriver, guestTwo);
	return helpers.goToAllDishes(webdriver, guestOne);
})
.then(function() {
	return helpers.joinRoom(webdriver, guestThree, url, roomCode, 'guestThree');
})
.then(function() {
	return guestThree.wait(webdriver.until.elementLocated(webdriver.By.css(".share")), 8 * 1000)
})
.then(function(share) {
	return share.click();
})
.then(function() {
	helpers.shareDishes(webdriver, guestOne, 8);
	helpers.shareDishes(webdriver, guestTwo, 8);
	return helpers.shareDishes(webdriver, guestThree, 9);
})
.then(function() {
	guestThree.sleep(500);
	return helpers.unshareDishes(webdriver, guestThree, 9);
})



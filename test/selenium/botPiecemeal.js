
"use strict";

var helpers = require('./helpers');
var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestOne = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestTwo = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestThree = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var By = webdriver.By;
var Promise = require('bluebird');
var _ = require('underscore');
var url = 'localhost:8080/';

// setTimeout(function() {
// 	helpers.closeBrowser(hostBrowser);
// 	helpers.closeBrowser(guestOne);
// 	helpers.closeBrowser(guestTwo);
// 	helpers.closeBrowser(guestThree);
// }, 20000)

var roomCode;

helpers.makeRoom(webdriver, hostBrowser, 'Host', url)
.then(function(code) {
	console.log(code);
	roomCode = code;
})
.then(function() {
	hostBrowser.getCurrentUrl()
	.then(function(url) {
		console.log(typeof url)
		console.log(url);
	})
	helpers.joinRoom(webdriver, guestOne, url, roomCode, 'guestOne');
	return helpers.joinRoom(webdriver, guestTwo, url, roomCode, 'guestTwo');
})
.then(function() {
	return helpers.goToAddDish(webdriver, hostBrowser);
})

.then(function() {
	var dishes = [
	{name: 'Host Dish 1', cost: '19.99'},
	{name: 'Host Dish 2', cost: '24.99'},
	{name: 'Host Dish 3', cost: '989.24'} ]
	return Promise.all(_.map(dishes, function(dish) {
		return helpers.addDish(webdriver, hostBrowser, dish.name, dish.cost);
	}))
})
.then(function() {
	return helpers.goToAddDish(webdriver, guestOne);
})
.then(function() {
	var dishes = [
	{name: 'guestOne Dish 1', cost: '19.99'},
	{name: 'guestOne Dish 2', cost: '24.99'},
	{name: 'guestOne Dish 3', cost: '9234.24'} ]
	return Promise.all(_.map(dishes, function(dish) {
		return helpers.addDish(webdriver, hostBrowser, dish.name, dish.cost);
	}))
})
.then(function() {
	return helpers.goToAddDish(webdriver, guestTwo);
})
.then(function() {
	var dishes = [
	{name: 'guestTwo Dish 1', cost: '112.79'},
	{name: 'guestTwo Dish 2', cost: '34.94'},
	{name: 'guestTwo Dish 3', cost: '9.24'} ]
	return Promise.all(_.map(dishes, function(dish) {
		return helpers.addDish(webdriver, hostBrowser, dish.name, dish.cost);
	}))
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



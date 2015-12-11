

"use strict";

var webdriver = require('selenium-webdriver');
var hostBrowser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestOne = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestTwo = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var guestThree = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome' }).build();
var By = webdriver.By;
function logTitle() {
	hostBrowser.getTitle()
	.then(function(title) {
		console.log('Current Page Title: ' + title);
	});
}

function clickLink(link) {
	link.click();
}

function handleFailure(err) {
	console.error('Something went wrong\n', err.stack, '\n');
	closeBrowser();
}

function findTutsPlusLink() {
	return hostBrowser.findElements(webdriver.By.css('[href="http://code.tutsplus.com/"]')).then(function(result) {
		return result[0];
	});
}

function closeBrowser() {
	hostBrowser.quit();
}

var clickPerson = function(name) {
	hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.linkText(name)), 12 * 1000).then(function(element) {
		element.click();


	});


	hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("div.js-timeline-item-body-wrap div.no-fullstory")), 8 * 1000).then(function(element) {
		// element.click();
		hostBrowser.get(hostBrowser.getCurrentUrl());
		// do something to extract
	});
	//do something to unselect field
}

var joinRoom = function(browser, roomCode, name) {
	browser.get('localhost:8080/')
	return browser.wait(webdriver.until.elementLocated(webdriver.By.css("input.ng-invalid")), 8 * 1000)
	.then(function(element) {
		return element.sendKeys(name);
	})
	.then(function() {
		return browser.findElements(By.tagName('input'))
	})
	.then(function(inputs) {
		inputs[2].sendKeys(roomCode);
		return inputs[3].click();
	})
}

var addDish = function(browser, name, cost) {
	return browser.wait(webdriver.until.elementLocated(webdriver.By.css("input.dishName")), 8 * 1000)
	.then(function(element) {
		return element.sendKeys(name);
	})
	.then(function() {
		return browser.findElement(By.className('dishCost'))
	})
	.then(function(elements) {
		return elements.sendKeys(cost);
	})
	.then(function() {
		return browser.findElement(By.className('addDish'))
	})
	.then(function(element) {
		return element.click();
	})
}

var goToAddDishes = function(browser) {
	return browser.findElement(By.className('addDish'))
	.then(function(button) {
		return button.click()
	})
}

var goToAllDishes = function (browser) {
	return browser.findElement(By.className('allDishes'))
	.then(function(button) {
		return button.click();
	})
}

hostBrowser.get('localhost:8080/')
var roomCode;

hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("input.ng-invalid")), 8 * 1000)
.then(function(element) {
	element.sendKeys('host');
})
.then(function() {
	return hostBrowser.findElements(By.tagName('input'))
})
.then(function(inputs) {
	return inputs[1].click()
})
.then(function() {
	return hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css(".ng-binding .ng-binding")), 8 * 1000)
	// return hostBrowser.findElements(By.className('ng-binding'));
})
.then(function (element) {
	return element.getText();
})
.then(function(text) {
	roomCode = text;
	console.log('roomCode =', roomCode);
})
.then(function() {
	joinRoom(guestOne, roomCode, 'guestOne');
	joinRoom(guestTwo, roomCode, 'guestTwo');
})
.then(function() {
	return goToAddDishes(hostBrowser);
})

.then(function() {
	return addDish(hostBrowser, 'Host Dish 1', '19.99');
})
.then(function() {
	return addDish(hostBrowser, 'Host Dish 2', '12.99');
})
.then(function() {
	return addDish(hostBrowser, 'Host Dish 3', '8.39');
})
.then(function() {
	return goToAddDishes(guestOne);
})
.then(function() {
	return addDish(hostBrowser, 'guestOne Dish 1', '8.39');
})
.then(function() {
	return addDish(hostBrowser, 'guestOne Dish 2', '9.39');
})
.then(function() {
	return addDish(hostBrowser, 'guestOne Dish 3', '14.39');
})
.then(function() {
	return goToAddDishes(guestTwo);
})
.then(function() {
	return addDish(hostBrowser, 'guestTwo Dish 1', '8.39');
})
.then(function() {
	return addDish(hostBrowser, 'guestTwo Dish 2', '9.39');
})
.then(function() {
	return addDish(hostBrowser, 'guestTwo Dish 3', '14.39');
})
.then(function() {
	goToAllDishes(hostBrowser);
	goToAllDishes(guestTwo);
	return goToAllDishes(guestOne);
})
.then(function() {
	joinRoom(guestThree, roomCode, 'guestThree');
})
.then(function() {
	return guestThree.wait(webdriver.until.elementLocated(webdriver.By.css(".share")), 8 * 1000)
})
.then(function(share) {
	share.click();
})

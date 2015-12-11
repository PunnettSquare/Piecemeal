module.exports = {
logTitle: function (browser) {
  browser.getTitle()
  .then(function(title) {
    console.log('Current Page Title: ' + title);
  });
 },

clickLink: function (link) {
  link.click();
 },

 handleFailure: function (err) {
  console.error('Something went wrong\n', err.stack, '\n');
  closeBrowser();
 },


 closeBrowser: function (browser) {
  browser.quit();
 },

 joinRoom : function (webdriver, browser, url, roomCode, name) {
  browser.get(url)
  return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".enterName")), 8 * 1000)
  .then(function(element) {
    return element.sendKeys(name);
  })
  .then(function() {
    return browser.findElement(webdriver.By.className('roomName'));
  })
  .then(function(input) {
    return input.sendKeys(roomCode);
  })
  .then(function() {
    return browser.findElement(webdriver.By.className('enterRoom'));
  })
  .then(function(button) {
    return button.click();
  })
 },

addDish : function (webdriver, browser, name, cost) {
  return browser.wait(webdriver.until.elementLocated(webdriver.By.css("input.dishName")), 8 * 1000)
  .then(function(element) {
    return element.sendKeys(name);
  })
  .then(function() {
    return browser.findElement(webdriver.By.className('dishCost'))
  })
  .then(function(elements) {
    return elements.sendKeys(cost);
  })
  .then(function() {
    return browser.findElement(webdriver.By.className('addDish'))
  })
  .then(function(element) {
    return element.click();
  })
 },

goToAddDishes : function (webdriver, browser) {
  return browser.findElement(webdriver.By.className('addDish'))
  .then(function(button) {
    return button.click()
  })
 },

goToAllDishes : function (webdriver, browser) { 
  return browser.findElement(webdriver.By.className('allDishes'))
  .then(function(button) {
    return button.click();
  })
 },

 shareDishes: function(webdriver, browser, number) {
  return browser.findElements(webdriver.By.className('share'))
  .then(function(buttons) {
    buttons.forEach(function(button, index) {
      if (index < number) {
        button.click();
      }
    })
  })
 },

 unshareDishes: function(webdriver, browser, number) {
  return browser.findElements(webdriver.By.className('unshare'))
  .then(function(buttons) {
    buttons.forEach(function(button, index) {
      if (index < number) {
        button.click();
      }
    })
  })
 } 
}

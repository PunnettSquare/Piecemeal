var _ = require('lodash');
var Promise = require('bluebird');
var i = 0;
module.exports = {
  logTitle: function(browser) {
    browser.getTitle()
      .then(function(title) {
        console.log('Current Page Title: ' + title);
      });
  },

  clickLink: function(link) {
    link.click();
  },

  handleFailure: function(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    closeBrowser();
  },

  closeBrowser: function(browser) {
    browser.quit();
  },

  makePiecemeal: function(browser, url) {
    return browser.get(url);
  },

  joinRoom: function(webdriver, browser, billCode, name) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".enterCode")), 8000)
      .then(function(element) {
        return element.sendKeys(billCode);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('enterRoom'));
      })
      .then(function(button) {
        return button.click();
      })
      .then(function() {
        return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".enterName")), 8000);
      })
      .then(function(input) {
        return input.sendKeys(name);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('enterRoom'));
      })
      .then(function(button) {
        return button.click();
      });
  },

  addDish: function(webdriver, browser, name, cost) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css("input.dishName")), 8000)
      .then(function(element) {
        return element.sendKeys(name);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('dishCost'));
      })
      .then(function(elements) {
        return elements.sendKeys(cost);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('addDish'));
      })
      .then(function(element) {
        return element.click();
      });
  },

  goToAddDish: function(webdriver, browser) {
    return browser.findElement(webdriver.By.className('button--addDish'))
      .then(function(button) {
        return button.click();
      });
  },

  goToAllDishes: function(webdriver, browser) {
    return browser.findElement(webdriver.By.className('allDishes'))
      .then(function(button) {
        return button.click();
      });
  },

  goToGuestBill: function(webdriver, browser) {
    return browser.findElement(webdriver.By.className('guestBill'))
      .then(function(button) {
        return button.click();
      });
  },

  goToHostBill: function(webdriver, browser) {
    return browser.findElement(webdriver.By.className('hostBill'))
      .then(function(button) {
        return button.click();
      });
  },

  goToPage: function(webdriver, browser, pageName) {

    browser.implicitly_wait;
    var pages = {
      allDishes: {
        connections: ['addDish']
      },
      addDish: {
        connections: ['allDishes', 'guestBill']

      },
      guestBill: {
        connections: ['allDishes', 'hostBill']

      },
      hostBill: {
        connections: ['guestBill']
      }
    };
    var alreadyOnPage = false;
    var routes = [];
    var findPageRoute = function(webdriver, browser, pageName, route, visited, currentPage) {
      route = route.slice();
      visited = visited.slice();
      visited.push(currentPage);
      var isDeadEnd = _.reduce(pages[currentPage].connections, function(deadEnd, connection) {
        if (_.indexOf(visited, connection) === -1) {
          return false;
        }
        return deadEnd;
      }, true);

      if (isDeadEnd) {
        return;

      }
      if (pages[currentPage].connections.indexOf(pageName) > -1) {
        route.push(pageName);
        routes.push(route);
      } else {
        for (var i = 0; i < pages[currentPage].connections.length; i++) {
          if (pages[currentPage]) {
            route.push(pages[currentPage].connections[i]);
            findPageRoute(webdriver, browser, pageName, route, visited, pages[currentPage].connections[i]);
            route.pop();
          }
        }
      }
    };
    return module.exports.determinePage(webdriver, browser)
      .then(function(currentPage) {
        if (currentPage === pageName) {
          alreadyOnPage = true;
        }
        return findPageRoute(webdriver, browser, pageName, [], [], currentPage);
      })
      .then(function() {

        var shortest = _.reduce(routes, function(shortest, route) {
          if (route.length < shortest.length) {
            return route;
          }
          return shortest;
        });
        if (alreadyOnPage) {
          return;
        } else {
          return Promise.each(shortest, function(navigationFunction, index, list) {
            return module.exports['goTo' + _.capitalize(navigationFunction)](webdriver, browser)
              .then(function() {
                if (shortest[index + 1]) {
                  return browser.wait(webdriver.until.elementLocated(webdriver.By.css('.' + shortest[index + 1])), 8000);
                } else {
                  return;
                }
              });
          });
        }
      });
  },

  determinePage: function(webdriver, browser) {
    return browser.getCurrentUrl()
      .then(function(url) {
        return url.split('/').pop();
      });
  },

  shareDishes: function(webdriver, browser, number) {
    return browser.findElements(webdriver.By.className('share'))
      .then(function(buttons) {
        buttons.forEach(function(button, index) {
          if (index < number) {
            button.click();
          }
        });
      });
  },

  unshareDishes: function(webdriver, browser, number) {
    return browser.findElements(webdriver.By.className('unshare'))
      .then(function(buttons) {
        buttons.forEach(function(button, index) {
          if (index < number) {
            button.click();
          }
        });
      });
  },
  makeRoom: function(webdriver, browser, name) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".createRoom")), 8000)
      .then(function(element) {
        return element.click();
      })
      .then(function() {
        return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".enterName")), 8000);
        return browser.findElement(webdriver.By.className('createRoom'));
      })
      .then(function(element) {
        return element.sendKeys(name);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('createBill'));
      })
      .then(function(element) {
        return element.click();
      })
      .then(function() {
        browser.sleep(4000);
        return browser.wait(webdriver.until.elementLocated(webdriver.By.css("strong.code")), 10000);
      })
      .then(function(element) {
        return element.getText();
      });
  },

  setTipAndTax: function(webdriver, browser, tip, tax) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".tipPercent")), 10000)
      .then(function(element) {
        return element.sendKeys(tip);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('taxPercent'));
      })
      .then(function(element) {
        return element.sendKeys(tax);
      })
      .then(function() {
        return browser.findElement(webdriver.By.className('sendBills'));
      })
      .then(function(button) {
        button.click();
      });
  },

  getTip: function(webdriver, browser) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".tipPercent")), 10000)
      .then(function(element) {
        return element.getText();
      });
  },

  getTax: function(webdriver, browser) {
    return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".taxPercent")), 10000)
      .then(function(element) {
        return element.getText();
      });
  },

  checkDuplication: function(webdriver, browser) {

    return module.exports.goToPage(webdriver, browser, 'allDishes')
      .then(function() {
        return browser.wait(webdriver.until.elementLocated(webdriver.By.css(".sharedBy")), 10000);
      })
      .then(function() {
        return browser.findElements(webdriver.By.className('sharedBy'));
      })
      .then(function(data) {
        return Promise.all(data.map(function(element) {
          return element.getText();
        }));
      })
      .then(function(sharedStrings) {
        var result;
        sharedStrings.forEach(function(string) {
          string.split('').splice(string.length - 11, 10);
          var words = string.split(' ');
          result = words.reduce(function(duplication, user, index, list) {
            if (duplication) {
              console.log('Duplication Found For User', user);
              return true;
            }
            if (user !== 'GuestOne' && user !== 'GuestTwo' && user !== 'GuestThree' && user !== 'Host') {
              return false;
            }
            var doubles = _.filter(list, function(word) {
              return word === user;
            });
            if (doubles.length > 1) {
              return true;
            }
            return false;
          }, false);
        });
        module.exports.closeBrowser(browser);
        console.log("Leaving room on iteration", i++);
        return result;
      });
  }
};

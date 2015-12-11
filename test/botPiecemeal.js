

"use strict";

// var emails = [], people = 
// ["Joel Leineke", "John Rutgers", "James Pease", "Cordell Hull", "Kate Shae", "Adam Dell", "Steven Welch", "Patrick Kantor", "Joseph Betit", "Tyler Davis", "Martin Fischer", "Adam Frandson", "Fernanda Leite", "Mikaela Ruef", "Robert Reidy", "Ken Stinson", "Cliff Thompson", "Hal Rolnick", "HT Tran", "Dustin DeVan", "Brendan Bechtel", "Mike Lewis", "Henry Nutt III", "John Kunz", "Klas Berghede", "Kyle Preston", "Raymond E Levitt", "William Howekamp", "Bob Joss", "John Koester", "Jim Hawk", "Chris Relf", "Clay Sell", "Joel Schimmer", "Ryan Burke", "Deval Shah", "Conway Marc", "Herrera, Jacob Andrew", "Fritch, Robert", "Kulic, Diana", "Thomas, Jordan", "Ramos, Chris", "Cameron Page", "Gil Herrera", "Phillip Albanese", "Billy Roemer", "Thomas Palmieri", "Carlos Suarez", "Patrick Paul", "Jerrald Titus", "Charles Choe", "Jose Escobedo", "Rob Michaelson", "Eduardo Texeira", "Kyle Grijalva", "Howard Matlock", "Ronald Yen", "Garth Herrema", "Fernando Carrillo", "Miguel Amezcua", "Michael Bruskin", "Michael Ghilotti", "Vincent Nigro", "Jerry Condon", "Keith Bizzack", "Matt Fine", "Tim Tanisaki", "Anthony Merrel", "Leo Mendoza", "Fred Smith", "Eric Carlson", "Zac Pacheco", "Mark Vanden", "Brian Bisi", "Gina Chase", "Kathy Grenzow", "Pike Reigert", "Eric Thatcher", "Jennifer Mitchell", "Jeff Yee", "Wes Dial", "Sue Toorean", "Brad Nystrom", "Dave Ng", "Art Pizzaro", "Alan Berger", "Emily Cohen", "Rick Espinoza", "Beau Blume", "Stacy Barton", "Sam Leow", "Heather Chierici", "James Mitchell", "Randy Ruby", "Ed Espina", "Tom Warner", "Bill DeLao", "Mario Corpuz", "Conor Thompson", "Elan Thibert", "Manuel Moya", "Erin Bowersox", "Chirath Karunathilake", "Alex Toth", "Ricardo Khan", "Dean Reed", "Christine Williams", "Robert Rios", "Daniel Garcia", "Reed McMackin", "Andrew Noll", "Curtis Weltz", "Kathy Streblow", "Brian Caris", "William Campbell V", "Scott Fairgrieve", "Paul Cocotis", "Bianca McCarron", "Paul Carnaur", "Jeff Lessman", "Chris Fassari", "Philip Sanchez", "Helio Montiero", "Daniel Macquindang", "Rusty Lutz", "Vince Haghiri", "John Gutierrez", "Thomas Donnelly", "Sal Perez", "Bob Alten", "Dave Williams", "Kathy Griffith", "Dominic Silvia", "Vince Campisi", "Paul Stith", "Brad Hardin", "Mark Breslin", "Dustin Gilbertson", "Lisa Reynolds", "Larry Domino", "Steve Shirley", "Joseph Brescia", "Rusty Hoseley", "Donald Gillis", "David Casey", "Bill Heathcott", "Taylor Hamblett", "Tom Griffith", "Dave Swartz", "Paul Aherne", "Sabine van der Sluis, P.E.", "Tony Jones", "Tiryaki, Nihan", "Beth Power", "Martin Meier", "Daniel B. McCausland", "Oscar Lang", "Jeremy Cortesio", "Hunter Bodycott", "Hurlbut, Bert", "Chris Miller", "Atul Khanzode", "James Pease", "Dean Reed", "Andrew Arnold", "Andrew Hosler", "Raul Rosales", "Todd Sutton", "Charmaine Tyrrell", "Kameron Burk", "Mike Almeida", "Jon Ball", "David Munro", "Dermot Fallon", "Brian Ichban", "Ben Harrison", "Victor Parra", "Christian Brown", "Jennifer Connolly", "Jeff Heck", "Leonard Bertolami", "Daniel Shirkey", "Chris Hernandez", "James Qualk", "Mike Aparicio", "Bill Winderning", "Casey Long", "Christopher Smith", "David Moore", "John Boncher", "Derek Rados", "Ann Hauer", "Chris Wike", "Kurt Tsai", "Steve Rule", "John Stanley", "Brian Jordan", "Kathleen Van Hoozer", "Brett Crail", "John Harrington", "Steve Hester", "Gordon Armstrong", "Richard Gabrinski", "James Troup", "Guy Smith", "Khalid Medhat", "Idy Wilson", "Briana Cleary", "Ken Conder", "Ann Orsolini", "Jefferson Jones", "Bill Hadinger", "Tim Fryxell", "Mike Hurley", "Kevin Soohoo", "Fred Nurisso", "Bruce Wright", "Bruce Bonar", "Mike Lescure", "Phill Phillips", "Zuhair Haddad", "Miguel Galarza", "Ben Sohn", "Victor Sanvido", "Jack Adams", "Tina Smith", "Andrew Pease", "Shaune", "Paul McLean", "Izaak Velez", "Stephen Ticktin", "Cliff Kunkel", "Dan Smith", "Rick Guzman", "Justin Chrisp", "James Farrell", "Joe Magnello", "Gary Kenyon", "Les Peterson", "Dave Barber", "William Faoro", "Sarah Larson", "David Green", "Todd Gates", "Stephane DENEROLLE"];

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
// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("div.password-container input")), 8 * 1000).then(function(element) {
// 	element.sendKeys('Construction1');
// });		

// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("input")), 8 * 1000).then(function(element) {
// 	console.log(element);
// 	element.click();
// });

// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("top-nav a.ng-scope")), 8 * 1000).then(function(element) {
// 	element.click();

// });

// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.linkText("Mike Lewis")), 8 * 1000).then(function(element) {
// 	element.click();

// 	hostBrowser.wait(webdriver, 5000).then(function() {
// 		hostBrowser.get(hostBrowser.getCurrentUrl());
// 	})
// });

// var name = ['Mike Lewis', 'Kyle Preston', 'Sarah Larson', 'Victor Sanvido', 'Scott Wilson', 'Ben Sohn',  'Cliff Thompson', 'Kameron Burk', 'John Gutierrez', 'Charmaine Tyrrell', 'Kevin Soohoo', 'Jose Escobedo', 'Daniel Shirkey', 'Paul McLean', 'Todd Sutton', 'Steve Shirley', 'James R. Kachick', 'Osayahde Nesbitt'];

// name.forEach(clickPerson);

// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("div.js-timeline-item-body-wrap div.no-fullstory")), 8 * 1000).then(function(element) {
// 	element.click();
// 	// do something to extract
// });

// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("'div.top-nav a.fill-parent'")), 8 * 1000).then(function(element) {
// 	element.click();
// 	// do something to extract
// });

// get the info
// hostBrowser.wait(webdriver.until.elementLocated(webdriver.By.css("iframe.email-display-body div")), 8 * 1000).then(function(element) {
// 	emails.push(element);
// 	console.dir(emails);
// });

// console.log(emails);
// hostBrowser.findElement(webdriver.By.className("ng-valid-email")).sendKeys('jackson@rhumbix.com');
// hostBrowser.findElement(webdriver.By.)
// hostBrowser.findElement(webdriver.By.name('btnG')).click();
// hostBrowser.wait(findTutsPlusLink, 2000).then(clickLink).then(logTitle).then(closeBrowser, handleFailure);


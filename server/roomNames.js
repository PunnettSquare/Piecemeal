// module.exports
var _ = require('lodash');

var words = ['bacon', 'bagel', 'basil', 'beans', 'beet', 'berry', 'bran', 'bread', 'cake', 'candy', 'chili', 'chips', 'corn', 'crab', 'cream', 'crepe', 'crust', 'curry', 'cloves', 'dairy', 'dill', 'dough', 'fig', 'fish', 'garlic', 'chia', 'fennel', 'parsley', 'flax', 'flour', 'fruit', 'fry', 'grain', 'grape', 'gravy', 'guava', 'herbs', 'ham', 'honey', 'ice', 'icing', 'jam', 'jelly', 'jug', 'juice', 'kale', 'kiwi', 'lemon', 'lime', 'loaf', 'lox', 'maize', 'mango', 'meat', 'melon', 'menu', 'milk', 'mint', 'mints', 'mochi', 'mug', 'munch', 'nosh', 'nut', 'oats', 'okra', 'olive', 'pasta', 'peach', 'pea', 'pear', 'pecan', 'pie', 'pilaf', 'pizza', 'plate', 'plum', 'pop', 'pork', 'rice', 'rye', 'sage', 'salad', 'salsa', 'salt', 'sauce', 'seeds', 'soda', 'soup', 'sour', 'sweet', 'soy', 'spicy', 'spoon', 'spork', 'spuds', 'squid', 'steak', 'straw', 'sugar', 'sushi', 'syrup', 'anise', 'cumin', 'spice', 'thyme', 'apple', 'apricot', 'avocado', 'banana', 'currant', 'cherry', 'coconut', 'date', 'durian', 'jujube', 'juniper', 'kumquat', 'lychee', 'orange', 'papaya', 'pumpkin', 'squash', 'tomato', 'gateau', 'latte', 'mocha', 'cafe', 'eggnog', 'butter', 'carrot', 'coffee', 'cupcake', 'pavlova', 'redbean', 'torte', 'almond', 'custard', 'eggtart', 'chai', 'caramel', 'pudding', 'fondant', 'jello', 'yogurt', 'trifle', 'treacle', 'sundae', 'sorbet', 'gelato', 'parfait', 'mousse', 'fudge', 'cashew', 'peanut', 'walnut', 'waffle', 'burrito', 'cobbler', 'kebab', 'ketchup', 'lasagna', 'mayo', 'taco', 'grits', 'omlet', 'cheese', 'cookie', 'hotdog', 'muffin', 'potato', 'radish', 'shrimp', 'turkey', 'alamode', 'alfalfa', 'alfredo', 'anchovy', 'baloney', 'bananas', 'berries', 'biscuit', 'brownie', 'burgers', 'catfish', 'chicken', 'cookies', 'cracker', 'dessert', 'glucose', 'granola', 'halibut', 'hotdogs', 'hotcake', 'muffins', 'pancake', 'peanuts', 'popcorn', 'poptart', 'raisins', 'ravioli', 'stirfry', 'tequila', 'walnuts', 'waffles'];

module.exports = words;
// _(words)
// .sample(words.length)
// .map(function(word) {
//   return word.toLowerCase();
// })
// .tap(function(array) {
//     _.times((300), function(n) {
//       array.push(_.camelCase([_.sample(words, 2)]));
//     });
//   })
// .filter(function(word, index, self) {
//   return word.length < 8;
// })
// .uniq()
// .value();

// module.exports = words;

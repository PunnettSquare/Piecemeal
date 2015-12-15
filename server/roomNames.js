// module.exports
var _ = require('lodash');

var words = ['bacon', 'bagel', 'basil', 'beans', 'beet', 'berry', 'bran', 'bread', 'cake', 'candy', 'chili', 'chips', 'corn', 'crab', 'cream', 'crepe', 'crust', 'curry', 'cloves', 'dairy', 'dill', 'dough', 'fig', 'fish', 'fenugreek', 'garlic', 'coriander', 'cinnamon', 'chia', 'fennel', 'parsley', 'flax', 'flour', 'fruit', 'fry', 'grain', 'grape', 'gravy', 'guava', 'herbs', 'ham', 'honey', 'ice', 'icing', 'jam', 'jelly', 'jug', 'juice', 'kale', 'kiwi', 'lemon', 'lime', 'loaf', 'lox', 'maize', 'mango', 'meat', 'melon', 'menu', 'milk', 'mint', 'mints', 'mochi', 'mug', 'munch', 'nosh', 'nut', 'oats', 'okra', 'olive', 'pasta', 'peach', 'pea', 'pear', 'pecan', 'pie', 'pilaf', 'pizza', 'plate', 'plum', 'pop', 'pork', 'rice', 'rye', 'sage', 'salad', 'salsa', 'salt', 'sauce', 'seeds', 'soda', 'soup', 'sour', 'sweet', 'soy', 'spicy', 'spoon', 'spork', 'spuds', 'squid', 'steak', 'straw', 'sugar', 'sushi', 'syrup', 'anise', 'cumin', 'spice', 'thyme', 'apple', 'apricot', 'avocado', 'banana', 'bilberry', 'blueberry', 'currant', 'cherry', 'cherimoya', 'coconut', 'cranberry', 'date', 'durian', 'gojiberry', 'raisin', 'jackfruit', 'jambul', 'jujube', 'juniper', 'kumquat', 'loquat', 'lychee', 'honeydew', 'mulberry', 'nectarine', 'orange', 'mandarine', 'tangerine', 'papaya', 'persimmon', 'prune', 'pineapple', 'pumpkin', 'pomelo', 'quince', 'raspberry', 'rambutan', 'satsuma', 'starfruit', 'squash', 'tamarillo', 'tamarind', 'tomato', 'amandine', 'angelcake', 'applepie', 'babka', 'banh', 'black bun', 'blackforest', 'gateau', 'bundt', 'butter', 'cake balls', 'cake pop', 'carrot', 'cheesecake', 'chocolate', 'coffee', 'cupcake', 'fruitcake', 'gingerbread', 'jaffacake', 'ladyfinger', 'lamington', 'meringue', 'pavlova', 'poundcake', 'redbean', 'redvelvet', 'taiyaki', 'tiramisu', 'torte', 'almond', 'blacksesame', 'custard', 'jalebi', 'kulfi', 'lassi', 'laksa', 'eggtart', 'grassjelly'];

module.exports =
  _(words)
  .sample(words.length)
  // .map(function(word) {
  //   return word.toLowerCase();
  // })
  .tap(function(array) {
    _.times((300), function(n) {
      array.push(_.kebabCase([_.sample(words, 2)]));
    });
  })
  .filter(function(word, index, self) {
    return word.length < 15;
  })
  .uniq().value();

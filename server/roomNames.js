// module.exports
var _ = require('lodash');

var words = ['bacon', 'bagel', 'basil', 'beans', 'beet', 'berry', 'bran', 'bread', 'cake', 'candy', 'chili', 'chips', 'corn', 'crab', 'cream', 'crepe', 'crust', 'curry', 'cloves', 'dairy', 'dill', 'dough', 'fig', 'fish', 'fenugreek', 'garlic', 'coriander', 'cinnamon', 'chia', 'fennel', 'parsley', 'flax', 'flour', 'fruit', 'fry', 'grain', 'grape', 'gravy', 'guava', 'herbs', 'ham', 'honey', 'ice', 'icing', 'jam', 'jelly', 'jug', 'juice', 'kale', 'kiwi', 'lemon', 'lime', 'loaf', 'lox', 'maize', 'mango', 'meat', 'melon', 'menu', 'milk', 'mint', 'mints', 'mochi', 'mug', 'munch', 'nosh', 'nut', 'oats', 'okra', 'olive', 'pasta', 'peach', 'pea', 'pear', 'pecan', 'pie', 'pilaf', 'pizza', 'plate', 'plum', 'pop', 'pork', 'rice', 'rye', 'sage', 'salad', 'salsa', 'salt', 'sauce', 'seeds', 'soda', 'soup', 'sour', 'sweet', 'soy', 'spicy', 'spoon', 'spork', 'spuds', 'squid', 'steak', 'straw', 'sugar', 'sushi', 'syrup', 'anise', 'cumin', 'spice', 'thyme', 'apple', 'apricot', 'avocado', 'banana', 'bilberry', 'blueberry', 'currant', 'cherry', 'coconut', 'cranberry', 'date', 'durian', 'jackfruit', 'jujube', 'juniper', 'kumquat', 'lychee', 'honeydew', 'mulberry', 'nectarine', 'orange', 'mandarine', 'tangerine', 'papaya', 'persimmon', 'pineapple', 'pumpkin', 'raspberry', 'starfruit', 'squash', 'tomato', 'amandine', 'angelcake', 'applepie', 'blackforest', 'gateau', 'latte', 'espresso', 'americano', 'mocha', 'cafe', 'eggnog', 'butter', 'carrot', 'cheesecake', 'chocolate', 'coffee', 'cupcake', 'fruitcake', 'gingerbread', 'lamington', 'meringue', 'pavlova', 'poundcake', 'redbean', 'tiramisu', 'torte', 'almond', 'blacksesame', 'custard', 'eggtart', 'grassjelly', 'chai', 'irishcoffee', 'darkroast', 'frenchpress', 'peaberry', 'caramel', 'pudding', 'doughnut', 'fondant', 'frosting', 'icecream', 'jello', 'marzipan', 'yogurt', 'trifle', 'treacle', 'sundae', 'sorbet', 'gelato', 'parfait', 'mousse', 'fudge', 'grapefruit', 'strawberry', 'watermelon', 'chestnut', 'cashew', 'hazelnut', 'peanut', 'walnut', 'waffle', 'burrito', 'buckwheat', 'broccoli', 'cilantro', 'cobbler', 'cucumber', 'hashbrown', 'guacamole', 'greentea', 'jellybean', 'kebab', 'ketchup', 'lasagna', 'lemonade', 'lollipop', 'mayo', 'marmalade'];

module.exports = _(words)
  .sample(words.length)
  // .map(function(word) {
  //   return word.toLowerCase();
  // })
  .tap(function(array) {
    _.times((300), function(n) {
      array.push(_.camelCase([_.sample(words, 2)]));
    });
  })
  .filter(function(word, index, self) {
    return word.length < 11;
  })
  .uniq()
  .value();

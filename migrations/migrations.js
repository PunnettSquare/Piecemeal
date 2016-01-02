exports.up = function(knex, Promise) {

  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username');
      table.string('venmoUsername');
      table.string('phone');
      table.string('email');
      // table.timestamps();
    }),

    knex.schema.createTable('events', function(table) {
      table.increments('id').primary();
      table.string('code');
      table.decimal('taxPercent');
      table.decimal('tipPercent');
      table.decimal('feePercent');
      table.decimal('discountPercent');
      table.boolean('billSent');
    }),

    knex.schema.createTable('dishes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.decimal('cost');
      table.integer('event_id')
        .references('id')
        .inTable('events');
      // table.dateTime('postDate');
    }),

    knex.schema.createTable('usersJoinEvents', function(table) {
      table.increments('id').primary();
      table.boolean('status');
      table.boolean('host');
      table.integer('event_id')
        .references('id')
        .inTable('events');
      table.integer('user_id')
        .references('id')
        .inTable('users');
      // table.dateTime('postDate');
    }),

    knex.schema.createTable('usersJoinDishes', function(table) {
      table.increments('id').primary();
      table.integer('dish_id')
        .references('id')
        .inTable('dishes');
      table.integer('user_id')
        .references('id')
        .inTable('users');
      // table.dateTime('postDate');
    }),

    knex.schema.createTable('appSettings', function(table) {
      table.increments('id').primary();
      table.integer('wordIndex');
      table.integer('counter');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('usersJoinDishes'),
    knex.schema.dropTable('usersJoinEvents'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('events'),
    knex.schema.dropTable('dishes')
  ]);
};

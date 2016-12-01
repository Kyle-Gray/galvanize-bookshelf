'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    //id
    table.increments('id');
    //first_name
    table.string('first_name').notNullable().defaultTo('');
    //last_name
    table.string('last_name').notNullable().defaultTo('');
    //email
    table.string('email').notNullable().unique();
    //hashed_password
    table.specificType('hashed_password', 'char(60)').notNullable();
    //created_at
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    //updated_at
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
return knex.schema.dropTable('users');
};

'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table){
    //id
    table.increments('id');
    //book_id
    table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE').index();
    //user_id
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    //created_at
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    //updated_at
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};

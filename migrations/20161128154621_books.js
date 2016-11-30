'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    //id
    table.increments();
    //title
    table.string('title').notNullable().defaultTo('');
    //author
    table.string('author').notNullable().defaultTo('');
    //genre
    table.string('genre').notNullable().defaultTo('');
    //description
    table.text('description').notNullable().defaultTo('');
    //cover_url
    table.text('cover_url').notNullable().defaultTo('');
    //created_at
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    //updated_at
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};

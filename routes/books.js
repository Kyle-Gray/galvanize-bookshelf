'use strict';

const express = require('express');
const knex = require('../knex');
// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      const camelizedBooks = humps.camelizeKeys(books);
      res.set('content-type', 'application/json');
      res.send(camelizedBooks);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (_req, res, next) => {
  knex('books')
    .where('id', _req.params.id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }
      const camelizedBooks = humps.camelizeKeys(books);
      res.set('content-type', 'application/json');
      res.send(camelizedBooks);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const decamelizedBook = humps.decamelizeKeys(req.body);
  knex('books')
  .insert({
    title: decamelizedBook.title,
    author: decamelizedBook.author,
    genre: decamelizedBook.genre,
    description: decamelizedBook.description,
    cover_url: decamelizedBook.cover_url
  }, ['id', 'title', 'author', 'genre', 'description', 'cover_url'])
  .then((books) => {
    res.send(humps.camelizeKeys(books[0]));
  })
  .catch((err) => {
    next(err);
  });

});

router.patch('/books/:id', (req, res, next) => {
  const decamelizedBook = humps.decamelizeKeys(req.body);
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((book) => {
    if(!book){
      return next();
    }
    return knex('books')
      .update({
        title: decamelizedBook.title,
        author: decamelizedBook.author,
        genre: decamelizedBook.genre,
        description: decamelizedBook.description,
        cover_url: decamelizedBook.cover_url
      }, ['id', 'title', 'author', 'genre', 'description', 'cover_url'])
      .where('id', req.params.id);
  })
  .then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/books/:id', (req, res, next) => {
  let book;
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((row) => {
    if(!row) {
      return next();
    }
    book = row;
    return knex('books')
    .del()
    .where('id', req.params.id);
  })
    .then(() => {
    delete book.id;
    res.send(humps.camelizeKeys(book));
})
  .catch((err) => {
    next(err);
  });
});









module.exports = router;

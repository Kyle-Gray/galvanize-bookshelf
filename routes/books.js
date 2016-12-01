'use strict';

const express = require('express');
const knex = require('../knex');
// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');
const boom = require('boom');

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

router.get('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)){
    return next();
  }
  knex('books')
    .where('id', req.params.id)
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
  const bookObj = {
    title: decamelizedBook.title,
    author: decamelizedBook.author,
    genre: decamelizedBook.genre,
    description: decamelizedBook.description,
    cover_url: decamelizedBook.cover_url
  };
  if(req.body.title === undefined){
     next(boom.create(400, "Title must not be blank"));
  } else if(bookObj.author === undefined){
    next(boom.create(400, "Author must not be blank"));
  } else if(bookObj.genre === undefined){
    next(boom.create(400, "Genre must not be blank"));
  } else if (bookObj.description === undefined){
    next(boom.create(400, "Description must not be blank"));
  }else if (bookObj.cover_url === undefined){
    next(boom.create(400, "Cover URL must not be blank"));
  }
  knex('books')
  .insert(bookObj, ['id', 'title', 'author', 'genre', 'description', 'cover_url'])
  .then((books) => {
    res.set('Content-Type', 'text/plain');
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
    next(boom.create(404, "Not Found"));
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
    next(boom.create(404, "Not Found"));
  });
});


module.exports = router;

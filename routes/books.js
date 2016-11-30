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
  const camelizedBook = humps.camelizeKeys(req.body);


  
});









module.exports = router;

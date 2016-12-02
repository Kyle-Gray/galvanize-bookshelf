'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
// const cookie = require('cookie-session');
const knex = require('../knex');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const {
    camelizeKeys,
    decamelizeKeys
} = require('humps');

// YOUR CODE HERE
router.get('/token', function(req, res, next){
  if (!req.cookies.token) {
      res.status(200).send(false);
    } else {
      res.status(200).send(true);
    }
  });




router.post('/token', function(req, res, next) {
    const {
        email,
        password
    } = req.body;
    return knex('users')
        .where('email', email)
        .first()
        .then(function(result) {
            if (!result) {
                return next(boom.create(400, 'Bad email or password'));
            }
            bcrypt.compare(password, result.hashed_password, function(err, ress) {
                if (ress) {
                    return knex('users')
                        .select('id', 'email', 'first_name', 'last_name')
                        .where('email', email)
                        .first()
                        .then(results => {
                            // console.log(results);
                            let token = jwt.sign({ email: email, password: res.hashed_password }, process.env.JWT_SECRET);
                            // console.log(token);
                            res.cookie('token', token, { httpOnly: true });
                            res.send(camelizeKeys(results));
                        })
                        .catch((err)=> {
                        return next(boom.create(400, 'Bad email or password'));
                        });
                } else {
                  return next(boom.create(400, 'Bad email or password'));
                }
            });
        });
});

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.status(200).send(true);
});


module.exports = router;

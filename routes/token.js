'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const cookieParser = require('cookie-parser');
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
            console.log(result);
            var hash = bcrypt.hashSync(password, 8);
            bcrypt.compare(password, hash, function(err, res) {
                if (res) {
                    return knex('users')
                        .select('id', 'email', 'first_name', 'last_name')
                        .where('email', email)
                        .first()
                        .then(results => {
                            console.log('made it!');
                            // let token = jwt.sign({ email: email, password: res.hashed_password }, process.env.JWT_SECRET);
                            // res.cookie('token', token, { httpOnly: true });
                            // res.send(camelizeKeys(results));
                        });
                }
            });
            console.log('made it to then end');
        });
});




module.exports = router;

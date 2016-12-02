//
// // Matts Code
//
// 'use strict';
//
// const express = require('express');
// const knex = require('../knex');
// const boom = require('boom');
// const {
//   camelizeKeys,
//   decamelizeKeys
// } = require('humps');
// // eslint-disable-next-line new-cap
// const router = express.Router();
// var bcrypt = require('bcrypt');
// const saltRounds = 10;
//
//
//   if (!email || !email.trim()) {
//     next(boom.create(400, 'Email must not be blank'));
//     return;
//   }
//
//   knex('users')
//     .where('email', email)
//     .then(data => {
//       if (data.length !== 0) {
//         next(boom.create(400, 'Email already exists'));
//       }
//     });
//
//
//   if (!password || password.length < 8) {
//     next(boom.create(400, 'Password must be at least 8 characters long'));
//     return;
//   }
//
//   bcrypt.genSalt(saltRounds, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       var hashed_password = hash;
//
//       const newUser = {
//         first_name,
//         last_name,
//         email,
//         hashed_password
//       };
//
//       return knex('users')
//         .insert(newUser, '*')
//         .then(data => {
//           return knex('users')
//             .select('id', 'first_name', 'last_name', 'email')
//             .where('email', email)
//             .then(output => {
//               res.send(camelizeKeys(output[0]));
//             });
//         })
//         .catch(err => {
//           next(err);
//         });
//
//     });
//   });
// });
//
// module.exports = router;

'use strict';
const express = require('express');
var bcrypt = require('bcrypt');
var db = require('../knexfile.js')['development', 'test'];
var knex = require('knex')(db);
const boom = require('boom');
const {camelizeKeys, decamelizeKeys} = require('humps');

// eslint-disable-next-line new-cap
const route = express.Router();

route.post('/users', (req, res, next) => {
console.log(req.body);
var hash = bcrypt.hashSync(req.body.password, 8);
  knex('users')
  .where('email', req.body.email)
  .first()
  .then(function (results) {
    console.log('made it here 1');
    console.log(results);
    if (!results) {
      console.log('made it here 2');
      knex('users')
        .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: hash
      }, '*')
        .then(function() {
          console.log('made it here 3');
          knex('users')
            .select('id', 'first_name', 'last_name', 'email')
            .where('email', req.body.email)
            .then(r => {
              console.log('made it here 4');
              console.log(camelizeKeys(r[0]));
              res.send(camelizeKeys(r[0]));
            })
            .catch(e => {
              console.log('this ran');
              console.log(e);
              next(e);
            });
        })
        .catch(function (err) {
          console.log('this was the error');
          console.log(err);
          next(err);
        });
    } else {
      console.log('last error possible');
      res.status(400).send('User Already Exists');
    }
  });
});

// route.use(function (req,res,next) {
//   if (!req.user) {
//     res.sendStatus(401);
//   } else {
//     next();
//   }
// });

route.get('/users',function (req,res,next) {
  knex('users')
  .orderBy('id')
  .then((users) => {
    const camelizedUsers = camelizeKeys(users);
    res.set('content-type', 'application/json');
    res.send(camelizedUsers);
  })
  .catch(function (err) {
    next(err);
  });
});
// // YOUR CODE HERE
// route.post('/users', (req,res,next) => {
//   const {
//     first_name,
//     last_name,
//     email,
//     password,
//   } = decamelizeKeys(req.body);
//
//   if (!email || !email.trim()) {
//     next(boom.create(400, 'Email must not be blank'));
//     return;
//   }
//
//   knex('users')
//     .where('email', email)
//     .then(data => {
//       if (data.length !== 0) {
//         next(boom.create(400, 'Email already exists'));
//       }
//     });
//
//
//   if (!password || password.length < 8) {
//     next(boom.create(400, 'Password must be at least 8 characters long'));
//     return;
//   }
//
//   bcrypt.genSalt(saltRounds, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       var hashed_password = hash;
//
//       const newUser = {
//         first_name,
//         last_name,
//         email,
//         hashed_password
//       };
//
//       return knex('users')
//         .insert(newUser, '*')
//         .then(data => {
//           return knex('users')
//             .select('id', 'first_name', 'last_name', 'email')
//             .where('email', email)
//             .then(output => {
//               res.send(camelizeKeys(output[0]));
//             });
//         })
//         .catch(err => {
//           next(err);
//         });
//
//     });
//   });
//
// // route.get('/:username', function (req,res,next) {
// //   knex('users')
// //   .select('username')
// //   .where({username: req.params.username})
// //   .first()
// //   .then(function (results) {
// //     if (results) {
// //       res.send(results);
// //     } else {
// //       res.sendStatus(404);
// //     }
// //   })
// //   .catch(function (err) {
// //     next(err);
// //   });
// // });
//
// // route.use(function (req,res,next) {
// //   if (!req.user.isAdmin) {
// //     res.sendStatus(401);
// //   } else {
// //     next();
// //   }
// // });
route.delete('/users/:id', function(req,res,next) {
  knex('users')
  .where({'id': req.params.id})
  .del()
  .then(function () {
    res.sendStatus(200);
  })
  .catch(function (err) {
    next(err);
  });
});

module.exports = route;

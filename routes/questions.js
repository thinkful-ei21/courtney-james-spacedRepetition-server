'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
    const userId = req.user.id;

    User.findById(userId).then(user => {
        res.json(user.questions[user.head]);
    });
});

router.post('/', (req, res, next) => {
    let {answer} = req.body;

    answer = answer.toLowerCase();
    // console.log(req.user.questions[0]);

    User.findById(req.user.id)
        .then(user => {
            if (user.questions[user.head].question.description === answer) {
              let current = user.questions[user.head],
                  end = user.questions[user.tail];

              current.prev = end;
              end.next = current;

              user.head = current.next;
              user.tail = end.next;

              current.prev = null;
              end.next = null;

              //reseting tail to be current question that was answer (putting question at back of the list)
              // current.prev = end;
              // end.next = current;
              // user.tail = user.head;

              //reseting head to next question
              // user.head = current.next; // same as:  user.head = user.head + 1
              // current.prev = null;
              // end.next = null;


              // return res.send({msg: "Correct"});
              return user.save();
            }
            else {
              return res.send({msg: "Incorrect"});
            }
            // const firstItem = user.questions.shift();
            // user.questions.push(firstItem);
            // return user.save();
        })
        .then(user => res.json(user))
        .catch(err => next(err));
});

module.exports = router;

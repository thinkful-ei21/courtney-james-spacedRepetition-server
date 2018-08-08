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
        res.json(user.questions[0]);
    });
});

router.post('/', (req, res, next) => {
    let {answer} = req.body;

    answer = answer.toLowerCase();
    // console.log(req.user.questions[0]);

    User.findById(req.user.id)
        .then(user => {
            if (user.questions[0].description === answer) {
              return res.send({msg: "Correct"});
            }
            else {
              return res.send({msg: "Incorrect"});
            }
            // const firstItem = user.questions.shift();
            // user.questions.push(firstItem);
            // return user.save();
        })
        // .then(user => res.json(user.questions[0].description));
        .catch(err => next(err));
});

module.exports = router;

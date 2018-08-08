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
    console.log(req.user.questions);

    User.findById(userId).then(user => {
        res.json(user.questions[0]);
    });

    // res.json(req.user.questions[0]);
});

router.post('/', (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            const firstItem = user.questions.shift();
            user.questions.push(firstItem);
            return user.save();
        })
        .then(user => res.json(user.questions[0]));
});

module.exports = router;

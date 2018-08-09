'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const User = require('../models/users');
const Question = require('../models/question').model;

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
    const userId = req.user.id;

    User.findById(userId)
      .populate('questions.question')
      .then(user => {
        res.json(user.questions[user.head]);
    });
});

router.post('/', (req, res, next) => {
    let {answer} = req.body;

    answer = answer.toLowerCase();

    User.findById(req.user.id)
        .populate('questions.question')
        .then(user => {
          console.log(user);

            let current = user.head,
                tail = user.tail,
                // current = head,
                next = null,
                nextNext = null,
                  // current = user.questions[head],
                  // end = user.questions[user.tail];
                response = '';

            // console.log(head, current);
            console.log(`tail: ${tail}, current: ${current}, questions: ${JSON.stringify(user.questions)}`);
            if (user.questions[current].question.description === answer) {
              // position = user.tail;
              // end.next = head;
              // head = current.next;
              // current.next = null;
              // tail = head;

              console.log(`current: ${current}`);

              user.questions[tail].next = current;
              user.tail = current;
              user.head = user.questions[current].next;
              user.questions[current].next = null;

              response = 'Correct';
            }
            else {
              // position = 1;
              next = user.questions[current].next;
              user.head = next;
              nextNext = user.questions[next].next;

              user.questions[next].next = current;
              user.questions[current].next = nextNext;

              response = 'Incorrect';

            }

            // user.head = current.next;

            // let temp = current;
            // for (let i=0; i < position; i++) {
            //   let index = temp.next;
            //
            //   temp = user.questions[index];
            // }
            // console.log(temp, temp.next);

            // current.next = !temp.next ? null : temp.next;
            // temp.next = head;



            user.save();
            return response;






            // const firstItem = user.questions.shift();
            // user.questions.push(firstItem);
            // return user.save();
        })
        // .then(user => res.json(user))
        .then(response => res.send({msg: response}))
        .catch(err => next(err));
});

module.exports = router;

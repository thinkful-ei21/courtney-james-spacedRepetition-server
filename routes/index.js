const express = require('express');
const routeApp = express();

const users = require('./users');

////////////////////// ROUTES //////////////////////////

// sanity check
routeApp.get('/', (req, res, next) => {
  res.send({msg: "Server is up and running!"});
})


// routeApp.use('/user', users);


////////////////// ERROR HANDLERS /////////////////////

//Custom [404: Not Found] error handler
routeApp.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Custom error handler
routeApp.use((err, req, res, next) => {
    // console.error(err);
    if(err.status) {
        const errBody = {
            ...err,
            message: err.message
        }
        res.status(err.status).json(errBody);
    } else {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

module.exports = routeApp;

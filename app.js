const { timeStamp } = require('console');
const express = require('express');
const morgan = require('morgan');

let app = express();
app.use(morgan('dev'));


// TEST ROUTE
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
})

app.get('/health', (req, res) => {
    res.json({
        status: 'Ok',
        timeStamp: new Date().toISOString()
    })
})



module.exports = app;
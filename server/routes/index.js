const express = require('express');
const userRoute = require('./user')
const loginRoute = require('./login')

const app = express();

//APPLICATION ROUTES
app.use('/users', userRoute)

app.use('/login', loginRoute)

module.exports = app
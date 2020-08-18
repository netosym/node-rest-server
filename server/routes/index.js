const express = require('express');
const userRoute = require('./user')
const loginRoute = require('./login')
const categoryRouter = require('./category');

const app = express();

//APPLICATION ROUTES
app.use('/users', userRoute)

app.use('/login', loginRoute)

app.use('/categories', categoryRouter)

module.exports = app
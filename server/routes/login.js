const express = require('express');
const bcript = require('bcrypt');
const User = require('../models/user');

const loginRouter = express();

loginRouter.post('/', async (req, res) => {
  res.json({
    ok: true,
  });
});

module.exports = loginRouter;

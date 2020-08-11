const express = require('express');
const bcript = require('bcrypt');
const User = require('../models/user');

const loginRouter = express();

loginRouter.post('/', async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser) {
      return res.status(400).json({
        ok: false,
        message: 'Incorrect (username) or password',
      });
    }

    if (!bcript.compareSync(req.body.password, foundUser.password)) {
      return res.status(400).json({
        ok: false,
        message: 'Incorrect username or (password)',
      });
    }

    res.json({
      ok: true,
      user: foundUser,
      token: '213',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = loginRouter;

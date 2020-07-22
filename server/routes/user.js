const express = require('express');
const bcript = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const userRouter = express();

userRouter.get('/', (req, res) => {
  res.json('Welcome to Users');
});

userRouter.post('/', async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcript.hashSync(req.body.password, 10),
      role: req.body.role,
    });

    const savedUser = await user.save();
    // savedUser.password = null
    res.json({
      ok: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

userRouter.put('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let filteredBody = _.pick(req.body, [
      'name',
      'email',
      'image',
      'role',
      'state',
    ]);
    const updatedUser = await User.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });
    if(!updatedUser) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      })
    }
    res.json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

userRouter.delete('/:id', async (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

module.exports = userRouter;

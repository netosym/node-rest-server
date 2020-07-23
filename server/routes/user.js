const express = require('express');
const bcript = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const userRouter = express();

userRouter.get('/', async (req, res) => {
  try {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    const foundUsers = await User.find({}, 'name email role google state image').skip(from).limit(limit).exec();
    // const count = await User.count({name: 'Elvira'})
    const count = foundUsers.length;
    res.json({
      ok: true,
      users: foundUsers,
      count,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
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
    if (!updatedUser) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
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

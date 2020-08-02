const express = require('express');
const bcript = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');

const userRouter = express();

//GET REQUEST
userRouter.get('/', async (req, res) => {
  try {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    const foundUsers = await User.find({ state: true })
      .skip(from)
      .limit(limit)
      .exec();
    const count = await User.countDocuments({ state: true });
    // const count = foundUsers.length;
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

//POST REQUEST
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

//PUT REQUEST
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

//DELETE REQUEST
userRouter.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const removedUser = await User.findByIdAndUpdate(
      id,
      { state: false },
      {
        new: true,
      }
    );
    if (!removedUser) {
      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }
    res.json({
      ok: true,
      removedUser,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = userRouter;

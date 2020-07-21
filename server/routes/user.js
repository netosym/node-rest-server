const express = require('express');
const User = require('../models/user')

const userRouter = express();

userRouter.get('/', (req, res) => {
  res.json('Welcome to Users');
});

userRouter.post('/', async (req, res) => {

  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    })
  
    const savedUser = await user.save()
    res.json({
      ok:true,
      user: savedUser
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error
    })
  }

});

userRouter.put('/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

userRouter.delete('/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

module.exports = userRouter;

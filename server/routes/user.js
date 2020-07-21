const express = require('express')

const userRouter = express()

userRouter.get('/', (req, res) => {
  res.json('Welcome to Users');
});

userRouter.post('/', (req, res) => {
  let body = req.body;
  if (body.nombre) {
    res.json({ body });
  } else {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario',
    });
  }
});

userRouter.put('/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

userRouter.delete('/:id', (req, res) => {
  let id = req.params.id
  res.json({
    id,
  });
})

module.exports = userRouter
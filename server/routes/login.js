const express = require('express');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

    let token = jwt.sign(
      {
        user: foundUser,
      },
      process.env.SEED,
      { expiresIn: process.env.TOKEN_EXP }
    );

    res.json({
      ok: true,
      user: foundUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error,
    });
  }
});

//Configuracion de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true,
  };
}

loginRouter.post('/google', async (req, res) => {
  try {
    const token = req.body.idtoken;
    const googleUser = await verify(token);
    const foundUser = await User.findOne({ email: googleUser.email });

    //Verificar si existe un usuario en la base de datos identificado por google
    if (foundUser) {

      if (foundUser.google === false) {
        return res.status(400).json({
          ok: false,
          message: 'You should use normal authentication',
        });

      } else {

        let token = jwt.sign(
          {
            user: foundUser,
          },
          process.env.SEED,
          { expiresIn: process.env.TOKEN_EXP }
        );
        res.json({
          ok: true,
          user: googleUser,
          token,
        });
      }

    } else { //Si es la primera vez que se registra por google

      const user = new User({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.image,
        google: true,
        password: ':)',

      });

      const savedUser = await user.save();
      let token = jwt.sign(
        {
          user: savedUser,
        },
        process.env.SEED,
        { expiresIn: process.env.TOKEN_EXP }
      );
      res.json({
        ok: true,
        user: savedUser,
        token,
      });
    }
  } catch (error) {
    res.status(403).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = loginRouter;

const express = require('express');
const fs = require('fs');
const path = require('path');
const { authToken, authImageToken } = require('../middlewares/auth');

const imageRouter = express();

imageRouter.get('/:type/:image', authImageToken, (req, res) => {
  const type = req.params.type;
  const image = req.params.image;
  const imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}`);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
  }
});

module.exports = imageRouter;

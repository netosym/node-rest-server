const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const User = require('../models/user');

const uploadRouter = express();

uploadRouter.use(fileUpload({ useTempFiles: true }));

uploadRouter.put('/:type/:id', async (req, res) => {
  try {
    const type = req.params.type;
    const id = req.params.id;
    if (!req.files) {
      return res.status(400).json({
        ok: false,
        message: 'No files were uploaded',
      });
    }
    const validTypes = ['users', 'products'];
    if (validTypes.indexOf(type) === -1) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid Type, valid types: ' + validTypes.join(', '),
        type,
      });
    }
    //Obtener el archivo a mandar
    let file = req.files.file;
    //Extension del archivo mandado
    let extension = file.name.split('.')[1];
    //Extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    //Validar extension
    if (validExtensions.indexOf(extension) === -1) {
      return res.status(400).json({
        ok: false,
        message:
          'Invalid Extension, valid extensions: ' + validExtensions.join(', '),
        extension: extension,
      });
    }
    //Cambiar nombre al archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //Mover archivo
    await file.mv(
      path.resolve(__dirname + `../../../uploads/${type}/${fileName}`)
    );
    res.json({
      ok: true,
      message: 'Image uploaded',
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = uploadRouter;

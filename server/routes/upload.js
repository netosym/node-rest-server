const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const Product = require('../models/product');

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
    
    //Validar tipo
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
    await file.mv(path.resolve(__dirname, `../../uploads/${type}/${fileName}`));

    //Actualizar imagen del usuario o producto
    if(type === 'users') {
      await updateUserImage(id, res, fileName);
    } else if(type === 'products') {
      await updateProductImage(id, res, fileName);
    }
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//Actualiza la imagen del usuario
async function updateUserImage(id, res, fileName) {
  try {
    const user = await User.findById(id);
    if (!user) {
      deleteFile(fileName, 'users');
      return res.status(400).json({
        ok: false,
        message: 'User not found',
      });
    }
    deleteFile(user.image, 'users');
    user.image = fileName;
    const savedUser = await user.save();
    res.json({
      ok: true,
      user: savedUser,
      image: fileName,
    });
  } catch (error) {
    deleteFile(fileName, 'users');
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
}

//Actualiza la imagen del producto
async function updateProductImage(id, res, fileName) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      deleteFile(fileName, 'products');
      return res.status(400).json({
        ok: false,
        message: 'Product not found',
      });
    }
    deleteFile(product.image, 'products');
    product.image = fileName;
    const savedProduct = await product.save();
    res.json({
      ok: true,
      product: savedProduct,
      image: fileName,
    });
  } catch (error) {
    deleteFile(fileName, 'products');
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
}

function deleteFile(fileName, type) {
  let urlPath = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
  if (fs.existsSync(urlPath)) {
    fs.unlinkSync(urlPath);
  }
}

module.exports = uploadRouter;

const express = require('express');
const Product = require('../models/product');
const _ = require('underscore');
const { authToken } = require('../middlewares/auth');

const productRouter = express();

//GET REQUEST - All products
productRouter.get('/', authToken, async (req, res) => {
  try {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;
    const foundProducts = await Product.find({ available: true })
      .skip(from)
      .limit(limit)
      .sort({ name: 1 })
      .populate('category', 'name')
      .populate('user', 'name email')
      .exec();
    const count = await Product.countDocuments({});
    res.json({
      ok: true,
      products: foundProducts,
      count,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//GET REQUEST - Products ID
productRouter.get('/:id', authToken, async (req, res) => {
  try {
    const id = req.params.id;
    const productId = await Product.findById(id)
      .populate('category', 'name')
      .populate('user', 'name email')
      .exec();
    if (!productId) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found',
      });
    }
    res.json({
      ok: true,
      product: productId,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//POST REQUEST - Search a product
productRouter.get('/search/:word', authToken, async (req, res) => {
  try {
    const word = req.params.word;
    const regExp = new RegExp(word, 'i')
    const foundProduct = await Product.find({name: regExp})
      .populate('category', 'name')
      .populate('user', 'name email')
      .exec();
    const count = await Product.countDocuments({name: regExp});
    res.json({
      ok: true,
      products: foundProduct,
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
productRouter.post('/', authToken, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      priceUnit: req.body.priceUnit,
      description: req.body.description,
      category: req.body.category,
      user: req.user._id,
    });
    const savedProduct = await product.save();
    res.json({
      ok: true,
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//PUT REQUEST
productRouter.put('/:id', authToken, async (req, res) => {
  try {
    const id = req.params.id;
    let filteredBody = _.pick(req.body, [
      'name',
      'description',
      'priceUnit',
      'category',
      'available',
    ]);
    const updatedProduct = await Product.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    if (!updatedProduct) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found',
      });
    }
    res.json({
      ok: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//DELETE REQUEST
productRouter.delete('/:id', authToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { available: false },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
    if (!deletedProduct) {
      return res.status(404).json({
        ok: false,
        message: 'Product not found',
      });
    }
    res.json({
      ok: true,
      product: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = productRouter;

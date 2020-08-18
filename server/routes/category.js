const express = require('express');
const Category = require('../models/category');
const _ = require('underscore');
const { authToken, authAdmin } = require('../middlewares/auth');

const categoryRouter = express();

//GET REQUEST - All categories
categoryRouter.get('/', authToken, async (req, res) => {
  try {
    const foundCategories = await Category.find({});
    const count = await Category.countDocuments();
    res.json({
      ok: true,
      categories: foundCategories,
      count,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//GET REQUEST - Categories by User ID
// categoryRouter.get('/:id', authToken, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const categoryId = await Category.find({ user: id }).exec();
//     res.json({
//       ok: true,
//       user: {
//         name: req.user.name,
//       },
//       categories: categoryId,
//     });
//   } catch (error) {
//     res.status(400).json({
//       ok: false,
//       message: error,
//     });
//   }
// });

//GET REQUEST - Categories by ID
categoryRouter.get('/:id', authToken, async (req, res) => {
  try {
    const id = req.params.id;
    const categoryId = await Category.findById(id)
    if(!categoryId) {
      return res.status(404).json({
        ok: false,
        message: 'Category not found',
      });
    }
    res.json({
      ok: true,
      category: categoryId,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//POST REQUEST
categoryRouter.post('/', authToken, async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      user: req.user._id,
    });
    const savedCategory = await category.save();
    res.json({
      ok: true,
      category: savedCategory,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//PUT REQUEST
categoryRouter.put('/:id', authToken, async (req, res) => {
  try {
    const id = req.params.id;
    let filteredBody = _.pick(req.body, [
      'name',
      'description',
    ]);
    const updatedCategory = await Category.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    if (!updatedCategory) {
      return res.status(404).json({
        ok: false,
        message: 'Category not found',
      });
    }
    res.json({
      ok: true,
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

//DELETE REQUEST
categoryRouter.delete('/:id', [authToken, authAdmin], async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndRemove(id);
    if (!deletedCategory) {
      return res.status(404).json({
        ok: false,
        message: 'Category not found',
      });
    }
    res.json({
      ok: true,
      category: deletedCategory,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error,
    });
  }
});

module.exports = categoryRouter;

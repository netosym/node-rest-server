var mongoose = require('mongoose');

// DEPRECATION WARNINGS FIXES
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema;

var productoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  priceUnit: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('products', productoSchema);

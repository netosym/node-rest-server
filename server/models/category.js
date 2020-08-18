const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// DEPRECATION WARNINGS FIXES
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'category name is required'],
  },
  description: {
    type: String,
    unique: true,
    required: [true, 'category description is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
})

//UNIQUE VALIDATIONS
categorySchema.plugin(uniqueValidator, {
  message: '{PATH} should be unique',
});

module.exports = mongoose.model('categories', categorySchema)


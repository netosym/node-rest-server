const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// DEPRECATION WARNINGS FIXES
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//ROLE ENUM
let validRoles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} is not a valid role',
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: validRoles,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//UNIQUE VALIDATIONS
userSchema.plugin(uniqueValidator, {
  message: '{PATH} should be unique',
});

//NOT PASS PASSWORD IN THE RESPONSE - No se usa arrow functions porque se necesita el valor de this
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('users', userSchema);

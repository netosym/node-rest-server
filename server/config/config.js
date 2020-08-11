
//**********PORT**********//
process.env.PORT = process.env.PORT || 8080;

//**********ENVIRONMENT**********//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//**********DATABASE**********//
// let mongoURI;
// if (process.env.NODE_ENV === 'dev') {
//   mongoURI = 'mongodb://localhost:27017/cafe';
// } else {
//   mongoURI = process.env.MONGOATL_URI;
// }
// process.env.MONGO_URI = mongoURI;
process.env.MONGO_URI = process.env.MONGOATL_URI || 'mongodb://localhost:27017/cafe'

//**********JWT EXPIRATION DATE**********//
process.env.TOKEN_EXP = 60 * 60 * 24 * 30;

//**********AUTHENTICATION SEED**********//
process.env.SEED = process.env.SEED || 'secret-development-seed';

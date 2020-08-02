const { mongo } = require('mongoose');

//**********PORT**********//
process.env.PORT = process.env.PORT || 8080;

//**********ENTORNO**********//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//**********DATABASE**********//
let mongoURI;
if (process.env.NODE_ENV === 'dev') {
  mongoURI = 'mongodb://localhost:27017/cafe';
} else {
  mongoURI =
    'mongodb+srv://ernesto:PsT0ktJiOxNDMYEZ@cluster0-dku5v.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.MONGO_URI = mongoURI;

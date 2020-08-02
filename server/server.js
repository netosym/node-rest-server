require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/user')
const app = express();

//BODY PARSER
//? parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//? parse application/json
app.use(bodyParser.json());

//ROUTES
app.get('/', (req, res) => {
  res.json('Welcome to Home');
});

app.use('/users', userRoute)

//DB CONNECTION
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) throw error;
    console.log('DB connected!');
  }
);

app.listen(process.env.PORT, () => {
  console.log(`listening port ${process.env.PORT}`);
});

require('./config/config');
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routeConfiguration = require('./routes/index');
const app = express();

//BODY PARSER
//? parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//? parse application/json
app.use(bodyParser.json());

//PUBLIC FILES
app.use(express.static(path.resolve(__dirname, '../public')));
//ROUTES
// app.get('/', (req, res) => {
//   res.json('Welcome to Home');
// });

//ALL ROUTES IN A SINGLE FILE
app.use(routeConfiguration);

//DB CONNECTION
mongoose.connect(
  process.env.MONGO_URI, //'mongodb://172.26.160.1:27017/cafe' for WSL2 -- mongod --bind_ip 0.0.0.0 in Windows :)
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) throw error;
    console.log('DB connected!');
  }
);

app.listen(process.env.PORT, () => {
  console.log(`listening port ${process.env.PORT}`);
});

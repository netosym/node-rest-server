require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//BODY PARSER
//? parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//? parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('Welcome to Home');
});

app.post('/usuario', (req, res) => {
  let body = req.body;
  if (body.nombre) {
    res.json({ body });
  } else {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario',
    });
  }
});

app.put('/usuario/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

//DB CONNECTION
mongoose.connect(
  'mongodb://localhost:27017/cafe',
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

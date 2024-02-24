require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3000;

const ModelClass = require('./model.js');
const Model = new ModelClass();

app.use(cookieParser());
let p = __dirname + '/public';
app.use(express.static(p));

app.get('/stores', async (req, res) => {
  const { sortBy, sortOrder } = req.query;
  try {
      const stores = await Model.getStores(sortBy, sortOrder);
      res.json(stores);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

app.get('/add-store', async (req, res) => {
  const { name, url, district, rating } = req.query;
  const status = await Model.addStores(name, url, district, rating);
  if (status.status === 'Success') {
    res.json({ message: "Added successful" });
  } else {
    res.status(400).json({ message: "Add failed" });
  }
});

app.get('/login', async (req, res) => {
  const { email, password } = req.query;
  const status = await Model.userLogin(email, password);
  if  (status) {
    res.cookie('session', 'my-session-cookie', { httpOnly: true});
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
});

app.get('/user-logged-in', async(req, res) => {
  if (req.cookies.session === 'my-session-cookie') {
    res.send({ message: "User is logged in" });
  } else {
    res.status(401).send({ message: "User is not logged in" });
  }
});

app.get('/register', async (req, res) => {
  const { email, password } = req.query;
  const status = await Model.registerUser(email, password);
  if (status.status === 'Success') {
    res.cookie('session', 'my-session-cookie', { httpOnly: true});
  }
  res.json(status);
});

const server = async () => {
  await Model.connectDatabase();
  await Model.setupDatabase();

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

server();





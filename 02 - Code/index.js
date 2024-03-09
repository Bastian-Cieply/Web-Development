require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3000;

const ModelClass = require('./model.js');
const Model = new ModelClass();

app.use(cookieParser());
let p = __dirname + '/public';
app.use(express.static(p));

app.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(p, 'index.html')); 
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

app.get('/stores', async (req, res) => {
  try {
    res.sendFile(path.join(p, 'stores.html'));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/add_store', async (req, res) => {
  if (req.cookies.session === 'my-session-cookie') {
    try {
      res.sendFile(path.join(p, 'add_store.html'));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

app.get('/edit_store', async (req, res) => {
  if (req.cookies.session === 'my-session-cookie') {
    try {
      res.sendFile(path.join(p, 'edit_store.html'));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

app.get('/api/stores', async (req, res) => {
  const { sortBy, sortOrder } = req.query;
    try {
      const stores = await Model.getStores(sortBy, sortOrder);
      res.json(stores);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

app.get('/api/add-store', async (req, res) => {
  const { name, url, district, rating, mapsurl } = req.query;
  if (req.cookies.session === 'my-session-cookie') {
    const status = await Model.addStore(name, url, district, rating, mapsurl);
    if (status.status === 'Success') {
      res.json({ message: "Added successful" });
    } else {
      res.status(400).json({ message: "Add failed" });
    }
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.get('/api/delete-store', async (req, res) => {
  const { id } = req.query;
  if (req.cookies.session === 'my-session-cookie') {
    const status = await Model.deleteStore(id);
    if (status.status === 'Success') {
      res.json({ message: "Deleted successful" });
    } else {
      res.status(400).json({ message: "Delete failed" });
    }
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.get('/api/edit-store', async (req, res) => {
  const {id, name, url, district, rating, mapsurl } = req.query;
  if (req.cookies.session === 'my-session-cookie') {
    const status = await Model.editStore(id, name, url, district, rating, mapsurl);
    if (status.status === 'Success') {
      res.json({ message: "Edit successful" });
    } else {
      res.status(400).json({ message: "Edit failed" });
    }
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.get('/api/get-store-id', async (req, res) => {
  const {name, district} = req.query;
  if (req.cookies.session === 'my-session-cookie') {
    const id = await Model.getStoreID(name, district);
    res.json({ id: id });
  } else {
    res.status(401).json({ message: "User is not logged in" });
  }
});

app.get('/api/login', async (req, res) => {
  const { email, password } = req.query;
  const status = await Model.userLogin(email, password);
  if  (status) {
    res.cookie('session', 'my-session-cookie', { httpOnly: true});
  }
  res.json(status);
});

app.get('/api/user-logged-in', async(req, res) => {
  if (req.cookies.session === 'my-session-cookie') {
    res.send({ message: "User is logged in" });
  } else {
    res.status(401).send({ message: "User is not logged in" });
  }
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.send({ message: "User logged out" });
});

app.get('/api/register', async (req, res) => {
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





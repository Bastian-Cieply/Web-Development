const express = require('express');
const app = express();
const port = 3000;

const ModelClass = require('./model.js');
const model = new ModelClass();

app.get('/', async(req, res) => {
    const stores = await model.getStores();
    res.json(stores);
});

const server = async () => {
    await model.connectDatabase();
    await model.setupDatabase();


    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });

}

server();


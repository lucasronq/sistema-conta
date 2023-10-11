const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const routerApp = require('./routes/router');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(routerApp);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});
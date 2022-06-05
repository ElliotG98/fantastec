const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

require("./api/routes/routes")(app);

module.exports = app;

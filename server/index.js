const express = require('express');
const configViewEngine = require('./src/config/configViewEngine');
const routes = require('./src/routes');
const port = 3000;
const app = express();
configViewEngine(app);
routes(app);
app.listen(port);
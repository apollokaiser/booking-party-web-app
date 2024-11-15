const express = require('express');
const {create} = require("express-handlebars");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const middleware = require('../utils/middleware');
const registerHandleBars = require('./registerHandleBars');
const path = require("path");
const hbs = create({ // config handlebars
    extname: 'hbs',
    helpers: registerHandleBars
})

const config = (app)=>{
// use session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(session({
secret: 'root',
resave: true,
saveUninitialized: true,
cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false} // is not using https method
}))
app.use(middleware.getInfoLogIn);
// use template engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './src/views');
// static files setting
app.use("/",express.static('public'));
app.use("/public",express.static(path.join(path.resolve(), '/../client/public')));
// use cors
app.use(cors());
// use body-parser (we can use req.body now !);

}

//exports configuration
module.exports = config;


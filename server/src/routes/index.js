const middleware = require('../utils/middleware');
const HomeRouter = require( './Home');
const NewsRouter = require( './News');
const loginRouter = require('./loginRouter');
const menuRouter = require('./menu');
const orderRouter = require('./order');
const roomRouter = require('./room');
const billRouter = require('./bill');
const api = require('../api');


const routes = (app) => {
    app.use('/api',api);
    app.use('/login', loginRouter);
    app.use('/order',middleware.requireLogin, orderRouter);
    app.use('/room',roomRouter);
    app.use('/bill',billRouter);
    app.use('/menu',middleware.requireLogin,menuRouter);
    app.use('/news',middleware.requireLogin,NewsRouter);
    app.use("/logout",middleware.requireLogin,loginRouter);
    app.get('/',middleware.requireLogin, HomeRouter);
}
module.exports = routes;
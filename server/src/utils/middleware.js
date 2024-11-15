function requireLogin(req, res, next) {
    console.log(req.session);
    if (req.session.loggedIn && req.session.username && req.session.password) {
        next();
    } else {
        res.redirect("/login" + req.originalUrl);
    }
}
function getInfoLogIn(req, res, next) {
    if (req.session.loggedIn && req.session.username && req.session.password) {
        res.locals.currentAdmin = {
            loggedIn: req.session.loggedIn,
            username: req.session.username,
            password: req.session.password,
            admin_id: req.session.admin_id,
            admin_name: req.session.admin_name
        };
        next();
    } else next();
}
module.exports = { requireLogin, getInfoLogIn };
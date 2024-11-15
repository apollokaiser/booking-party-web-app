const loginModel = require('../models/acountModel')

const Index = (req, res) => {
    req.session.nextPage = '';
    res.render('login', {layout: false});
}
const redirectTo = (req, res) => {
    if(req.params.redirect) req.session.nextPage = req.params.redirect; // Các trường hợp còn lại
    res.render('login', {layout: false}); // Ở đây dùng redirect sẽ bị lỗi localhost điều hướng nhiều lần
}
const  Check = (req, res) => {
    loginModel.checkAccount(req.body.username,req.body.password)
    .then(response=>{
    if(response!=undefined){
    req.session.loggedIn = true;
    req.session.admin_id = response.admin_id;
    req.session.admin_name = response.LASTNAME + '' +response.FIRSTNAME;
    req.session.username = req.body.username;
    req.session.password = req.body.password;
    res.redirect('/'+ req.session.nextPage);
    }
    else 
    res.render('login', {layout: false});
    }
)
}
const Logout = async (req, res,next) => {
        req.session.destroy();
        res.redirect('/login');
}

module.exports = {Index,Check,redirectTo,Logout}
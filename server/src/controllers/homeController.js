const orderModel = require('../models/orderModel');
const Index = async(req, res)=> {
    const countUnComfirm = await orderModel.unConfirmOrders(true);
    res.render('home',{countUnComfirm});
}
module.exports = {Index};
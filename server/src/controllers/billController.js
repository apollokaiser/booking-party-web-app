const billModel = require("../models/billModel");


const addBill = async (req,res,next) => {
    const bill = req.body;
    if(bill && req.session.admin_id){
        bill.adminID = req.session.admin_id;
        const result = await billModel.createBill(bill);
        if(result >0){
            res.send({success: true});
        } else if(result == null){
            res.status(404).send({success: false});
        } else {
            res.send({success: false});
        }
    } else {
        res.status(404).send({success: null});
    }
};
module.exports = {addBill};
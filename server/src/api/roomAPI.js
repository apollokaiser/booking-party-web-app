
const roomModel = require('../models/roomModel')

const getRoomAPI = async (req, res, next) => {
    const orderDate = req.body.orderDate;
    const anyDate = JSON.parse(req.body.anyDate) ? req.body.anyDate : false;
    const roomEmpty = await roomModel.getRoomEmpty(orderDate,anyDate);
    if(roomEmpty==null) res.send({roomEmpty,status:500}); 
    else if(roomEmpty.length  > 0) {
        res.send({roomEmpty,status:200});
    } else {
        res.send({roomEmpty:null,status:404});
    }
}
module.exports = {getRoomAPI}
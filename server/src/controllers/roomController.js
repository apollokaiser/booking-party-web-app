const roomModel = require('../models/roomModel');

const getRoom = async (req,res) =>{
    const orderDate = req.params.date;
    if(orderDate){
        const room = await roomModel.getRoomEmpty(orderDate);
        if(room == null){
            res.send({status:"full",room:null});
            
        }
        else if(room.length > 0){
            res.send({status:"notfull",room});
        }
         else {
            res.send({status:"full",room:null});
        }
    }
}
module.exports = {getRoom}
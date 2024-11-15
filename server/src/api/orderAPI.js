const orderPartyModel = require('../models/orderModel');


const addOrderAPI = async (req, res, next) => {
    const orderParty = req.body.orderParty;
    const result = await orderPartyModel.addOrder(orderParty);

    if(result.orderID){
        res.status(200).send({Message:"Bạn đã đặt hàng thành công và chờ xác nhận !Trận trọng",orderID:result.orderID});
    } else if(result ==-1) {
        res.status(404).send({Message:"Không thể thêm ! Bạn vui lòng thử lại ",orderID:0});
    } else{
        res.status(404).send({Message:"Bạn đã có lịch cho ngày hôm đó ! Vui lòng thử lại",orderID:0});
    }
}
const getOrderAPI = async (req, res,next) => {
    const orderID = req.params.id;
    const order = await orderPartyModel.getOrder(orderID);
    if(order && order.deleteRequest==0) {
        res.send(order);
    } else {
        res.send(null);
    }
}
const deleteOrderAPI = async (req, res, next) => {
    const orderID = req.body.orderID;
    if(orderID){
        const result  = await orderPartyModel.deleteOrder(orderID);
        if(result >0){
            res.send(true);
        } else {
            res.send(false);
        }

    }
};
const sendDeleteRequestAPI = async(req,res,next)=>{
    const orderID = req.body.orderID;
    if(orderID){
        const result  = await orderPartyModel.deleteOrder(orderID,true);
        if(result >0){
            res.send(true);
        } else {
            res.send(false);
        }

    }

}
const updateOrderAPI = async (req,res,next) =>{
    const order = req.body.order;
    if(order){
        const result = await orderPartyModel.updateOrder(order);
        if(result==null){
            res.send({success:false});
        } else if(result == 0){
            res.send({success:false});
        } else {
            res.send({success:true});
        }
    }
}
module.exports = {addOrderAPI,getOrderAPI,deleteOrderAPI,sendDeleteRequestAPI,updateOrderAPI}
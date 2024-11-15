const orderModel = require("../models/orderModel");
const foodModel = require("../models/foodModel");
const roomModel = require("../models/roomModel");
const serviceModel = require("../models/servicesModel");

const getUnConfirmedOrders = async (req, res, next) => {
    const orderParty = await orderModel.unConfirmOrders();
    if (orderParty != null) {
        res.render("orderView/order", { orderParty });
    } else {
        res.render("orderView/order", { orderParty });
    }
}
const confirmOrder = async (req, res, next) => {
    const orderIDs = req.body;
    if (orderIDs != undefined && req.session.admin_id != undefined) {
        const adminID = req.session.admin_id;
        const isUpdated = await orderModel.confirmOrder(orderIDs, adminID);
        if (isUpdated)
            res.send({ orderIDs, adminID });
        else {
            res.send({ orderIDs: null });
        }
    } else {
        res.status(500);
    }
}
const orderParty = async (req, res, next) => {
    const orders = await orderModel.getOrder(null, true);
    res.render("orderView/order_list", { orders });
}
const getOrder = async (req,res,next) => {
    const orderID = req.params.orderID;
    if(orderID){
        const order = await orderModel.getOrder(orderID);
        if(order){
            res.send({order: order});
        } else {
            res.send({order:null});
        }
    }
}
const deleteOrder = async (req, res, next) => {
    const orderIDList = req.params.id;
    const orderID = orderIDList.split("-");
    if (orderID !== undefined) {
        const deleteRows = await orderModel.deleteOrder(orderID);
        if (deleteRows != null) {
            if (deleteRows > 0) {
                res.send({message:"OK"});
            }
            else {
                res.send({message:"ERROR"});
            }
        } else {
            res.send("CANNOT DELETE ! ERROR: INCORRECT RIGHT SYNTAX");
        }
    } else {
        res.send("CAN NOT FIND ANY PARAMS ON REQUEST");
    }
}
const searchOrder = async (req, res) => {
    const data = req.query.data;
    const filterBy = req.query.filter;
    const scope = req.query.scope ? req.query.scope : null;
    const orderParty = await orderModel.searchOrder(data, filterBy, scope);
    if (orderParty.length > 0) {
        if (scope == null) {
            res.render("orderView/order_list", { orders:orderParty });
        } else {
            res.render("orderView/order", { orderParty });
        }
    }
    else {
        if (scope == null) {
            res.render("orderView/order_list", { orders: null });
        } else {
            res.render("orderView/order", { orderParty: null });

        }
    }

}
const updateOrder = async (req, res) => {
    const orderID = req.params.id;
    if (orderID) {
        const typeFood = await foodModel.getFoods();
        const orderParty = await orderModel.getOrder(orderID);
        const service = await serviceModel.getAllServices();
        if (typeFood && orderParty && service) {
            const room = await roomModel.getRoomEmpty(orderParty.orderDate);
            room.push(orderParty.room);
            res.render("orderView/updateOrder", { orderParty, typeFood, room, service });
        } else {
            var error = { message: "Không thể tìm thấy đối tượng !!!", errorCode: true }
            res.render("orderView/order_list", { error });
        }
    }
}
const update = async (req, res, next) => {
    const order = JSON.parse(req.body.order);
    if (order && req.session.admin_id) {
        order.order.adminID = req.session.admin_id;
        const result = await orderModel.updateOrder(order);
        if (result == null) {
            res.send({ success: false });
        } else if (result == 0) {
            res.send({ success: false });
        } else {
            res.send({ success: true });
        }
    }
}
module.exports = { getUnConfirmedOrders,getOrder, confirmOrder, orderParty, deleteOrder, searchOrder, updateOrder, update };
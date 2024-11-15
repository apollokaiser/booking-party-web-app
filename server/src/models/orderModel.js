const db = require('../config/database');
const orderDetail = require('../models/orderDetailModel');
const ServiceModel = require('../models/servicesModel');
const RoomModel = require('../models/roomModel');
class orderParty {
    constructor(orderID, serviceID, userName, userEmail, phone, attendeesCount, tableCount, orderDate, orderTotal, deposit, isConfirm, roomID, adminID,deleteRequest) {
        this.orderID = orderID;
        this.serviceID = serviceID;
        this.userName = userName;
        this.userEmail = userEmail;
        this.phone = phone;
        this.attendeesCount = attendeesCount;
        this.tableCount = tableCount;
        this.orderDate = orderDate;
        this.orderTotal = orderTotal;
        this.deposit = deposit;
        this.isConfirm = isConfirm;
        this.roomID = roomID;
        this.adminID = adminID;
        this.deleteRequest = deleteRequest;
    }
    static async addOrder(orderParty) {
        const queryString = "INSERT INTO `orderparty`(`orderID`, `serviceID`, `userName`, `userEmail`, `phone`, `attendeesCount`, `tableCount`, `orderDate`, `orderTotal`, `roomID`) VALUES (?,?,?,?,?,?,?,?,?,?)";
        try {
            const orderDate = new Date(orderParty.orderDate);
            orderParty.orderID = orderParty.SDT + "" + orderDate.getDate();
            const [result] = await db.query(queryString, [orderParty.orderID, orderParty.serviceID, orderParty.userName, orderParty.userEmail, orderParty.SDT, orderParty.CountCustomer, orderParty.tableCount, orderParty.orderDate, orderParty.orderTotal, orderParty.roomID]);
            if (result.affectedRows > 0) {
                for (let detail of orderParty.orderDetails) {
                    let affectedRows = await orderDetail.addOrderDetail(orderParty.orderID, detail);
                }
                return { orderID: orderParty.orderID, affectedRows: result.affectedRows };
            } else {
                return -1;
            }

        } catch (error) {
            console.log(error);
            return error;
        }
    }
    static async getOrder(orderID, getAll = false) {
        let queryString = "";
        if (getAll) {
            queryString = "SELECT * FROM `orderparty` WHERE deposit IS NOT NULL AND isCompleted <> 1";
            try {
                const [rows, fields] = await db.query(queryString);
                if (rows.length > 0) {
                    return rows;
                } else return null;
            } catch (error) {
                return null;
            }
        } else {
            queryString = "SELECT orderparty.*, CONCAT(admin_user.LASTNAME,' ', admin_user.FIRSTNAME) as admin_name FROM `orderparty` left join `admin_user` on orderparty.adminID = admin_user.admin_id where orderID = ?";
        }
        try {
            const [rows, fields] = await db.query(queryString, [orderID]);
            if (rows.length > 0) {
                let order = rows[0];
                const orderparty = new orderParty(order.orderID, order.serviceID, order.userName,
                    order.userEmail, order.phone, order.attendeesCount, order.tableCount,
                    order.orderDate, order.orderTotal, order.deposit, order.isConfirm,
                    order.roomID, order.adminID,order.deleteRequest
                )
                orderparty.admin_name = order.admin_name;
                orderparty.detail = await orderDetail.getDetails(orderID);
                orderparty.service = await ServiceModel.getService(order.serviceID);
                orderparty.room = await RoomModel.getRoom(order.roomID);
                return orderparty;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        };
    }
    static async deleteOrder(orderID,deleteRequest = false) { // List ordeID
        if(deleteRequest==true) {
            try {
                const queryString = "UPDATE `orderparty` SET deleteRequest = 1 WHERE orderID = (?)"; 
                const [result] = await db.query(queryString, [orderID]);
                return result.affectedRows > 0 ? result.affectedRows : 0;
            } catch (error) {
                console.log(error);
                return null;
            }
        }else {
        try {
            const deleteDetailRows = await orderDetail.deleteOrderDetail(orderID);
            if (deleteDetailRows > 0) {
                const queryString = "DELETE FROM `orderparty` WHERE orderID IN (?)";
                const [result] = await db.query(queryString, [orderID]);
                return result.affectedRows > 0 ? result.affectedRows : 0;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    }
    static async unConfirmOrders(countAffected = false) { //countAffected is only return affectRows
        try {
            const queryString = "SELECT `orderID`, `serviceID`, `userName`, `userEmail`, `phone`, `attendeesCount`, `orderDate`, `orderTotal`, `roomID` FROM `orderparty` WHERE `orderparty`.`isConfirm` IS NULL;";
            const [rows, fields] = await db.query(queryString);
            if (countAffected) {
                return rows.length > 0 ? rows.length : null;
            }
            if (rows.length > 0) {
                return rows;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async confirmOrder(orderConfirm, adminID) {
        try {
            let updateCount = 0;
            const queryString = "UPDATE `orderparty` SET isConfirm = 1, adminID = (?), deposit = (?) where orderID = (?)";
            for (var item of orderConfirm) {
                const [result] = await db.query(queryString, [adminID, item.deposit, item.orderID]);
                updateCount += await result.affectedRows;
            }
            if (updateCount == orderConfirm.length) {
                return true;
            } else {
                console.log(updateCount, orderConfirm.length);
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static async searchOrder(data, filterBy, scope = null) {
        let queryString = `select * from orderparty where ${filterBy} = ? `;
        if (scope != null) {
            queryString += "AND isConfirm IS NULL";
        }
        try {
            const [rows, fields] = await db.query(queryString, [data]);
            return rows;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async updateOrder(orderUpdate) {
        try {
            let queryString = "UPDATE `orderparty` SET serviceID = ?, userName = ?, userEmail = ?, phone = ?, attendeesCount = ?, tableCount = ?, orderDate = ?, roomID = ?, orderTotal = ?, adminID = ? WHERE orderID = ?";
            const [result] = await db.query(queryString, [
                orderUpdate.order.serviceID,
                orderUpdate.order.userName,
                orderUpdate.order.userEmail,
                orderUpdate.order.phone,
                orderUpdate.order.attendeesCount,
                orderUpdate.order.tableCount,
                orderUpdate.order.orderDate,
                orderUpdate.order.roomID,
                orderUpdate.order.orderTotal,
                orderUpdate.order.adminID,
                orderUpdate.order.orderID,
                ]);
                if(result.affectedRows > 0){
                    queryString = " UPDATE `orderdetail` SET `quantity` = ? WHERE `orderID` = ? ";
                    const [updateResult] = await db.query(queryString,[orderUpdate.order.tableCount,orderUpdate.order.orderID]);
            if(orderUpdate.insertItems.length > 0 || orderUpdate.deleteItems.length > 0){
                const updateResult = await orderDetail.updateDetail(orderUpdate.order.orderID,orderUpdate.insertItems, orderUpdate.deleteItems);
                return updateResult;
            } else return result.affectedRows;
        } else return 0;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
module.exports = orderParty;
const db = require('../config/database');

class orderDetail {
    constructor(orderID, foodID, price, quantity) {
        this.orderID = orderID;
        this.foodID = foodID;
        this.price = price;
        this.quantity = quantity;
    }
    static async addOrderDetail(orderID, detail) { //Detail: foodID, price, quantity
        try {
            const queryString = "INSERT INTO `orderdetail`(`orderID`, `foodID`, `price`, `quantity`) VALUES (?,?,?,?)";
            const [result] = await db.query(queryString, [orderID, detail.foodID, detail.price, detail.quantity]);
            return result.affectedRows > 0 ? result.affectedRows : -1;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async getDetails(orderID) {
        try {
            let orderdetails = [];
            const queryString = "SELECT food.*,orderdetail.price as orderPrice,orderdetail.quantity FROM `orderdetail` JOIN `food` on `orderdetail`.`foodID` = `food`.`foodID`" +
                "where orderdetail.orderID = (?)";
            const [rows, fields] = await db.query(queryString, [orderID]);
            if (rows.length > 0) {
                return rows;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async deleteOrderDetail(orderID) { //List orderID
        try {
            const queryString = "DELETE FROM `orderdetail` WHERE `orderID` IN (?)";
            const [result] = await db.query(queryString, [orderID]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async deleteFoodOrder(orderID, deleteList) {
        try {
            const queryString = "DELETE FROM `orderdetail` WHERE `orderID` = ? AND foodID IN (?)";
            const [result] = await db.query(queryString, [orderID, deleteList]);
            return result.affectedRows > 0 ? result.affectedRows : 0;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async updateDetail(orderID, insertList, deleteList) {
        if (deleteList.length > 0) {
            const deleteResult = await this.deleteFoodOrder(orderID,deleteList);
            if(deleteResult > 0){
                if(insertList.length ==0){
                    return 1;
                } else {
                    let check = true;
                    for (const item of insertList) {
                        const insertResult = await this.addOrderDetail(orderID,item);
                        if(insertResult ==0 || insertResult ==null){
                            check = false;
                        }
                    }
                    if(check){
                        return 1;
                    } else return 0;
                }
            }
        } else if(insertList.length >0){
            let check = true;
            for (const item of insertList) {
                const insertResult = await this.addOrderDetail(orderID,item);
                if(insertResult ==0 || insertResult ==null){
                    check = false;
                }
            }
            if(check){
                return 1;
            } else return 0;
        } else {
            return -1;
        }
    }
    // static compareDetails(ExistedData, UpdatingData){
    //     var json1 = JSON.stringify(ExistedData);
    //     var json2 = JSON.stringify(UpdatingData);
    //     if(json1===json2) return null;
    //     else {
    //     var uniqueArray = UpdatingData.filter(function(element) {
    //         return !ExistedData.includes(element); //NOTE: Trả về phần tử mà không có trong ExistedData
    //       });
    //       return uniqueArray;
    //     }
    // }
}
module.exports = orderDetail;
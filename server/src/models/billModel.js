const db = require("../config/database");

class Bill {
    constructor(billID,orderID,billTotal, billBonus,adminID,billDate){
        this.billID = billID;
        this.orderID = orderID;
        this.billTotal = billTotal;
        this.billBonus = billBonus;
        this.adminID = adminID;
        this.billDate = billDate;
    }
    static async createBill(bill){
        let queryString = "INSERT INTO `bill`(`billID`, `orderID`, `billTotal`, `billBonus`, `adminID`, `billDate`) VALUES (?,?,?,?,?,?)";
        try {
            const [result] = await db.query(queryString,[bill.billID,bill.orderID,bill.billTotal,bill.billBonus,bill.adminID,bill.billDate]);
            if(result.affectedRows >0 ){
                queryString = "UPDATE `orderparty` SET isCompleted = 1 where orderID = ?";
                const [updateResult] = await db.query(queryString, [bill.orderID]);
                return updateResult.affectedRows > 0 ? updateResult.affectedRows :0;
            }
        } catch (error) {
            return null;
        }
        
    }

}
module.exports = Bill;
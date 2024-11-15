const db = require("../config/database")

class menuDetail {
    contructor(menuID, foodID) {
        this.menuID = menuID;
        this.foodID = foodID;
    }
    static async getDetails(menuID) {
        try {
            let detail = [];
            const queryString = "SELECT `food`.* FROM `menudetail` JOIN `food` on `menudetail`.`foodID` = `food`.`foodID` where `menuID`= ?";
            const [rows, fields] = await db.query(queryString, [menuID]);
            if (rows) {
                rows.forEach(item => {
                    detail.push({
                        foodID: item.foodID,
                        foodName: item.foodName,
                        description: item.description,
                        typeID: item.typeID,
                        price: item.price,
                        image: item.image,
                        typeID: item.typeID
                    });
                })
                return detail;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;

        }
    }
    static async addDetails(menuID, details) {
        if(details.length == 0) return 0;
        try {
            let queryString = "INSERT INTO `menudetail`(menuID,foodID) VALUES ";
            details.forEach((item, index) => {
                if (index == (details.length - 1))
                    queryString += `(${menuID},${item});`
                else {
                    queryString += `(${menuID},${item}),`
                }
            })
            const [result] = await db.query(queryString);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
            return -999;
        }
        
    }
    static async deleteMenuDetail(deleteAll = false,menuList=null) {
        let queryString = "";
        if (deleteAll&& !menuList) {    //NOTE: delete all detail (true,null)
            queryString = "DELETE FROM `menudetail`";
        } else if((deleteAll && menuList) || (!deleteAll && !menuList)) { // NOTE: (true, menuList) ||(false,null)
            return 0;
        } else {
            queryString = "DELETE FROM menudetail where menuID IN (?);";
        }
        try {
            const [result] = await db.query(queryString,[menuList]);
            return result.affectedRows;  
        } catch (error) {
            console.log(error);
            return -999;
        }
    }
    static async deleteFoods(menuID,deleteList) {
        console.log(menuID,deleteList);
           const queryString = "DELETE FROM menudetail where menuID = (?) AND foodID IN (?);";
        try {
            const [result] = await db.query(queryString,[menuID,deleteList]);
            return result.affectedRows > 0 ? result.affectedRows: 0;  
        } catch (error) {
            console.log(error);
            return -999;
        }
    }
    static async updateMenuDetail(menu){
        try {
                if(menu.deleteItems.length >0){
                const deleteResult = await this.deleteFoods(menu.menuID,menu.deleteItems);
                console.log(deleteResult);
                if(deleteResult>0){
                    if(menu.insertItems.length==0){
                        return 1;
                    }
                    const insertResult = await this.addDetails(menu.menuID,menu.insertItems);
                    return insertResult;
                } else return 0;
            } else {
                    const insertResult = await this.addDetails(menu.menuID,menu.insertItems);
                    return insertResult;
            }
        } catch (error) {
            console.log(error);
            return -999;
        }
    }
    static compareDetails(ExistedData, UpdatingData){
        var json1 = JSON.stringify(ExistedData);
        var json2 = JSON.stringify(UpdatingData);
        if(json1===json2) return null;
        else {
        var uniqueArray = UpdatingData.filter(function(element) {
            return !ExistedData.includes(element); //NOTE: Trả về phần tử mà không có trong ExistedData
          });
          return uniqueArray;
        }
    }
}
module.exports = menuDetail;
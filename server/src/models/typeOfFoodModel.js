const db = require("../config/database")

class typeOfFood {
    constructor(typeID,typeName){
        this.typeID = typeID;
        this.typeName = typeName;
    }
    static async getAll(callback){
        try {
            const typeFood  =[];
            const queryString = "SELECT * from typeof_food";
            const [rows,fields] = await db.query(queryString);
            rows.forEach(item => {
                typeFood.push(new typeOfFood(
                    item.typeID,
                    item.typeName
                ));
            });
            if(callback)
            callback(typeFood);
        else
            return typeFood;   
        } catch (error) {
            return error.sqlMessage;
        }
    }
}
module.exports = typeOfFood
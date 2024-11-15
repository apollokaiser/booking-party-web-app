const db = require("../config/database");


class Food {
    constructor(foodName,price,description,image,typeID,CreateAt,foodID){
        this.foodID = foodID;
        this.foodName = foodName;
        this.price = price;
        this.description = description;
        this.image = image;
        this.typeID = typeID;
        this.CreateAt = CreateAt;
    }
    static async getFoods(){
        try {
            let typeFood = {
                foodKV: [],
                foodAC: [],
                foodTM: [],
            };
            const queryString =  "SELECT * FROM `food`";
            const [rows,fields] = await db.query(queryString);
            rows.forEach(item => {
                if(item.typeID === "KV"){
                    typeFood.foodKV.push(item);
                } else if(item.typeID =="AC"){
                    typeFood.foodAC.push(item);
                } else {
                    typeFood.foodTM.push(item);
                }
            });
            return typeFood;
        } catch (error) {
            console.log(error);
            return error.sqlMessage;
        }
    }
    static async addFood(food){
        try {
            const queryString =  "INSERT INTO `food`(`foodName`, `price`, `description`, `image`, `typeID`, `CreateAt`) VALUES (?,?,?,?,?,?)";
            const [result] = await db.query(queryString,[food.foodName, food.price, food.description, food.image,food.typeID,food.CreateAt]);
            return result.affectedRows;
        } catch (error) {
            console.log(error);
            return error.sqlMessage;
        }
    }
}

module.exports = Food
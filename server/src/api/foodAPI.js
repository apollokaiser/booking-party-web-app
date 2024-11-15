const foodModel = require("../models/foodModel");

const getFoodAPI = async (req,res,next)=>{
    const foodList = await foodModel.getFoods();
    if(foodList){
        res.send(foodList);
    }
}
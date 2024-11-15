
const menu = require('../models/menuModel');
const food = require('../models/foodModel');
const getMenuAPI = async (req, res, next) => {
    const menus = await menu.getAll();
    if(menus){
        if(req.query.allfood){
            const foodList = await food.getFoods();
            res.send({menuList:menus.menuInfo,foodList,status:200});
        } else {
            res.send({menuList:menus.menuInfo,foodList:null,status:200});
        }
    } else {
        res.send({menuList:null,status:404});
    }
}
module.exports = {getMenuAPI}
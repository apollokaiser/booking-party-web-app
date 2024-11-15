const menuModel = require("../models/menuModel");
const foodModel = require("../models/foodModel");
const menuDetailModel = require("../models/menuDetailModel");
const servicesModel = require("../models/servicesModel");
const typeOfFoodModel = require("../models/typeOfFoodModel");

//  GET: /menu
const Index = async (req, res) => { 
    let type = await typeOfFoodModel.getAll();
    let menu = await menuModel.getAll();
    res.render('menuView/menu',{type,menu});
}

//  POST: /menu/add-food
const addFood = async (req, res,next) => {
    const food = JSON.parse(req.body.food);
    food.image = req.file.originalname;
    food.CreateAt = new Date();
    const affectedRows = await foodModel.addFood(food);
    if(affectedRows > 0){
        res.send({success:true})
    } else {
        res.send({success:false})
    }
}
//  GET: /menu/add-menu
const addMenu = async(req,res,next) => {
    const typeFood = await foodModel.getFoods();
    const services = await servicesModel.getAllServices();
    if(typeFood){
        res.render("menuView/addMenu",{typeFood,services});
    }
}

//  POST: /menu/add
const add = async (req,res,next) => {
    const menu = JSON.parse(req.body.menu);
    const result = await menuModel.add(menu);
    if(result.status=="200"){
        let affectedRows= await menuDetailModel.addDetails(result.value,menu.menuDetails);
        if(affectedRows >0){
            res.send({success:true})
        } else {
            res.send({success:false});
        }
    } else if (result.status=="Empty details"){
        res.send({success:false});
    } else {
        res.send({success:false});
    }
}

// POST: /menu/delete-menu
// FIXED:Đã fix xong deleteMenu
const deleteMenu = async (req, res,next) => { //UPDATED: Đã chuyển sang dùng fetch
    const targetID = req.body;
    if(targetID === undefined){
        res.send("Không thể tìm thấy mục tiêu !!!"); 
    }
    else {
         let result = 0;
         let error = {};
        if(targetID[0] =="all"){                                    // NOTE: Xóa toàn bộ
        result = await menuModel.removeMenu(true);
        } else {                                                // NOTE: Xóa 1 vài thực đơn
        result = await menuModel.removeMenu(false,targetID); //NOTE: false là không cho xóa toàn bộ
        }
        if(result>0){
            error = {
                message:`Xóa thành công ${result} thực đơn`,errorCode:false
                //UPDATED: Đã sửa để phù hợp với fecth
            }
        } else {
            error = {
                message:"Không thể xóa thành công. Vui lòng thử lại !", errorCode:true
            }
        }
        res.json(error); 
        // NOTE:Nếu không dùng res.json(), sẽ xuất hiện lỗi :syntaxerror: unexpected token '<', "<html lang"... is not valid json

}
}
const updateMenu = async (req,res,next) => {
    const menuID = req.params.id;
    if(menuID){
        const typeFood = await foodModel.getFoods();
        const menu = await menuModel.getMenuById(menuID);
        if(menu && typeFood){
            res.render("menuView/updateMenu",{menu,typeFood});
        }
    } else {
        var error={message:"Không thể tìm thấy đối tượng !!!", errorCode:true}
        res.render("menuView/menu",{error});
    }
}
const update = async (req,res,next) => {
    const menu = JSON.parse(req.body.menu);
    if(menu){
       const result = await menuModel.updateMenu(menu);
        if(result>0){
            res.send({success:result});
        } else {
            res.send({success:result});
        }
    }
};

module.exports = {Index,addFood,addMenu,add,deleteMenu,updateMenu,update};
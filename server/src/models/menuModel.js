const db = require("../config/database")
const menuDetailModel = require("../models/menuDetailModel")
class Menu {
    constructor(menuName, serviceID, menuID) {
        this.menuID = menuID;
        this.menuName = menuName;
        this.serviceID = serviceID;
    };
    //ADDED_FEATURE:Đã thêm parameter orderBY cho việc sắp xếp dữ liệu
    static async getAll(orderBY='ASC'){ //FIXED:Lỗi load dữ liệu bị mất thứ tự đã sửa
        try {
            const menu = {
                menuInfo:[],
            };
            const [menus, fieldsMenu] = await db.query('SELECT * from `menu` ORDER BY `menuID` '+orderBY);
            if(menus){ // Nếu duyệt có được menu
            menus.forEach((item) => {
                // const detail = await menuDetailModel.getDetails(item.menuID);
                // Dùng async/await ở đây sẽ bị 1 lỗi: Load dữ liệu không theo thứ tự
                menu.menuInfo.push({
                    info:{
                    menuName:item.menuName,
                    serviceID:item.serviceID,
                    menuID:item.menuID
                },
                });
            });
            if(menu){ // Nếu có menu
                for (const item of menu.menuInfo) {
                    item.detail = await menuDetailModel.getDetails(item.info.menuID);
                }
            }
            return menu;
        }
        } catch (error) {
            return null;
        }
    }
    static async add(menu){
        try {
            let queyString = "SELECT insertDataAndGetId(?) id";
            const [result,fields]= await db.query(queyString,[menu.serviceID]);
            const value = result[0].id;
            return {value,status:200};
        }catch(error){
            return error.sqlMessage;
        }
    }
    static async removeMenu(deleteAll=false,arrayMenu=null){
        let queryString = "";
        if(deleteAll && !arrayMenu){ //NOTE: delete all menu (true,null)
            queryString = "DELETE FROM `menu`";
        } else if((deleteAll && arrayMenu) || (!deleteAll&&!arrayMenu)){ //NOTE: Not valid
            return 0;  // Not correct syntax (true,arrayMenu !=null)||(false,null)
        } else {
            queryString = "DELETE FROM `menu` WHERE `menuID` IN (?)";
        }
        try {
            const affectedRows = await menuDetailModel.deleteMenuDetail(deleteAll,arrayMenu);
            if(affectedRows >0){
            const [result] = await db.query(queryString,[arrayMenu]);
                return result.affectedRows;
            }
            else return 0;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async getMenuById(menuID) {
        try {
            const menu = {};
            const queryString = "SELECT * FROM `menu` WHERE `menuID` = (?)";
            const [result] = await db.query(queryString,[menuID]);
            if(result[0]){
                menu.menuID = result[0].menuID;
                menu.menuName = result[0].menuName;
                menu.serviceID = result[0].serviceID;
            } else{
                return null;
            }
            menu.detail = await menuDetailModel.getDetails(menu.menuID);
            return menu;
        } catch(e){
            console.log(e.sqlMessage);
            return null;
        }
    } static async updateMenu(menu){
        try {
            const menuInfo = await Menu.getMenuById(menu.menuID);
            if(menuInfo){
                const result = await menuDetailModel.updateMenuDetail(menu);
                if(result>0){
                    return result;
                }else return -2;
            } 
            return -1;
        } catch (error) {
            return -999;
        }
    }

}
module.exports = Menu
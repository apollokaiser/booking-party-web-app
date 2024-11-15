const db = require('../config/database');
const date_fns = require("date-fns")
class Room_party{
    constructor(roomID,roomName,floor,status,minCapicity,maxCapicity,price,image1,image2,image3){
        this.roomID = roomID;
        this.roomName = roomName;
        this.floor = floor;
        this.status = status;
        this.minCapicity = minCapicity;
        this.maxCapicity = maxCapicity;
        this.price = price;
        this.image1 = image1;
        this.image2 = image2;
        this.image3 = image3;
    }
    static async getRoomEmpty(orderDate, anyDate = false){ // FIXED: Đã sửa xong
        let roomEmpty = [];
        let orderDateTime = new Date(orderDate);
        if(anyDate == false){
            let now = new Date();
            now.setDate(now.getDate()+2);
            if(now >= orderDateTime) return null;   //NOTE: Nếu now + 2 ngày lớn hơn ngày đặt thì không được đặt
        }
            try {
                const queryString = "select room_party.* FROM room_party "+
                "where room_party.roomID NOT IN (SELECT roomID FROM orderparty WHERE "+ 
                "orderparty.orderDate = ? )";
                const [rows,fields] = await db.query(queryString,[date_fns.format(orderDateTime,"yyyy-MM-dd")]);
                if(rows.length > 0){
                    rows.forEach(item =>{
                        roomEmpty.push(new Room_party(
                            item.roomID,
                            item.roomName,
                            item.floor,
                            item.status,
                            item.minCapicity,
                            item.maxCapicity,
                            item.price,
                            item.image1,
                            item.image2,
                            item.image3
                        ))
                    })
                    return roomEmpty;
                } else {
                    return null;
                }
            } catch (error) {
                console.log(error);
                return undefined;
            }
    }
     static async getRoom(roomID){
        try {
           const queryString = 'select * from room_party where roomID = (?)'; 
           const [rows,fields] = await db.query(queryString,[roomID]);
           if(rows.length >0){
                let room = rows[0];
                return rows[0];
           } else {
            return null;
           }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
module.exports = Room_party;
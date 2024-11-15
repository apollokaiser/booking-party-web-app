
/*NOTE:checkFood is an array, menuList is an Object, attendeesCount is an integer number */
export function Total(checkFoods,user,selected_Room){
    const orderParty = {
        ...user, // Thông tin của người dùng
        tableCount:0 , // Số bàn đặt tiệc
        checkFoods: checkFoods.food, // Các thức ăn được check
        foodInfos: checkFoods.selected, //
        orderTotal:selected_Room.selected.price, // Tổng tiền (theo lý thuyết) của đơn tiệc
        orderDetails:[], // Các chi tiết đặt tiệc (các thông tin về thức ăn)
        roomID: selected_Room.room,
        room: selected_Room.selected,
    }
    if(user.CountCustomer % 10  !=0){
        orderParty.tableCount = Math.floor(user.CountCustomer/10) + 1;
    } else {
        orderParty.tableCount = user.CountCustomer/10;
    }
    const food = []; // chứa thông tin của food được check
       checkFoods.selected.forEach(checkFood =>{
        orderParty.orderDetails.push({
            foodID:checkFood.foodID,
            price:checkFood.price,
            quantity:orderParty.tableCount
        })
        orderParty.orderTotal += checkFood.price * orderParty.tableCount; // giá của mỗi món * số bàn
    });

    return orderParty; // return Object 
}
export function checkCount(checkFood){
    const typeFood = {
        KV:false,
        AC:false,
        TM:false,
    };
    checkFood.selected.forEach(item =>{
        if(item.typeID =="KV"){
            typeFood.KV = true;
        }
        if(item.typeID =="AC"){
            typeFood.AC = true;
        }
        if(item.typeID =="TM"){
            typeFood.TM = true;
        }
    })
    const check = Object.values(typeFood).filter(item=>item).length;
    if(check >=2){
        return true;
    } else {
        return false;
    }
    // const check = Object.values(typeFood).every(type => type); NOTE:Check cả 3
    return check;
} 
export function Validate(phone,userEmail="",userName){ //NOTE: GET ME ----
    const regexPhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
    const regexEmail = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
    const regexUsername = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăẮắẰằÂâẤấẦầƠơỚớỜờƯưỨứỪừĐđ\s]+$/;
    if (regexPhoneNumber.test(phone) &&(regexEmail.test(userEmail)|| userEmail=="") && regexUsername.test(userName))
      return true;
    else return false;
  }

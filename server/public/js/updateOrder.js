const room_select = document.querySelector("#room");
const selected_room_first = room_select.value;
const room_price = document.querySelector(".room_price");
const priceList = document.querySelectorAll(".room_price div");
const orderDate = document.querySelector("#order-date");
let service = document.querySelector('#service');
let updateBtn = document.querySelector('#update-btn');

let minAttendeesCount = 5; // Số lượng người tham gia tối thiểu
const data = { // Dữ liệu sạch lúc vừa load
    userName: document.querySelector("#user-name").value,
    userEmail: document.querySelector("#user-email").value,
    phone: document.querySelector("#user-phone").value,
    orderDate: document.querySelector("#order-date").value,
    room: document.querySelector("#room").value,
    room_select: room_select.cloneNode(true),
    room_price: room_price.cloneNode(true),
}
function setVND(currency) {
    var formattedNumber = currency.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    return formattedNumber;
}
const getChangeDate = () => {
    document.querySelector("#room").addEventListener("change", (e) => {
        document.querySelectorAll(".room_price div").forEach(priceItem => {
            if (priceItem.getAttribute("id") == e.target.value) {
                priceItem.classList.add("show");
            } else {
                priceItem.classList.remove("show");
            }
        });
    })
}
getChangeDate();
orderDate.addEventListener("change", (e) => {
    fetch(`/room/get-room/${orderDate.value}`).then(response => response.json())
        .then(response => {
            if (response.status == "notfull") {
                updateBtn.classList.remove("disabled");
                let room_option = data.room_select.querySelector("option");
                let room_price_item = data.room_price.querySelector("div");
                while (room_select.hasChildNodes()) {
                    room_select.removeChild(room_select.firstChild);
                }
                while (room_price.hasChildNodes()) {
                    room_price.removeChild(room_price.firstChild);
                }
                response.room.forEach(item => {
                    let option = room_option.cloneNode(true);
                    let price_item = room_price_item.cloneNode(true);
                    price_item.setAttribute('id', item.roomID);
                    price_item.innerHTML = `<span>${item.price}</span> ${setVND(item.price)}`;
                    option.value = item.roomID;
                    option.textContent = item.roomName;
                    if (selected_room_first == item.roomID) {
                        option.setAttribute("selected", "selected");
                        price_item.classList.add("show");
                    }
                    room_price.appendChild(price_item);
                    room_select.appendChild(option);
                })
                getChangeDate(); // Gọi lại để gắn sự kiện lại cho các element mới thêm

            } else if (response.status == "full") {
                updateBtn.classList.add("disabled");
                let room_option = data.room_select.querySelector("option");
                let room_price_item = data.room_price.querySelector("div");
                let option = room_option.cloneNode(true);
                let price_item = room_price_item.cloneNode(true);
                price_item.setAttribute('id', "");
                price_item.innerHTML = "0 đ";
                price_item.classList.add("show");
                option.value = "";
                option.setAttribute("selected", "selected");
                option.innerHTML = "Không tìm thấy phòng nào trống !";
                while (room_select.hasChildNodes()) {
                    room_select.removeChild(room_select.firstChild);
                }
                while (room_price.hasChildNodes()) {
                    room_price.removeChild(room_price.firstChild);
                }
                room_select.appendChild(option);
                room_price.appendChild(price_item);
            }
        });
})
service.addEventListener('change', (e) => {
    if (e.target.value == "SN") {
        minAttendeesCount = 2;
    } else {
        minAttendeesCount = 5;
    }
})


// copy from updateMenu

$(document).ready(function () {
    const choose_foodKV = document.getElementsByName('choose_foodKV');
    const choose_foodAC = document.getElementsByName('choose_foodAC');
    const choose_foodTM = document.getElementsByName('choose_foodTM');
    const orderID = document.getElementById('orderID').value;
    const menu_food = document.querySelector("#update__container .list-group");
    let delete_items = [];
    let InsertMode = false; // true khi đã xóa hết toàn bộ các phần tử của thực đơn
    let orderTotal = 0;


    $.each($(".delete_food"), function (index, item) {
        $(item).click(() => {
            let nextNode = $(item).next();
            if($(nextNode).val())
            delete_items.push($(nextNode).val());
            if (delete_items.length == $(".delete_food").length) {
                InsertMode = true; //NOTE: Nếu xóa hết thì InsertMode = true
            }
            let parent = $(this).parent();
            $(parent).addClass("hide");
        });
    })

    $(".reset").click((e) => {
        e.preventDefault();
        delete_items = [];
        InsertMode = false;
        let menuList = $("#update__container .list-group-item");
        $.each(menuList, function (index, item) {
            let lastItem = item.lastElementChild;
            if (!lastItem.className.includes("temp_item")) {
                $(item).removeClass("hide");
            }
            else {
                choose_foodKV.forEach(item => {
                    if (item.currentItem)
                        item.currentItem.click();
                });
                choose_foodAC.forEach(item => {
                    if (item.currentItem)
                        item.currentItem.click();
                });
                choose_foodTM.forEach(item => {
                    if (item.currentItem)
                        item.currentItem.click();
                });
                lastItem.remove();

            }
        })
    })
    function checkExistFood(foodName){
        let food_items = menu_food.querySelectorAll(".list-group-item:not(.hide");
        let foodName_list = Array.from(food_items).map(item=>item.querySelector(".food_name").textContent);
        if(foodName_list.length ==0) return true; // Nếu menu khách hàng không có gì cả
        else {
            if(foodName_list.includes(foodName)){ // foodName có tồn tại trong danh sách thực đơn
                return true; //Trả về true nếu có tồn tại
            } else {
                return false;  
            }
        }
    }
    function addFoodIntoMenu(arrayFood) {
        arrayFood.forEach(item => {
            item.addEventListener('change', () => {
                if (item.checked == true) {
                    item.currentCheck = true; // Thêm 1 thuộc tính tự tạo cho item để biết vừa check
                    let MasterParent = item.parentElement.parentElement.parentElement.cloneNode(true);
                    if(!checkExistFood(MasterParent.querySelector(".food_name").innerHTML)){
                    MasterParent.querySelector(".menu_image").remove();
                    let lastElement = MasterParent.lastElementChild;
                    lastElement.lastElementChild.remove();
                    lastElement.classList.add("col-sm-3");
                    lastElement.classList.remove("d-flex");
                    let delete_icon = document.createElement("i");
                    delete_icon.classList.add("me-3", "fa-solid", "fa-xmark", "delete_food", "temp_item");
                    item.currentItem = delete_icon;
                    delete_icon.addEventListener("click", (e) => {
                        let thisItem = e.target;
                        thisItem.parentNode.classList.add("hide");
                        item.checked = false;
                    })
                    MasterParent.appendChild(delete_icon);
                    menu_food.appendChild(MasterParent);
                }
                } else if (item.checked == false && item.currentCheck == true) {
                    item.currentItem.click();
                    item.currentCheck = false;

                }
            });
        })
    }
    addFoodIntoMenu(choose_foodKV);
    addFoodIntoMenu(choose_foodAC);
    addFoodIntoMenu(choose_foodTM);

    updateBtn.addEventListener("click", (e) => {
        // let orderTotal = document.querySelectorAll('#orderTotal').value;
        let food_items = menu_food.querySelectorAll(".list-group-item");
        let roomPrice = room_price.querySelector(".show span").innerHTML;
        roomPrice = roomPrice == undefined ? 0 : roomPrice;
        orderTotal = Number(roomPrice);
        food_items.forEach(item => {
            if(!item.className.includes("hide")){
                orderTotal +=Number(item.querySelector(".food_price span").textContent);
            }
        })
        // let orderMenuPrice = document.querySelectorAll('#update__container .food_price');
        // let priceInMenuOrder = Array.from(orderMenuPrice).map(food => food.querySelector('span').innerHTML);
        document.querySelector("#order-total").innerHTML = setVND(orderTotal);
    })


    function checkValid(isAccepted, menu) {
        let typeFoodInMenu = document.querySelectorAll("#update__container .typeID");
        if (isAccepted == 3) return true;
        if (typeFoodInMenu.length == 0 && isAccepted < 2) { // Trường hợp menu lúc đầu bị rỗng
            alert("Vui lòng chọn tất cả loại thức ăn");
        } else if (InsertMode && isAccepted < 2) {
            alert("Vui lòng chọn tất cả các loại thức ăn !!");
        } else if (menu.deleteItems.length == 0) {
            return true;
        } else if (menu.deleteItems.length > 0) {
            if (isAccepted < 2) {
                let deleted_Items = document.querySelectorAll("#update__container .list-group-item");
                typeFood = ["TM", "KV", "AC"];
                let typeID = [];
                deleted_Items.forEach((item, index) => {
                    if (!item.className.includes("hide")) {
                        typeID.push(typeFoodInMenu[index].value);
                    }
                })
                let isEnough = typeFood.filter(element => {
                    return !typeID.includes(element);
                })
                if (isEnough.length < 2) { // Nếu có đủ thì trả về true, không thì false
                    return true;
                } else alert("Vui lòng chọn tất cả các loại thức ăn !!!!!");
            } else {
                return true;
            }
        }
        return false;
    }
    const checkInput = () => {
        const regexPhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
        const regexEmail = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
        const regexUsername = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăẮắẰằÂâẤấẦầƠơỚớỜờƯưỨứỪừĐđ\s]+$/;
        let userName = document.querySelector('#user-name').value;
        let userEmail = document.querySelector('#user-email').value;
        let phone = document.querySelector('#user-phone').value;
        let attendeesCount = document.querySelector('#attendeesCount').value;
        let orderDate = document.querySelector('#order-date').value;
        let order = {
            orderID,
            userName,
            userEmail,
            phone,
            roomID: room_select.value,
            orderDate,
            attendeesCount,
            tableCount: attendeesCount % 10 == 0 ? attendeesCount / 10 : attendeesCount / 10 + 1,
            serviceID: service.value,
            orderTotal
        }
        if (attendeesCount < minAttendeesCount) { // Nếu số lượng khách nhỏ hơn tối thiểu
            return "Số lượng khách không đạt yêu cầu !";
        }
        if (room_select.value == "") {
            return "Phòng tiệc chưa được đặt !";
        }
        if (regexPhoneNumber.test(phone) && regexUsername.test(userName)) {
            if (data.userEmail != "" && userEmail == "") { //nếu data lúc đầu có, lúc sau bị xóa
                if (confirm("Email khách hàng tồn tại những đã bị xóa. Xác nhận ?")) {
                    return order;
                }
                else {
                    return false;
                }
            }
            else if (data.userEmail == "" && userEmail != "") {
                if (regexEmail.test(userEmail)) {
                    return order;
                }
                else return "Email vừa thêm không hợp lệ !";
            } else {
                return order;
            }
        } else {
            return "Số điện thoại hoặc tên khách hàng không đúng !";
        }
    }
    $('#update_menu').click((event) => {
        event.preventDefault();
        let result = checkInput();
        if (result == false) {
            //Không làm gì cả
        } else if (typeof result == 'string') { // Có thông báo
            alert(`${result}`);
        }
        else {
            let isAccepted = 0;
            let menu = {
                order: result,
                insertItems: [],
                deleteItems: delete_items.length == 0 ? [] : delete_items,
            };
            choose_foodKV.forEach(item => {
                if (item.checked == true) {
                    isAccepted = 1;
                    let price = item.parentElement.parentElement.querySelector("span:first-child").innerHTML;
                    menu.insertItems.push({foodID:item.value,price:Number(price)});
                }
            });
            choose_foodAC.forEach(item => {
                if (item.checked == true) {
                    if (isAccepted == 1) {
                        isAccepted = 2;
                    }
                    let price = item.parentElement.parentElement.querySelector("span:first-child").innerHTML;
                    menu.insertItems.push({foodID:item.value,price:Number(price)});
                }
            });
            choose_foodTM.forEach(item => {
                if (item.checked == true) {
                    if (isAccepted == 2) {
                        isAccepted = 3;
                    }
                    let price = item.parentElement.parentElement.querySelector("span:first-child").innerHTML;
                    menu.insertItems.push({foodID:item.value,price:Number(price)});
                }
            });
            if (checkValid(isAccepted, menu) == true) {
                console.log("OK");
                menu.insertItems.forEach(item=>{
                    item.quantity = Number(menu.order.tableCount)
                });
                const menuForm = new FormData();
                menuForm.append('order',JSON.stringify(menu));
                $.ajax({
                        url: '/order/update-order',
                        type: 'POST',
                        data: menuForm,
                        cache: false,
                        contentType:false,
                        processData: false,
                        success: function(response) {
                            console.log(response);
                            if(response.success>0){
                                alert('Cập nhật đơn tiệc thành công');
                                document.getElementById("close_button").click();
                                document.querySelectorAll(".choose_food input").forEach(item => {
                                    if(item.checked==true){
                                        item.checked=false;
                                    }
                                });
                            } else {
                                alert("Không thành công! Vui lòng kiểm tra lại");
                            }
                        },
                        error: function(error) {
                            console.log(error);
                            alert(error);
                        }
                });

            } else {
                console.log("Thông tin muốn sửa không được phép ! Vui lòng thử lại !!");
            }

        }
    })
});
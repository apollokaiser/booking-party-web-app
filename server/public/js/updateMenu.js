
$(document).ready(function () {
    const choose_foodKV = document.getElementsByName('choose_foodKV');
    const choose_foodAC = document.getElementsByName('choose_foodAC');
    const choose_foodTM = document.getElementsByName('choose_foodTM');
    const menuID = document.getElementById('menuID').value;
    const menu_food = document.querySelector("#update__container .list-group");
    let delete_items = [];
    let InsertMode = false; // true khi đã xóa hết toàn bộ các phần tử của thực đơn


    $.each($(".delete_food"), function (index, item) { 
        $(item).click(()=>{
            let nextNode = $(item).next();
            delete_items.push($(nextNode).val());
            if(delete_items.length == $(".delete_food").length){
                InsertMode = true; //NOTE: Nếu xóa hết thì InsertMode = true
            }
            let parent = $(this).parent();
            $(parent).addClass("hide");
        });
})

    $(".reset").click((e)=>{
        e.preventDefault();
        delete_items =[];
        InsertMode = false;
        let menuList = $("#update__container .list-group-item");
        $.each(menuList,function(index, item) {
            let lastItem = item.lastElementChild;
            if(!lastItem.className.includes("temp_item"))
                $(item).removeClass("hide");
            else {
                choose_foodKV.forEach(item=>{
                    if(item.currentItem)
                    item.currentItem.click();
                });
                choose_foodAC.forEach(item=>{

                    if(item.currentItem)
                    item.currentItem.click();
                });
                choose_foodTM.forEach(item=>{
                    if(item.currentItem)
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
function addFoodIntoMenu(arrayFood){
    arrayFood.forEach(item=>{
        item.addEventListener('change',()=>{
            if(item.checked==true){
                item.currentCheck = true; // Thêm 1 thuộc tính tự tạo cho item để biết vừa check
                let MasterParent = item.parentElement.parentElement.parentElement.cloneNode(true);
                if(!checkExistFood(MasterParent.querySelector(".food_name").innerHTML)){
                let lastElement = MasterParent.lastElementChild;
                lastElement.lastElementChild.remove();
                lastElement.classList.add("col-sm-3");
                lastElement.classList.remove("d-flex");
                let delete_icon = document.createElement("i");
                delete_icon.classList.add("me-3", "fa-solid", "fa-xmark", "delete_food","temp_item");
                item.currentItem = delete_icon;
                delete_icon.addEventListener("click",(e)=>{
                    let thisItem = e.target;
                    thisItem.parentNode.classList.add("hide");
                    item.checked = false;
                })
                MasterParent.appendChild(delete_icon);
                menu_food.appendChild(MasterParent);
            }
            } else if(item.checked==false && item.currentCheck==true) {
                item.currentItem.click();
                item.currentCheck = false;

            }
        });
    })
}
addFoodIntoMenu(choose_foodKV);
addFoodIntoMenu(choose_foodAC);
addFoodIntoMenu(choose_foodTM);


function checkValid(isAccepted,menu) {
    let typeFoodInMenu = document.querySelectorAll("#update__container .typeID");
    if(isAccepted==3) return true; 
    if(typeFoodInMenu.length==0 && isAccepted <2) { // Trường hợp menu lúc đầu bị rỗng
        alert("Vui lòng chọn tất cả loại thức ăn");
    }else if(InsertMode && isAccepted <3){
        alert("Vui lòng chọn tất cả các loại thức ăn !!");
    }else if(menu.deleteItems.length ==0) {
        if(menu.insertItems.length == 0)
        alert("Bạn đang không làm gì cả !! Mọi thứ sẽ không thay đổi");
        else return true;
    } else if(menu.deleteItems.length >0){
        if(isAccepted<3){
           let deleted_Items = document.querySelectorAll("#update__container .list-group-item");
           typeFood = ["TM","KV","AC"];
           let typeID = [];
           deleted_Items.forEach((item,index)=>{
                if(!item.className.includes("hide")){
                    typeID.push(typeFoodInMenu[index].value);
                }
           })
           let isEnough = typeFood.filter(element=>{
                return !typeID.includes(element);
           })
            if(isEnough.length==0){ // Nếu có đủ thì trả về true, không thì false
                return true;
           } else{
            alert("Vui lòng chọn tất cả các loại thức ăn !! ")
               return false;
           }
        } else {
            return true;
        }
    }
    return false;
}

    $('#update_menu').click((event)=>{
        event.preventDefault();
        let isAccepted = 0;
        let menu = {
            menuID:menuID,
            insertItems: [],
            deleteItems: delete_items.length==0? [] :delete_items,
        };
        choose_foodKV.forEach(item => {
            if(item.checked==true){
                isAccepted = 1;
                menu.insertItems.push(item.value);
            }
        });
        choose_foodAC.forEach(item => {
            if(item.checked==true){
                if(isAccepted==1){
                    isAccepted = 2;
                }
                menu.insertItems.push(item.value);
            }
        });
        choose_foodTM.forEach(item => {
            if(item.checked==true){
                if(isAccepted==2){
                    isAccepted=3;
                }
                menu.insertItems.push(item.value);
            }
        });
        if(checkValid(isAccepted,menu)==true){ 
            const menuForm = new FormData();
            menuForm.append('menu',JSON.stringify(menu));
            $.ajax({
                    url: '/menu/update-menu',
                    type: 'POST',
                    data: menuForm,
                    cache: false,
                    contentType:false,
                    processData: false,
                    success: function(response) {
                        if(response.success > 0){
                            document.querySelector(".error_message.alert-success").classList.add("show");
                            document.getElementById("close_button").click();
                            document.querySelectorAll(".choose_food input").forEach(item => {
                                if(item.checked==true){
                                    item.checked=false;
                                }
                            });
                            setTimeout(() => {
                                document.querySelector(".error_message.alert-success").classList.remove("show");
                            },1000);
                        } else {
                            document.querySelector(".error_message.alert-danger").classList.add("show");
                        setTimeout(() => {
                            document.querySelector(".error_message.alert-danger").classList.remove("show");
                        },1000);
                        }
                    },
                    error: function(error) {
                        console.log(error);
                        alert(error);
                    }
            });
    
        }
    
    })
    });
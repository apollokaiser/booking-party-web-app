<script setup>
import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import instance from '@/config/axios';
import { setCurrency,shortDate } from '@/utils';
import { Total, checkCount } from '@/utils/ex-Methods';
const route = useRoute();
const prop = defineProps({
    user: Object, require: true
})
const menus = ref([]);
let orderParty = reactive({});
const emit = defineEmits(["click", "showParent"]);
const menuList = ref([]); // Danh sách menu theo dịch vụ
const menuListAll = ref([]); // Danh sách tất cả menu
const foodList = reactive({
    foodKV :[],
    foodAC:[],
    foodTM:[]
}); // Danh sách tất cả food
const checkFood = reactive({
    food: [],
    selected: [],
}); // Danh sách thức ăn được chọn
let orderDate = ref(""); // Chọn ngày đặt tiệc
const AvailableRoom = ref([]); // Danh sách phòng đang có sẵn (chưa được đặt)
const checkMenu = ref([]); // Danh sách menu được chọn
const check = reactive({
    selectedDate: false,
    not__available: false,
    isChooseFood: false,
    modal: false,
})
const selected_Room = reactive({
    room: "",
    selected: ""
});
const errorMessage = reactive({
    dateError: false,
    roomError: false,
    menuError: false,
})
const imageList = reactive({
    show:false,
    image1:"",
    image2:"",
    image3:"",
})
const createMenu = ref(false);
const makeMenu = ref(null);
const removeFood = ref(false);
const menubar = ref(false);
//NOTE: watch_Object
watch(orderDate, function (newValue) {
    let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (dateRegex.test(newValue)) {
        instance.post("/get-room",
            {
                orderDate: new Date(newValue),
                anyDate: false,
            }).then(response => {
                if (response.data.status == 200) {
                    let recommend_Room = response.data.roomEmpty;
                    check.selectedDate = false;
                    recommend_Room.forEach(room => {
                        if (prop.user.CountCustomer >= room.minCapicity && prop.user.CountCustomer <= room.maxCapicity && !check.selectedDate) {
                            selected_Room.room = room.roomID;
                            selected_Room.selected = room;
                            check.not__available = false;
                            check.selectedDate = true;
                            errorMessage.dateError = false;
                            errorMessage.roomError = false;
                        }
                    });
                    if(check.selectedDate ==false){
                        imageList.show = false;
                        check.not__available = true;
                    }
                    

                    AvailableRoom.value = response.data.roomEmpty;
                } else if (response.data.status == 404 || response.data.status == 500) {
                    check.not__available = true;
                    check.selectedDate = false;
                    imageList.show = false;
                }
            })
    }
})
watch(checkMenu, function (newValue, oldValue) {
    if (newValue.length > oldValue.length) {
        let lastElement = newValue.slice(-1)[0];
        let checkAllMenuItem = menuList.value.filter(t => t.info.menuID == lastElement)[0];
        checkAllMenuItem.detail.forEach(item => {
            if (!checkFood.food.includes(item.foodID)) {
                checkFood.food.push(item.foodID);
                checkFood.selected.push({ ...item, menuID: lastElement });
                removeFood.value = false;
            }
        })
        check.isChooseFood = true;
        errorMessage.menuError = false;
    } else if (newValue.length < oldValue.length && removeFood.value == false) {
        let removeMenuItem = oldValue.filter(item => !newValue.includes(item))[0];
        let removeMenu = checkFood.selected.filter(t => t.menuID == removeMenuItem);
        checkFood.selected = checkFood.selected.filter(t => t.menuID != removeMenuItem);
        removeMenu.forEach(item => {
            checkFood.food = checkFood.food.filter(t => t != item.foodID);
        })
        if (newValue.length == 0) {
            check.isChooseFood = false;
        }
    }
})
function checkFullMenu(){
    menus.value.forEach(menuElement =>{
        let item = menuElement.firstChild;
        let checkbox = Array.from(item.querySelectorAll(".list-group-item input"));
        let menuID = Number(item.querySelector(".checkMenu").value);
        if(checkbox.filter(t => t.checked ==true).length==checkbox.length) {
            removeFood.value = false;
            if(!checkMenu.value.includes(menuID)){
                checkMenu.value.push(menuID);
            }
        } else {
            checkMenu.value = checkMenu.value.filter(item=> item != menuID);
        }
    })
}
watch(checkFood, function (value) {
    let foods = [...foodList.foodKV, ...foodList.foodTM, ...foodList.foodAC];
    if (value.food.length > 0) check.isChooseFood = true;
    else check.isChooseFood = false;
    if (value.food.length > value.selected.length) { // Thêm food
        checkFullMenu();
        let insertFoodID = value.food.slice(-1)[0];
            let insertFood = foods.filter(item =>
            item.foodID == insertFoodID && !checkFood.selected.includes(item))[0];
            if (insertFood) {
                checkFood.selected.push(insertFood);
                if (orderParty.orderTotal) {
                    orderParty.orderTotal += insertFood.price;
                }
    }
    } else if (value.food.length < value.selected.length) {
        let removeItem = value.selected.filter(food => !value.food.includes(food.foodID))[0];
        value.selected = value.selected.filter(food => value.food.includes(food.foodID))
        removeFood.value = true;
        checkFullMenu();
        if (orderParty.orderTotal) {
            orderParty.orderTotal -= removeItem.price;
        }
    }
})
watch(selected_Room, function (newValue, oldValue) {
    selected_Room.selected = AvailableRoom.value.find(t => t.roomID == selected_Room.room);
    imageList.show = true;
    imageList.image1 = selected_Room.selected.image1;
    imageList.image2 = selected_Room.selected.image2;
    imageList.image3 = selected_Room.selected.image3;
})
//NOTE: get data before mount
onBeforeMount(() => {
    instance.get("/get-menu?allfood=true"
    ).then((respone) => {
        if (respone.data.status = 200) {
            foodList.foodKV = respone.data.foodList.foodKV;
            foodList.foodAC  = respone.data.foodList.foodAC;
            foodList.foodTM = respone.data.foodList.foodTM;
            menuListAll.value = respone.data.menuList;
            menuList.value = menuListAll.value.filter(
                t => t.info.serviceID == route.params.serviceID
            )
        }
    })
})
// NOTE: get Image path 
const getImagePath = image => {
    return "/images/foods/" + image;
}
const getImageRoom = image =>{
    return "/images/rooms/" + image;
}
const show_all = () => {
    menuList.value = menuListAll.value;
};
const returnParent = () => {
    emit('showParent', true);
}
const checkConfirm = () => {
    if (check.isChooseFood && !check.not__available && check.selectedDate) { //NOTE: IF đã cho phép và ngày không bị đầy
        if (checkMenu.value.length > 0) { //NOTE:Nếu chọn nguyên menu -> khỏi kiểm gì nữa
            check.modal = true;
            errorMessage.dateError = false;
            errorMessage.roomError = false;
            errorMessage.menuError = false;
            orderParty = Total(checkFood, prop.user,selected_Room);
            orderParty.orderDate = orderDate.value;
            orderParty.serviceID = route.params.serviceID;
            return true;
        } else {
            if (checkCount(checkFood)) {
                check.modal = true;
                orderParty = Total(checkFood, prop.user,selected_Room);
            orderParty.orderDate = orderDate.value;
            orderParty.serviceID = route.params.serviceID;
                errorMessage.dateError = false;
                errorMessage.roomError = false;
                errorMessage.menuError = false;
                return true;
            } else {
                errorMessage.menuError = true;
            }
        }
    } else {
        check.modal = false;
        if (check.isChooseFood == false) errorMessage.menuError = true;
        if (check.not__available == true || check.selectedDate == false) errorMessage.roomError = true;
        if (check.selectedDate == false) errorMessage.dateError = true;
        return false;
    }
};
const closeModal = () => {
    check.modal = false;
}
const result = reactive({
    message: "",
    orderId: "",
    show: false,
})
const sendOrder = () => {
    if (checkConfirm()) {
        closeModal();
        instance.post("/add-order", {
            orderParty
        }).then(response => {
            result.message = response.data.Message;
            result.orderId = response.data.orderID;
            result.show = true;
        }).catch(error => {
            result.message = error.response.data.Message;
            result.orderId = error.response.data.orderID;
            result.show = true;
        })
    } else {
        //NOTE: Xuất thông báo lỗi
    }
}
const get_all_food=()=>{
    createMenu.value = !createMenu.value;
    if(createMenu.value)
    makeMenu.value.innerHTML = "XEM THỰC ĐƠN CÓ SẴN";
    else 
    makeMenu.value.innerHTML = "TẠO THỰC ĐƠN CỦA BẠN";
}
const toggleMenuBar = () =>{
    menubar.value = !menubar.value;
}

</script>

<template>
    <div>
        <div class="order-list" :class="{show:menubar}">
            <div  class="order-container d-flex flex-column justify-content-between align-items-between">
                <h4 class="text-center text-success fw-bold mt-2">Thực đơn của bạn</h4>
                <div class="col-sm-12 mt-2">
                                    <ul class="list-group list-group-flush ">
                                        <li v-for="food in checkFood.selected"
                                            class="list-group-item d-flex justify-content-between align-items-start"
                                            :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                            <div class="food_info col-lg-6 d-flex justify-content-start align-items-center">
                                                <span class="food_name" :title="food.foodName">{{ food.foodName }}</span>
                                            </div>
                                            <div class="food_price">{{ setCurrency(food.price) }}</div>
                                            <input v-model="checkFood.food" type="checkbox"
                                                :value="food.foodID" name="checkFood">
                                        </li>
                                    </ul>
                                </div>
            </div>
            <div class="order-btn">
                <button @click.prevent="toggleMenuBar"><i class="fa-solid fa-chart-pie"></i></button>
            </div>
        </div>
        <h3 class="order-title text-center text-uppercase">Đặt bàn</h3>
        <div class="mb-3 d-flex justify-content-center align-items-center">
            <label for="orderDate" class="form-label">Chọn ngày đăt tiệc</label>
            <input v-model="orderDate" class="form-control" type="date" name="orderDate" id="orderDate">
        </div>
        <div class="mb-3 d-flex justify-content-center align-items-center">
            <label for="selected_Room" class="form-label">Phòng sẵn có</label>
            <span v-if="check.not__available" class="not__available">Phòng đã đầy hoặc ngày chọn không phù hợp. Trân trọng !</span>
            <select v-else v-model="selected_Room.room" name="selected_Room" class="form-select" id="selected_Room">
                <option :selected="{ selected: selected_Room.room == option.roomID }" v-for="option in AvailableRoom"
                    :key="option.roomID" :value="option.roomID">{{ option.roomName }}</option>
            </select>
        </div>
        <div v-if="imageList.show" class="room-image-preview d-flex justify-content-center">
            <div class="image-item">
                <img :src="getImageRoom(imageList.image1)" alt="image1">
            </div>
            <div class="image-item">
                <img :src="getImageRoom(imageList.image2)" alt="image2">
            </div>
            <div class="image-item">
                <img :src="getImageRoom(imageList.image3)" alt="image3">
            </div>
        </div>
        <h3 class="order-title text-center text-uppercase">thực đơn</h3>
        <div class="showAll d-flex justify-content-between align-items-center mx-5 mb-2">
            <button @click.prevent="show_all()" class="btn show_all">Xem tất cả</button>
            <button ref="makeMenu" @click.prevent="get_all_food()" class="btn show_all makeMenu">TẠO THỰC ĐƠN CỦA BẠN</button>
        </div>
        <h6 class="text-center"> <span class="text-danger">Đỏ</span> là món khai vị, <span class="text-warning">Vàng</span>
            là món ăn chính, <span class="text-primary">Xanh</span> là món tráng miệng</h6>
        <div v-if="!createMenu" class="menu_content d-flex justify-content-center align-items-center">
            <div v-for="item in menuList" class="card menus" ref="menus">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center card-title">
                        <span class="">{{ item.info.menuName }}</span>
                        <input v-model="checkMenu" class="checkMenu" type="checkbox" name="checkAll"
                            :value="item.info.menuID" :id="item.info.menuID">
                    </div>
                    <div class="card">
                        <ul class="list-group list-group-flush">
                            <li  v-for="food in item.detail"
                                class="list-group-item d-flex justify-content-between align-items-center"
                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                <div class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                    <div class="menu_image">
                                        <img :src="getImagePath(food.image)" :alt="food.image">
                                    </div>
                                    <span class="food_name" title="Haha">{{ food.foodName }}</span>
                                </div>
                                <div class="food_price col-lg-3">{{ setCurrency(food.price) }}</div>
                                <input v-model="checkFood.food" class="me-2" type="checkbox" :value="food.foodID"
                                    name="checkFood">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="create_menu d-flex flex-wrap justify-content-between align-items-center">
                <div class="col-sm-6">
                    <div class="card">
                        <h4 class="text-center"><i class="fa-solid fa-mug-hot me-2"></i>Khai vị</h4>
                        <ul class="list-group list-group-flush">
                            <li v-for="food in foodList.foodKV"
                                class="list-group-item d-flex justify-content-between align-items-center"
                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                <div class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                    <div class="menu_image">
                                        <img :src="getImagePath(food.image)" :alt="food.image">
                                    </div>
                                    <span class="food_name" title="Haha">{{ food.foodName }}</span>
                                </div>
                                <div class="food_price col-lg-3">{{ setCurrency(food.price) }}</div>
                                <input v-model="checkFood.food" class="me-2" type="checkbox" :value="food.foodID"
                                    name="checkFood">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card">
                        <h4 class="text-center"><i class="fa-solid fa-burger me-2"></i>Ăn chính</h4>
                        <ul class="list-group list-group-flush">
                            <li v-for="food in foodList.foodAC"
                                class="list-group-item d-flex justify-content-between align-items-center"
                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                <div class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                    <div class="menu_image">
                                        <img :src="getImagePath(food.image)" :alt="food.image">
                                    </div>
                                    <span class="food_name" title="Haha">{{ food.foodName }}</span>
                                </div>
                                <div class="food_price col-lg-3">{{ setCurrency(food.price) }}</div>
                                <input v-model="checkFood.food" class="me-2" type="checkbox" :value="food.foodID"
                                    name="checkFood">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-sm-6 mt-3">
                    <div class="card">
                        <h4 class="text-center"><i class="fa-solid fa-burger me-2"></i>Tráng miệng</h4>
                        <ul class="list-group list-group-flush">
                            <li v-for="food in foodList.foodTM"
                                class="list-group-item d-flex justify-content-between align-items-center"
                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                <div class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                    <div class="menu_image">
                                        <img :src="getImagePath(food.image)" :alt="food.image">
                                    </div>
                                    <span class="food_name" title="Haha">{{ food.foodName }}</span>
                                </div>
                                <div class="food_price col-lg-3">{{ setCurrency(food.price) }}</div>
                                <input v-model="checkFood.food" class="me-2" type="checkbox" :value="food.foodID"
                                    name="checkFood">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        <em class="d-block text-danger mt-3" v-if="errorMessage.dateError">Ngày chưa được chọn hoặc không hợp lệ</em>
        <em class="d-block text-danger mt-3" v-if="errorMessage.roomError">Phòng chưa được chọn hoặc đã đầy</em>
        <em class="d-block text-danger mt-3" v-if="errorMessage.menuError">Món phải có ít nhất 2 loại thức ăn</em>
        <div class="d-flex justify-content-center align-items-center mt-3">
            <button class="btn return_parent me-5 fw-bold" @click.prevent="returnParent()"><i
                    class="fa-solid fa-angles-left me-1"></i>Trở lại</button>
            <button class="btn confirm" :class="{ not_confirm: !check.isChooseFood }" @click.prevent="checkConfirm()">Xác
                nhận</button>
        </div>
        <transition name="slide" mode="out-in">
            <div v-if="check.modal" class="check_confirm modal fade" aria-hidden="true" :class="{ show: check.modal }">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-center text-uppercase ms-1" id="corfirm_order_label">
                                <i class="fa-solid fa-cart-arrow-down me-2"></i>Xác nhận thông tin đặt tiệc
                            </h5>
                            <div class="orderPrice d-flex col-sm-2 justify-content-between me-4"> <span>{{
                                setCurrency(orderParty.orderTotal) }}</span>
                                <button @click.prevent="closeModal" type="button" class="btn-close ms-5"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="orderInfo d-flex justify-content-between align-items-start">
                                <div class="col-sm-5 flex-column d-flex justify-content-start">
                                    <i class="fa-solid fa-crown text-warning"></i>
                                    <h5 class="text-success fw-bold">Thông tin khách hàng</h5>
                                    <div class="info_item">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Tên khách hàng: </div>
                                                <div class="">{{ orderParty.userName }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Email: </div>
                                                <div class="">{{ orderParty.userEmail || "Không" }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Số điện thoại: </div>
                                                <div class="">{{ orderParty.SDT }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Số lượng khách: </div>
                                                <div class=""><span>{{ orderParty.CountCustomer }}</span><span class="ms-2">(người)</span></div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Số lượng bàn: </div>
                                                <div class=""><span>{{ orderParty.tableCount }}</span><span class="ms-2">(bàn)</span></div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Ngày đặt tiệc:  </div>
                                                <div class="">{{ shortDate(orderParty.orderDate) }}</div>
                                            </li>

                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Số phòng đặt tiệc: </div>
                                                <div class="">{{ orderParty.roomID }}</div>
                                            </li>
                                        </ul>
                                    </div>
                                    <h5 class="text-success fw-bold mt-3">Thông tin phòng đặt tiệc</h5>
                                    <div class="info_item">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Mã phòng tiệc: </div>
                                                <div class="">{{ orderParty.roomID }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Tên phòng tiệc: </div>
                                                <div class="">{{ orderParty.room.roomName }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Tầng: </div>
                                                <div class="">{{ orderParty.room.floor }}</div>
                                            </li>
                                            <li class="list-group-item">
                                                <div class="fw-bold mx-2">Giá thuê: </div>
                                                <div class="">{{ setCurrency(orderParty.room.price) }}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="menu_info col-sm-6">
                                    <ul class="list-group list-group-flush">
                                        <li v-for="food in orderParty.foodInfos"
                                            class="list-group-item d-flex justify-content-between align-items-center"
                                            :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                            <div class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                                <span class="food_name" title="Haha">{{ food.foodName }}</span>
                                            </div>
                                            <div class="food_price col-lg-3">{{ setCurrency(food.price) }}</div>
                                            <input v-model="checkFood.food" class="me-2" type="checkbox"
                                                :value="food.foodID" name="checkFood">
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button @click.prevent="closeModal" type="button" class="btn btn-secondary"
                                data-bs-dismiss="modal">Thoát</button>
                            <button @click.prevent="sendOrder()" type="button" class="btn btn-primary">Lưu thông
                                tin</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="slide" mode="out-in">
            <div v-if="result.show">
                <div class="result modal" tabindex="-1" style="display: block;">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 v-if="result.orderId!=0" class="modal-title">Xác nhận đơn tiệc thành công</h5>
                                <h5 v-else>Đơn đặt tiệc đã thất bại !</h5>
                                <button @click.prevent="result.show=false" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p id="result_message">
                                    <i v-if="result.orderId==0" class="fa-regular fa-face-sad-tear ms-3"></i>
                                    <i v-else class="fa-regular fa-face-grin-squint-tears"></i>
                                    <span>{{ result.message }}</span>
                                </p>
                                <p v-if="result.orderId!=0">Mã đặt tiệc của bạn là: <span class="fw-bold">{{result.orderId }}</span></p>
                                <p v-if="result.orderId!=0">Vui lòng ghi nhớ và không chia sẻ mã đơn hàng với bất kỳ người nào !</p>
                            </div>
                            <div class="modal-footer">
                                <button @click.prevent="result.show=false" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateX(-30%);
}

input[type="checkbox"] {
    display: inline-block;
    padding: 2px;
    font-size: 15px;
    width: 15px;
    height: 15px;
    outline: none;
    box-shadow: 2px 1px 2px 1px rgba(0, 0, 0, 0.5);
}
.room-image-preview{
    width: 100%;
}
.room-image-preview div{
    width: 25%;
    height: 150px;
    margin-right: 10px;
    padding: 2px;
    border: 1px solid crimson;
    border-radius: 5px;
}
.room-image-preview img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    object-position: center;
}
.check_confirm.modal {
    display: block !important;
    max-width: 100%;
    max-height: 88%;
}
.check_confirm .modal-title {
    color: #d8a902;
    font-weight: 700;
}
.modal-header,.modal-body,.modal-footer {
border: none !important;
} 

.modal-title i {
    font-size: 40px;
    color: crimson;
}

@media (min-width: 576px) {
    .check_confirm .modal-dialog {
        max-width: 70%;
        max-height: 50%;
        margin: 1.75rem auto;
    }
}

.checkMenu {
    border: none !important;
    outline: none !important;
    width: 20px !important;
    height: 20px !important;
    box-shadow: none !important;
}

.form-control#orderDate,
.form-select#selected_Room {
    width: 50%;
    margin-left: 20px;
    border-radius: 4px !important;
    border: 1px solid #60c515;
    color: darkblue !important;
}

.form-label {
    width: 30% !important;
}
.not__available {
    color: red;
    font: 16px;
    font-weight: 600;
    display: inline-block;
    padding: 5px;
    width: 100%;
    background-color: #60c515;
}
.menu_content {
    width: 100%;
    flex-wrap: wrap;
    margin: 0;
    padding: 0 0 !important;
}
.menu_content>.card {
    width: 360px;
    height: 350px;
    border-radius: 1% !important;
    border: 1px solid #60c515;
    margin: 20px 15px 0 0 !important;
    overflow: hidden;
}
.menu_content .card .card-title {
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    text-transform: uppercase;
    line-height: 5px !important;
    display: inline-block;
    padding: 20px;
    margin: 0 0 0 !important;
    background-color: #60c515;
    width: 100%;
}
.menu_content .card .card-body {
    width: 100%;
    height: 100%;
    padding: 0 !important;
}
.card .card {
    border-radius: 0% !important;
    width: 100% !important;
    height: 87%;
    margin-bottom: 12px !important;
    padding-bottom: 20px !important;
    border-bottom: 1px dashed #ccc;

}

.card .list-group-item {
    height: 70px;
    padding: 3px !important;

}
.card li {
    border-bottom: 1px dashed #ccc;
}
.card ul {
    height: 100%;
    overflow-y: auto;
}
.food_info {
    height: 100%;
}
.food_info .menu_image {
    width: 27%;
    margin-right: 7px;
}
.food_name {
    width: 70%;
    font-weight: 500;
}
.show_all {
    color: #60c515;
    border: 1px solid #d8a902;
}
.return_parent {
    display: inline-block;
    width: 20%;
    color: #060606;
    background-color: #ccc;
    border: 1px solid #d8a902;
    outline: none;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.7);
}
.return_parent i {
    font-size: 20px;
}
.confirm,
.not_confirm {
    width: 20%;
    border: 1px solid #d8a902;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.7);
    display: inline-block;
    font-weight: 600;
    text-transform: uppercase;
}
.confirm {
    background-color: rgb(17, 0, 255);
    color: #fff;
}
.not_confirm {
    background-color: #ccc !important;
    color: #060606 !important;
}
.not_confirm:hover {
    background-color: #fff !important;
}
.btn {
    transition: none !important;
}
.btn:active {
    border: none !important;
    outline: none !important;
}
.confirm:hover {
    color: #d8a902;
}
.main_food {
    color: #d8a902;
    font-weight: 600;
}
.dessert_food {
    color: #0d02d8;
    font-weight: 600;
}
.appetizer_food {
    color: rgb(216, 45, 2);
    font-weight: 600;
}
.orderInfo i {
    font-size: 30px;
}
.info_item {
    width: 90%;
    border: 2px dashed #d8a902;
}
.info_item .list-group {
    width: 100%;
   /* margin: 0 auto;*/
}
.info_item .list-group-item {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border: none !important;
    width: 100%;
}
.info_item .list-group-item.room_info {
    justify-content: center;
    flex-direction: column !important;
    align-items: center;
    font-size: 20px;
    border: none !important;
}
.menu_info {
    max-height: 100vh;
    overflow: auto;
    padding-bottom: 20px;
}
.orderPrice {
    color: #0d02d8;
    font-weight: 600;
}
.result{
    background-color: rgba(0,0,0,0.7);
}
.result .modal-content{
    background-color: blanchedalmond;
}
.result .modal-header {
    color: #0d02d8;
}
#result_message{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}
#result_message i{
    font-size: 60px;
    color: brown;
    margin-bottom: 15px;
}
#result_message span{
    font-size: 20px;
    color: #d8a902;
}
.create_menu .card{
    min-height: 400px;
    max-height: 500px;
    overflow-y: auto;
}
.create_menu .col-sm-6{
    width: 48%;
}
.order-list{
    position: fixed;
    bottom: 4%;
    right: 0%;
    width: 400px;
    height: 0px;
    background-color: transparent;
    transition: all 0.5s;
}
.order-list.show{
    height: 500px;
    z-index: 500;
    transition: all 0.5s;
}
.order-list .order-btn{
    position: absolute;
    right: 5%;
    bottom:5%;
    margin-top: 10px;
}
.order-list .order-btn button {
    padding: 10px 15px;
    border: none;
    outline: none;
    font-size: 30px;
    background-color: #d8a902;
    color: crimson;
    border-radius: 50%;
}
.order-list .order-container{
    background-color: #fff;
    width: 100%;
    height: 0%;
    transition: all 0.5s;
}
.order-list.show .order-container{
    height: 85%;
    border: 2px solid #d8a902;
    transition: all 0.3s;
}
.order-list.show .order-container h4{
    display: block;
    transition: display 0.5s;
}
.order-list .order-container h4{
    display: none;
    transition: display 0.5s
}
.order-list .order-container .col-sm-12{
    height: 96%;
}
.order-list .order-container ul{
    width: 100%;
    height: 90%;
    overflow-y: auto;
}
</style>
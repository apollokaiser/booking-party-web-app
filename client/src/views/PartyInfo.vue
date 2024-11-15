<script setup>
import { ref, reactive, watch } from 'vue';
import instance from '@/config/axios';
import { setCurrency, shortDate, getDateDiff, formatDate, checkDate,checkDateUpdate } from '@/utils';
import { checkCount,Validate } from '@/utils/ex-Methods';
const orderID = ref("");
const AvailableRoom = ref([]);
const SuitableRoom = ref([]); // NOTE: Dùng để lưu các phòng phù hợp với số lượng khách
const resultStatus = reactive({
    finded: false,
    success: false,
});
const confirm_handle = reactive({
    spending: true,
    success: false,
    outdate: false,
})
const deleteModalCrtl = reactive({
    openModal: false,
    deleteDirectly: false,
    notAllowed: false,
    orderID: null,
})
const updateCrtl = reactive({
    openModal: false,
    selected_food: [],
    foodList: [],
})
let order_info = reactive({
    adminID: "",
    attendeesCount: "",
    deposit: "",
    isConfirm: "",
    orderDate: "",
    orderID: "",
    orderTotal: 0,
    phone: "",
    tableCount: 0,
    userEmail: "",
    userName: "",
    detail: [],
    service: {},
    room: {},
    admin_name: "",
});
let order_info_update = reactive({
    adminID: "",
    attendeesCount: "",
    deposit: "",
    isConfirm: "",
    orderDate: "",
    orderID: "",
    orderTotal: 0,
    phone: "",
    tableCount: 0,
    userEmail: "",
    userName: "",
    detail: [],
    service: {},
    room: {},
    roomID: "",
    serviceID:"",
    admin_name: "",
});
const selected_Room = reactive({
    room: "",
    selected: {},
    autoSelected: false,
})
const foodList = reactive({
    foodKV: [],
    foodAC: [],
    foodTM: []
});
const checkFood = reactive({
    food: [],
    selected: [],
});
const check = reactive({
    selectedDate: false,
    not__available: false,
    isChooseFood: false,
    isEmptyFood: false,
    removeFood: false,
})
const firstLoad = ref(true);
watch(
    () => order_info_update.orderDate, (newValue, oldValue) => {
        if (updateCrtl.openModal) {
            if (firstLoad.value == false) {
                if (order_info_update.attendeesCount >= 5 || (order_info_update.attendeesCount >= 2 && order_info_update.service.serviceID == "SN")) { // True
                    if (checkDate(order_info.orderDate, newValue)) {
                        instance.post("/get-room",
                            {
                                orderDate: new Date(newValue),
                                anyDate: true,
                            }).then(response => {
                                if (response.data.status == 200) {
                                    console.log("Chạy ở nơi này nè !!");
                                    selected_Room.room = order_info.room.roomID;
                                    selected_Room.selected = order_info.room;
                                    if(shortDate(newValue) != shortDate(order_info.orderDate)) {
                                        if(response.data.roomEmpty.filter(item=> item.roomID == order_info.room.roomID).length== 0) {
                                            alert("Ngày chọn của bạn đã đầy");
                                            order_info_update.orderDate = order_info.orderDate;
                                        }
                                    } else {
                                        response.data.roomEmpty.push(selected_Room.selected);
                                        AvailableRoom.value = response.data.roomEmpty;
                                    }
                                }
                            })
                    } else {
                        alert("Ngày chọn của bạn không thích hợp");
                        order_info_update.orderDate = order_info.orderDate;
                    }
                } else {
                    alert(order_info_update.service.serviceID == "SN" ? "Số lượng khách phải lớn hơn 2 của bạn không thích hợp" : "Số lượng khách phải lớn hơn 2 của bạn không thích hợp");
                    order_info_update.attendeesCount = order_info.attendeesCount;
                }
            }
        }
    }
)
watch(
    () => order_info_update.attendeesCount,
    (newValue, oldValue) => {
        if (firstLoad.value == false) {
            order_info_update.tableCount = Math.floor(newValue/10);
            if(newValue %10 !=0){
                order_info_update.tableCount +=1;
            }
            getOrderTotal();
            SuitableRoom.value = getSuitableRoom(AvailableRoom.value);
        }
    }
)
watch(
    () => selected_Room.room,
    (newValue, oldValue) => {
        if (firstLoad.value == false) { // Không phải lần đầu load => thực hiện
            if (selected_Room.autoSelected == true) {  // Nếu phòng được chọn do sự kiện cho ngày hoặc nhập số khách => thực hiện
                if (newValue == order_info.room.roomID) {
                    selected_Room.selected = order_info.room;
                } else {
                    selected_Room.selected = SuitableRoom.value.filter(room => room.roomID == newValue)[0];
                 
                }
                selected_Room.autoSelected == false; // Gán lại cho nó bình thường
            } else {  // Nếu chọn thủ công
                if (newValue == order_info.room.roomID) {
                    selected_Room.selected = order_info.room;
                } else {
                    selected_Room.selected = SuitableRoom.value.filter(room => room.roomID == newValue)[0];
                }
            }
        }
        order_info_update.room = selected_Room.selected;
        getOrderTotal();
    }
)
watch(AvailableRoom, (newValue, oldValue) => {
    SuitableRoom.value = getSuitableRoom(newValue);
});
watch(
    ()=>checkFood.food,
    (newValue, oldValue)=>{
        let foods = [...foodList.foodKV, ...foodList.foodTM, ...foodList.foodAC];
        if(newValue.length == 0) check.isEmptyFood = true; // Menu người dùng bị rỗng
        else {
            if(newValue.length > checkFood.selected.length) { // Thêm 
                let insertFoodID = newValue.slice(-1)[0];
            let insertFood = foods.filter(item =>
            item.foodID == insertFoodID && !checkFood.selected.includes(item))[0];
            if (insertFood) {
                checkFood.selected.push(insertFood);
            }
        } else if(newValue.length < checkFood.selected.length){
            let removeItem = checkFood.selected.filter(food => !newValue.includes(food.foodID))[0];
            checkFood.selected = checkFood.selected.filter(food => newValue.includes(food.foodID));
            check.removeFood = true;
        }
        }
        getOrderTotal();
    }
)
const getOrderTotal = ()=>{
    order_info_update.orderTotal = selected_Room.selected.price;
    let total = 0;
    checkFood.selected.forEach(food => {
        food.quantity =  order_info_update.tableCount;
        total += food.price * order_info_update.tableCount;
    });
    order_info_update.orderTotal += total;
}
const getOrder = () => {
    const url = `/get-order/${orderID.value}`;
    instance.get(url).then(respone => {
        if (respone.data) {
            getOrder_info(respone.data);
            if (respone.data.isConfirm == null) {
                confirm_handle.spending = true;
                confirm_handle.success = false;
                confirm_handle.outdate = false;
                deleteModalCrtl.deleteDirectly = true;
                deleteModalCrtl.notAllowed = false;
            } else {
                confirm_handle.spending = false;
                confirm_handle.success = true;
                deleteModalCrtl.deleteDirectly = false;
                deleteModalCrtl.notAllowed = false;
                confirm_handle.outdate = false;
                if(checkDateUpdate(order_info.orderDate,true)){
                    deleteModalCrtl.notAllowed = true;
                    confirm_handle.success = false;
                    confirm_handle.outdate = true;
                    
                }
            }
        } else {
            resultStatus.finded = true;
            resultStatus.success = false;

        }
    })
}
const getOrder_info = (order) => {
    resultStatus.finded = true;
    resultStatus.success = true;
    order_info.adminID = order.adminID;
    order_info.attendeesCount = order.attendeesCount;
    order_info.deposit = order.deposit;
    order_info.isConfirm = order.isConfirm;
    order_info.orderDate = formatDate(order.orderDate, "yyyy-MM-dd");
    order_info.orderID = order.orderID;
    order_info.orderTotal = order.orderTotal;
    order_info.phone = order.phone;
    order_info.tableCount = order.tableCount;
    order_info.userEmail = order.userEmail == null ? "Không có" : order.userEmail;
    order_info.userName = order.userName;
    order_info.detail = order.detail;
    order_info.service = order.service;
    order_info.room = order.room;
    order_info.admin_name = order.admin_name;
    createUpdateInfo();
    firstLoad.value = false;
}
const createUpdateInfo = () => {
    order_info_update.adminID = order_info.adminID
    order_info_update.deposit = order_info.deposit
    order_info_update.isConfirm = order_info.isConfirm
    order_info_update.orderID = order_info.orderID
    order_info_update.orderTotal = order_info.orderTotal
    order_info_update.phone = order_info.phone
    order_info_update.tableCount = order_info.tableCount
    order_info_update.userEmail = order_info.userEmail
    order_info_update.userName = order_info.userName
    order_info_update.detail = Array.from(order_info.detail);
    order_info_update.service = order_info.service;
    order_info_update.room = order_info.room
    order_info_update.orderDate = order_info.orderDate
    order_info_update.attendeesCount = order_info.attendeesCount
    order_info_update.admin_name = order_info.admin_name;
    selected_Room.room = order_info.room.roomID;
    selected_Room.selected = order_info.room;
    checkFood.selected = order_info_update.detail;
    checkFood.food = order_info_update.detail.map(food => food.foodID);
}
const showDeleteModal = () => {
    if (!deleteModalCrtl.notAllowed) {
        deleteModalCrtl.openModal = true;
    } else {
        alert("Đơn tiệc của bạn đang diễn ra hoặc đã hoàn thành. Mọi chức năng cập nhật đã tạm khóa !");
    }
}
const getFoodUpdate = () => {
    if(!checkDateUpdate(order_info.orderDate)){
        alert("Đơn tiệc của bạn đang diễn ra hoặc đã hoàn thành. Mọi chức năng cập nhật đã tạm khóa !");
        return ;
    }
    updateCrtl.openModal = !updateCrtl.openModal;
    instance.get("/get-menu?allfood=true"
    ).then((respone) => {
        if (respone.data.status = 200) {
            foodList.foodKV = respone.data.foodList.foodKV;
            foodList.foodAC = respone.data.foodList.foodAC;
            foodList.foodTM = respone.data.foodList.foodTM;
        }
    })
    instance.post("/get-room",
        {
            orderDate: new Date(order_info.orderDate),
            anyDate: true,
        }).then(response => {
            if (response.data.status == 200) {
                console.log(response.data.roomEmpty);
                response.data.roomEmpty.push(selected_Room.selected);
                AvailableRoom.value = response.data.roomEmpty;
            }
        })
}
const deleteOrderHandle = () => {
    if (deleteModalCrtl.deleteDirectly) {
        instance.post("/delete-order", {
            orderID: orderID.value
        }).then(response => {
            if (response.data == true) {
                alert("Xóa thành công");
                orderID.value = null;
                resultStatus.finded = true;
                resultStatus.success = false;
                deleteModalCrtl.openModal = false;
            } else {
                alert("Xóa thất bại");
            }
        }).catch(error => {
            console.log(error);
        })
    }
    else {
        if (deleteModalCrtl.orderID == orderID.value) {
            instance.post("/delete-request", {
                orderID: orderID.value
            }).then(response => {
                if (response.data == true) {
                    alert("Đã gửi yêu cầu ! Vui lòng chờ thông báo !!");
                    orderID.value = null;
                    resultStatus.finded = true;
                    resultStatus.success = false;
                    deleteModalCrtl.openModal = false;
                } else {
                    alert("Xóa thất bại");
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            alert("Mã đặt tiệc không đúng ! Vui lòng nhập lại !!");
        }
    }
}
const getSuitableRoom = (rooms) => {
    if (updateCrtl.openModal) {
        let suitableRooms = [];
        if (order_info_update.attendeesCount >= 5 || (order_info_update.attendeesCount >= 2 && order_info_update.service.serviceID == "SN")) {
            let maxCapacityRoom = rooms[0];
            rooms.forEach(room => {
                if (room.maxCapicity > maxCapacityRoom.maxCapicity) {
                    maxCapacityRoom = room;
                }
            });
            if (order_info_update.attendeesCount >= maxCapacityRoom.maxCapicity) {
                selected_Room.autoSelected = true;
                selected_Room.room = maxCapacityRoom.roomID;
                return rooms.filter(room => room.maxCapicity == maxCapacityRoom.maxCapicity);
            }
            suitableRooms = rooms.filter(room => order_info_update.attendeesCount >= room.minCapicity && order_info_update.attendeesCount <= room.maxCapicity);
            const isExisted = suitableRooms.find(room => room.roomID == order_info.room.roomID);
            if (isExisted == undefined) { // Nếu không tồn tại thì gán bằng 1 cái khác
                selected_Room.autoSelected = true;
                selected_Room.room = suitableRooms[0].roomID;
            } else {
                selected_Room.autoSelected = true;
                selected_Room.room = order_info.room.roomID;
            }
            return suitableRooms;
        }
        else {
            selected_Room.autoSelected = true;
            selected_Room.room = order_info.room.roomID;
            return null;
        }
    }

}
const closeModal = () => {
    updateCrtl.openModal = false;
}
const getImagePath = image => {
    return "/images/rooms/" + image;
}
const getFoodImagePath = (image)=>{
    return "/images/foods/" + image;
}
const createData = () => {
    // tạo 1 đối tượng tên order để bắt bằng req.body.order
    //  order: { 
   //     order: {thông tin đặt tiệc},
   //     insertItems:[],
   //     deleteItems:[]
   //    }
        const order = {
            order: order_info_update,
            insertItems:[],
            deleteItems:[]
        }
        const removeItems = order_info.detail.filter(food => order_info_update.detail.find(item => item.foodID == food.foodID)==undefined);
        order.deleteItems = removeItems.map(food =>food.foodID);
        order.insertItems = order_info_update.detail.filter(food => order_info.detail.find(item => item.foodID == food.foodID)==undefined);
        return order;
}
const sendOrder=()=>{
   if(checkCount(checkFood)){
    if(Validate(order_info_update.phone, order_info_update.userEmail, order_info_update.userName)){
        order_info_update.detail = Array.from(checkFood.selected);
        order_info_update.roomID = order_info_update.room.roomID;
        order_info_update.serviceID = order_info_update.service.serviceID;
        const order = createData();
        instance.post("/update-order",{
            order:order,
        }).then(respone=>{
            if(respone.data.success==true){
                alert("Cập nhập thông tin thành công");
                getOrder_info(order_info_update);
                closeModal();
            } else alert("Đã có lỗi phát sinh ! Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi !!");
        }).catch(err=>{
            console.log(err);
        });
    } else {
        alert("Vui lòng kiểm tra thông tin khách hàng !!");
    }
   } else {
    alert("Cần ít nhất 1 món cho mỗi loại và cần ít nhất 2 loại !!!");
   }
}
</script>
<template>
    <div class="container my-3 info-container">
        <div class="find-my-order d-flex justify-content-start align-items-center">
            <span @click="getOrder" class="search-order"><i class="fa-solid fa-magnifying-glass"></i></span>
            <input v-model="orderID" @keyup.enter="getOrder" type="text" placeholder="Tìm kiếm">
        </div>
        <div v-if="resultStatus.finded && !resultStatus.success"
            class="error-message col-sm-5 col-lg-5 mx-auto mt-5 text-center">
            <div>Rất tiếc ! Không thể tìm thấy thông tin đặt tiệc của bạn !</div>
            <div><i class="fa-regular fa-face-frown"></i></div>
        </div>
        <div v-if="resultStatus.finded && resultStatus.success" class="info mt-5 px-3 py-2">
            <div class="col-sm-4">
                <h4 class="text-center">Thông tin đặc tiệc</h4>
                <div class="confirm-status d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check">Tình trạng: <span
                            :class="{ spending: confirm_handle.spending, success: confirm_handle.success, 'out-date': confirm_handle.outdate }"
                            class="spending fst-italic">
                            <span v-if="confirm_handle.spending"> <i class="fa-solid fa-spinner me-2"></i>Đang xử lý</span>
                            <span v-if="confirm_handle.success"><i class="fa-solid fa-user-check me-2"></i>Đã xác
                                nhận</span>
                            <span v-if="confirm_handle.outdate"><i class="fa-regular fa-calendar-xmark"></i>Đã hoàn
                                thành</span>
                        </span>

                    </div>
                    <div>Loại hình tiệc: <span class="text-capitalize">{{ order_info.service.serviceName }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span class="text-success">Mã phòng: </span><strong
                            class="text-primary">{{ order_info.room.roomID }}</strong></div>
                    <div class="confirm-check fst-italic fw-bold"><span class="text-success">Tên phòng: </span><strong
                            class="text-primary">{{ order_info.room.roomName }}</strong></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Tên khách hàng:</span></div>
                    <div><span>{{ order_info.userName }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Email:</span></div>
                    <div><span>{{ order_info.userEmail }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Số điện thoại:</span></div>
                    <div><span>{{ order_info.phone }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Ngày đặt tiệc:</span></div>
                    <div><span>{{ shortDate(order_info.orderDate) }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Lượng khách tham gia:</span></div>
                    <div><span class="me-1">{{ order_info.attendeesCount }}</span><em>(người)</em></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Tầng:</span></div>
                    <div><span class="me-1">{{ order_info.room.floor }}</span></div>
                </div>
                <div class=" d-flex justify-content-between align-items-center mt-3">
                    <div class="confirm-check fst-italic fw-bold"><span>Tình trạng:</span></div>
                    <div><span class="me-1">{{ order_info.room.status != null ? order_info.room.status : "Bình thường"
                    }}</span>
                    </div>
                </div>
                <div class=" d-flex justify-content-center align-items-center mt-3">
                    <div class="update-btn">
                        <button :class="{ notallowed: confirm_handle.outdate}" @click.prevent="showDeleteModal()">Hủy bỏ đặt
                            tiệc</button>
                        <button :class="{notallowed: !checkDateUpdate(order_info.orderDate)}" @click.prevent="getFoodUpdate()">Sửa đơn tiệc</button>
                    </div>
                </div>
            </div>
            <div class="d-flex col-sm-1 justify-content-center">
                <div class="devide_info"></div>
            </div>
            <div class="col-sm-7 me-2 d-flex flex-column justify-content-center align-items-between">
                <div>
                    <h4 class="text-center">Thông tin thực đơn</h4>
                    <div class="menu-header">
                        <div class="col-sm-3">Tên món ăn</div>
                        <div class="col-sm-9 d-flex justify-content-evenly align-items-center">
                            <div>Đơn giá</div>
                            <div>Số lượng</div>
                            <div>Giá tiền</div>
                        </div>
                    </div>
                    <div class="menu-list">
                        <div v-for="food in order_info.detail" class="menu-item"
                            title="Cá kho ngon nhứt loz, bay cao nào nhảy cao nào">
                            <div class="col-sm-3" title="Cá kho ngon nhứt loz, bay cao nào nhảy cao nào">{{ food.foodName }}
                            </div>
                            <div class="col-sm-9 d-flex justify-content-evenly align-items-center">
                                <div>{{ setCurrency(food.orderPrice || food.price) }}</div>
                                <div>{{ food.quantity }}</div>
                                <div>{{ setCurrency(food.quantity * (food.orderPrice|| food.price)) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="menu-footer">
                    <div v-if="confirm_handle.success" class="col-sm-5 admin-confirm">
                        <div><strong>Xác nhận của nhân viên quản lý</strong></div>
                        <div class="fst-italic">(Đã xác nhận)</div>
                        <div class="fst-italic"><span>Nv.</span><em><strong>{{ order_info.admin_name }}</strong></em></div>
                    </div>
                    <div class="d-flex flex-column order-total">
                        <div class="d-flex justify-content-evenly align-items-center mb-2">
                            <div><strong>Tiền phòng:</strong></div>
                            <div>{{ setCurrency(order_info.room.price) }}</div>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-evenly align-items-center">
                            <div><strong>Tổng tiền:</strong></div>
                            <div>{{ setCurrency(order_info.orderTotal) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <transition name="slide" mode="out-in">
                <div v-if="deleteModalCrtl.openModal" class="modal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Xóa đơn tiệc</h5>
                                <button type="button" class="btn-close"
                                    @click="deleteModalCrtl.openModal = !deleteModalCrtl.openModal"></button>
                            </div>
                            <div class="modal-body">
                                <p class="text-center fw-bold">Bạn thực sự muốn xóa đơn tiệc ?</p>
                                <div class="d-flex flex-column align-items-center"
                                    v-if="getDateDiff(order_info.orderDate) <= 2 && !deleteModalCrtl.deleteDirectly">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    <p class="text-center fw-bold text-danger">Bạn sẽ không thể nhận lại toàn bộ số tiền đã
                                        cọc ?</p>
                                </div>
                                <p v-if="getDateDiff(order_info.orderDate) == 1 && !deleteModalCrtl.deleteDirectly"
                                    class="text-center fw-bold">Vui lòng liên hệ với chúng tôi để được giải quyết !!</p>
                                <div v-if="!deleteModalCrtl.deleteDirectly && getDateDiff(order_info.orderDate) > 1"
                                    class="mb-3">
                                    <label for="orderID" class="form-label fst-italic">Vui lòng nhập mã đơn tiệc để xác
                                        nhận</label>
                                    <input v-model="deleteModalCrtl.orderID" type="text" class="form-control" id="orderID"
                                        placeholder="Mã đơn tiệc ...">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary"
                                    @click="deleteModalCrtl.openModal = !deleteModalCrtl.openModal">Hủy bỏ</button>
                                <button @click="deleteOrderHandle()" type="button" class="btn btn-primary"
                                    :disabled="!deleteModalCrtl.deleteDirectly && (deleteModalCrtl.orderID == '' || deleteModalCrtl.orderID == null)">Xác
                                    nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="slide" mode="out-in">
                <div v-if="updateCrtl.openModal" class="check_confirm modal fade" aria-hidden="true"
                    :class="{ show: updateCrtl.openModal }">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-center text-uppercase ms-1" id="corfirm_order_label">
                                    <i class="fa-solid fa-cart-arrow-down me-2"></i>Thông tin cập nhật
                                </h5>
                                <div class="orderPrice d-flex col-sm-2 justify-content-between me-4"> <span>{{
                                    setCurrency(order_info_update.orderTotal) }}</span>
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
                                                    <input type="text" v-model="order_info_update.userName" name="userName">
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Email: </div>
                                                    <input type="text" v-model="order_info_update.userEmail"
                                                        name="userEmail">
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Số điện thoại: </div>
                                                    <input type="text" v-model="order_info_update.phone" name="phone">
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Số lượng khách: </div>
                                                    <input type="number" class="form-control" id="attendeeCount"
                                                        v-model="order_info_update.attendeesCount" name="attendeesCount">
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Ngày đặt tiệc: </div>
                                                    <input type="date" class="form-control"
                                                        v-model="order_info_update.orderDate" name="orderDate"
                                                        id="orderDate">
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Số phòng đặt tiệc: </div>
                                                    <select class="form-select" v-model="selected_Room.room" name="roomID"
                                                        id="roomID">
                                                        <option
                                                            :selected="{ selected: selected_Room.room == option.roomID }"
                                                            v-for="option in SuitableRoom" :value="option.roomID">{{
                                                                option.roomName }}</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </div>
                                        <h5 class="text-success fw-bold mt-3">Thông tin phòng đặt tiệc</h5>
                                        <div class="info_item">
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item">
                                                    <div class="info-image">
                                                        <img :src="getImagePath(selected_Room.selected.image1)" alt="">
                                                    </div>
                                                    <div class="info-image">
                                                        <img :src="getImagePath(selected_Room.selected.image2)" alt="">
                                                    </div>
                                                    <div class="info-image">
                                                        <img :src="getImagePath(selected_Room.selected.image3)" alt="">
                                                    </div>
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Mã phòng tiệc: </div>
                                                    <div class="">{{ selected_Room.selected.roomID }}</div>
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Tên phòng tiệc: </div>
                                                    <div class="">{{ selected_Room.selected.roomName }}</div>
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Tầng: </div>
                                                    <div class="">{{ selected_Room.selected.floor }}</div>
                                                </li>
                                                <li class="list-group-item">
                                                    <div class="fw-bold mx-2">Giá thuê: </div>
                                                    <div class="">{{ setCurrency(selected_Room.selected.price) }}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="menu_info col-sm-8 d-flex justify-content-between align-items-start">
                                        <div class="col-sm-6">
                                            <div
                                                class="create_menu d-flex flex-column justify-content-between align-items-center">
                                                <div class="col-sm-12">
                                                    <h4 class="text-center"><i class="fa-solid fa-mug-hot me-2"></i>Khai
                                                        vị</h4>
                                                    <div class="card">
                                                        <ul class="list-group list-group-flush">
                                                            <li v-for="food in foodList.foodKV"
                                                                class="list-group-item d-flex justify-content-between align-items-center"
                                                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                                                <div
                                                                    class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                                                    <div class="menu_image">
                                                                        <img :src="getFoodImagePath(food.image)"
                                                                            :alt="food.image">
                                                                    </div>
                                                                    <span class="food_name" title="Haha">{{ food.foodName
                                                                    }}</span>
                                                                </div>
                                                                <div class="food_price col-lg-3">{{ setCurrency(food.price)
                                                                }}</div>
                                                                <input v-model="checkFood.food" class="me-2" type="checkbox"
                                                                    :value="food.foodID" name="checkFood">
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 mt-3">
                                                    <h4 class="text-center"><i class="fa-solid fa-burger me-2"></i>Ăn
                                                        chính</h4>
                                                    <div class="card">
                                                        <ul class="list-group list-group-flush">
                                                            <li v-for="food in foodList.foodAC"
                                                                class="list-group-item d-flex justify-content-between align-items-center"
                                                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                                                <div
                                                                    class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                                                    <div class="menu_image">
                                                                        <img :src="getFoodImagePath(food.image)"
                                                                            :alt="food.image">
                                                                    </div>
                                                                    <span class="food_name" title="Haha">{{ food.foodName
                                                                    }}</span>
                                                                </div>
                                                                <div class="food_price col-lg-3">{{ setCurrency(food.price)
                                                                }}</div>
                                                                <input v-model="checkFood.food" class="me-2" type="checkbox"
                                                                    :value="food.foodID" name="checkFood">
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 mt-3">
                                                    <h4 class="text-center"><i class="fa-solid fa-burger me-2"></i>Tráng miệng</h4>
                                                    <div class="card">
                                                        <ul class="list-group list-group-flush">
                                                            <li v-for="food in foodList.foodTM"
                                                                class="list-group-item d-flex justify-content-between align-items-center"
                                                                :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                                                <div
                                                                    class="food_info col-lg-8 d-flex justify-content-start align-items-center">
                                                                    <div class="menu_image">
                                                                        <img :src="getFoodImagePath(food.image)"
                                                                            :alt="food.image">
                                                                    </div>
                                                                    <span class="food_name" title="Haha">{{ food.foodName
                                                                    }}</span>
                                                                </div>
                                                                <div class="food_price col-lg-3">{{ setCurrency(food.price)
                                                                }}</div>
                                                                <input v-model="checkFood.food" class="me-2" type="checkbox"
                                                                    :value="food.foodID" name="checkFood">
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <ul class="list-group list-group-flush">
                                                <li v-for="food in checkFood.selected"
                                                    class="list-group-item d-flex justify-content-between align-items-center"
                                                    :class="{ main_food: food.typeID == 'AC', dessert_food: food.typeID == 'TM', appetizer_food: food.typeID == 'KV' }">
                                                    <div
                                                        class="food_info col-lg-8 d-flex justify-content-start align-items-center">
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
        </div>
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
    transform: translateY(-30%);
}

.user-info:not(span) {
    font-weight: bold;
}

.modal {
    display: block;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-body i {
    font-size: 25px;
    color: #d8a902;
}

.info {
    width: 100%;
    min-height: 40%;
    display: flex;
    overflow: hidden;
    background-color: rgb(253, 199, 180);
}

.info .menu-list {
    background-color: transparent;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.menu-header,
.menu-item {
    background-color: transparent;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.menu-header .col-sm-9 div,
.menu-item .col-sm-9 div {
    width: 30%;
    text-align: center;
}

.menu-item div:first-child {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
}

.menu-header {
    font-weight: bold;
    font-size: 20px;
    border-bottom: 1px double white;
}

.menu-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.menu-footer div {
    font-size: 20px;
}

.order-total {
    width: 50%;
}

.admin-confirm {
    width: 45%;
    display: flex;
    text-align: center;
    flex-direction: column;
    margin-top: 10px;
}

.spending {
    color: red;
}

.success {
    color: green;
}

.out-date {
    color: yellow;
}

.info .devide_info {
    background-color: red;
    width: 20%;
    height: 100%;
}

.find-my-order {
    width: 30%;
    margin: 0 auto;
    padding: 6px;
    border-radius: 24px !important;
    background-color: #edf2fc;
    overflow: hidden;
}

.find-my-order input {
    background-color: transparent;
    border: none;
    outline: none;
    width: 70%;
    padding: 5px 0 5px 5px;
}

.find-my-order input:focus {
    background-color: transparent;
    border: none;
    outline: none;
    width: 70%;
    padding: 5px 0 5px 5px;
}

.find-my-order .search-order {
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    display: inline-block;
    padding: 10px 15px;
    border-radius: 50%;
}

.find-my-order .search-order:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.error-message {
    font-size: 30px;
    color: #d8a902;
}

.error-message i {
    font-size: 100px;
    margin-top: 20px;

}

.info-container {
    width: 100%;
    min-height: 30vh;
}

.update-btn button {
    border: 1px solid #d8a902;
    outline: none;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 15px;
}

.update-btn button.disabled {
    background-color: #ccc !important;
    border: 1px solid #ccc;
    pointer-events: none;
    cursor: not-allowed !important;
}
.update-btn button.notallowed {
    background-color: #f60909 !important;
    border: 1px solid #ccc;
    cursor: not-allowed !important;
}

.update-btn button:first-child {
    background-color: #d8a902;
}

.update-btn button:last-child {
    background-color: chartreuse;
    font-weight: 600;
}

.check_confirm.modal {
    display: block !important;
    max-width: 100%;
    max-height: 100%;
}

.check_confirm .modal-title {
    color: #d8a902;
    font-weight: 700;
}

.modal-header,
.modal-body,
.modal-footer {
    border: none !important;
}

.modal-title i {
    font-size: 40px;
    color: crimson;
}

@media (min-width: 576px) {
    .check_confirm .modal-dialog {
        max-width: 90%;
        max-height: 50%;
        margin: 1.75rem auto;
    }
}

.orderInfo i {
    font-size: 30px;
}
@media (min-width: 576px){
    .orderInfo .col-sm-5 {
    flex: 0 0 auto;
    width: 35%;
}
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
    font-size: 17px;
    border: none !important;
    width: 100%;
}

.info_item .info-image {
    width: 30%;
    height: 100px !important;
}

.info_item .info-image img {
    width: 100%;
    height: 100%;
    object-fit: cover !important;
    object-position: center !important;
}

.form-control#orderDate,
.form-select#roomID,
.form-control#attendeeCount {
    width: 50%;
    margin-left: 20px;
    border-radius: 4px !important;
    border: 1px solid #60c515;
    color: darkblue !important;
}

.info_item .list-group-item.room_info {
    justify-content: center;
    flex-direction: column !important;
    align-items: center;
    font-size: 20px;
    border: none !important;
}

.orderPrice {
    color: #0d02d8;
    font-weight: 600;
}

.menu_info {
    max-height: 100vh;
    overflow: auto;
    padding-bottom: 20px;
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
.create_menu .card{
    min-height: 400px;
    max-height: 500px;
    overflow-y: auto;
}
.create_menu .col-sm-6{
    width: 48%;
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
</style>
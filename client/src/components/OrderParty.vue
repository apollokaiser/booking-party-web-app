

<template>
  <transition name="slide" mode="out-in">
  <div v-if="!nextComponent">
    <h3 class="order-title text-center text-uppercase">thông tin khách hàng</h3>
    <form>
      <div class="mb-3">
        <label for="makh" class="ms-1 form-label">Tên khách hàng</label>
        <input ref="inputUserName" v-model="user.userName" type="text" class="form-control" id="makh">
      </div>
      <div class="mb-3">
        <label for="sodt" class="ms-1 form-label">Số điện thoại</label>
        <input v-model="user.SDT" type="text" class="form-control" id="sodt">
      </div>
      <div class="mb-3">
        <label for="userEmail" class="ms-1 form-label">Email</label>
        <input v-model="user.userEmail" type="email" class="form-control" id="userEmail">
      </div>
      <div class="mb-3 d-flex flex-column">
        <label for="cusNumber" class="ms-1 form-label">Số lượng khách hàng</label>
        <em class="notice">Tối thiểu số lượng khách hàng là {{ minCustomer }} người</em>
        <div class="d-flex">
          <input v-model="user.CountCustomer" type="number" class="form-control" id="cusNumber">
          <button @click.prevent="chooseCount(10)" class="countDefault ms-3" :class="{ active: chooseBtn == 10 }">10</button>
          <button @click.prevent="chooseCount(50)" class="countDefault ms-3" :class="{ active: chooseBtn == 50 }">50</button>
          <button @click.prevent="chooseCount(100)" class="countDefault ms-3"
            :class="{ active: chooseBtn == 100 }">100</button>
          <button @click.prevent="chooseCount(200)" class="countDefault ms-3"
            :class="{ active: chooseBtn == 200 }">200</button>
          <button @click.prevent="chooseCount(500)" class="countDefault ms-3"
            :class="{ active: chooseBtn == 500 }">500</button>
        </div>
      </div>
      <button @click.prevent="nextStep()" class="btn" :class="{btn_next:next,btn_disable:!next}">Tiếp theo<i
          class="ms-2 fa-solid fa-arrow-right-long"></i></button>
    </form>
  </div>
  <OrderInfo :user="user" @showParent="showParent" v-else />
  </transition>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import OrderInfo from '@/components/OrderInfo.vue'
const route = useRoute();
const inputUserName = ref("");
const next = ref(false);
const nextComponent = ref(false);
const user = reactive({
  userName: "",
  userEmail: "",
  SDT: "",
  CountCustomer: 10,
})
const minCustomer = ref(5);
const chooseBtn = ref(0);
const chooseCount = (number) => {
  chooseBtn.value = number;
  user.CountCustomer = number;
}
onMounted(() => {
  inputUserName.value.focus();
  if (route.params.destination == "sinh-nhat") {
    minCustomer.value = 2;
  }
}),

  watch(user, function (newValue, oldValue) {

    if (Validate()&& newValue.CountCustomer >= minCustomer.value) {
      next.value = true;
    } else {
      next.value = false;
    }
  });
const Validate = () => { //NOTE: GET ME ----
  const regexPhoneNumber = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
  const regexEmail = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
  const regexUsername = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăẮắẰằÂâẤấẦầƠơỚớỜờƯưỨứỪừĐđ\s]+$/;
  if (regexPhoneNumber.test(user.SDT) &&(regexEmail.test(user.userEmail)|| user.userEmail=="") && regexUsername.test(user.userName))
    return true;
  else return false;
}
const nextStep = ()=>{
  if(Validate()==true){
    nextComponent.value = true;
  }
}
const showParent=(status)=>{
  nextComponent.value = !status;
}
</script>
<style>
.slide-enter-active,
    .slide-leave-active{
      transition: opacity 0.5s, transform 0.5s;
    }
    .slide-enter-from,
    .slide-leave-to{
      opacity:0;
      transform: translateX(-30%);
    }
.order-title {
  color: #d8a902;
}

.form-control {
  border-radius: 0px !important;
}

.form-label {
  color: #d8a902;
  font-size: 18px;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.form-control:focus {
  border-color: darkorange;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.form-control#cusNumber {
  width: 30% !important;
}

.notice {
  color: chocolate;
  font-size: 12px;
}

.countDefault {
  border: 1px solid #ccc;
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 70px;
  padding: 3px 0;
  outline: none !important;
  background-color: transparent;
  box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, 0.1);
  color: cadetblue;
}

.active {
  color: #d8a902;
}

.active::before {
  position: absolute;
  top: 0;
  right: 0;
  transform: rotate(45deg) translate(0%, -65%);
  content: "";
  width: 10px;
  height: 10px;
  background-color: #4CBB03;
}

.btn_disable {
  cursor: not-allowed;
  background-color: rgb(229, 229, 229) !important;
  pointer-events: none;
}

.btn_next {
  background-color: aqua;
}</style>
<script setup >
import Link from './Link.vue';
import { ref } from 'vue';
const prop = defineProps({
    services:{type:Object,required:true}
})
</script>

<template>
   <div id="footer">
    <div class="d-flex justify-content-between align-items-start row col-sm-10 ms-5 my-5">
        <div class="col-sm-4">
            <h6 class="fw-bold footer_title">CÔNG TY TRÁCH NHIỆM HỮU HẠN 30SFOOD</h6>
            <hr class="devide__footer">
            <div class="logo_icon d-flex justify-content-start align-items-center">
                <i class="fa-solid fa-utensils fs-4 fw-bold circle"></i>
                <h5 class="ms-4">Let Him Cook Company</h5>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-check fw-bold ms-2"></i>
                <h6 class="ms-5">MST: 3702709297</h6>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-location-dot fw-bold ms-2"></i>
                <span class="ms-5">2124, tổ 1B, ấp Hòa Lợi, xã Lương Hòa, huyện Giồng Trôm, tỉnh Bến Tre</span>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-phone fw-bold ms-2"></i>
                <span class="ms-5">0329026130 (gặp anh Thịnh Đẹp Trai)</span>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-regular fa-envelope-open fw-bold ms-2"></i>
                <span class="ms-5">thinh.ngohoai@gmail.com</span>
            </div>
            
        </div>
        <div class="col-sm-4">
            <h6 class="fw-bold footer_title">Chi nhánh chính</h6>
            <hr class="devide__footer">
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-location-dot fw-bold ms-2"></i>
                <span class="ms-5">2124, tổ 1B, ấp Hòa Lợi, xã Lương Hòa, huyện Giồng Trôm, tỉnh Bến Tre</span>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-location-dot fw-bold ms-2"></i>
                <span class="ms-5">2124, tổ 1B, ấp Hòa Lợi, xã Lương Hòa, huyện Giồng Trôm, tỉnh Bến Tre</span>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-location-dot fw-bold ms-2"></i>
                <span class="ms-5">2124, tổ 1B, ấp Hòa Lợi, xã Lương Hòa, huyện Giồng Trôm, tỉnh Bến Tre</span>
            </div>
            <div class="logo_icon d-flex justify-content-start align-items-center my-3">
                <i class="fa-solid fa-location-dot fw-bold ms-2"></i>
                <span class="ms-5">2124, tổ 1B, ấp Hòa Lợi, xã Lương Hòa, huyện Giồng Trôm, tỉnh Bến Tre</span>
            </div>
        </div>
        <div class="col-sm-4">
            <h6 class="fw-bold footer_title">THÔNG TIN DỊCH VỤ</h6>
            <hr class="devide__footer">
            <Link 
            v-for="service in services" :key="service.serviceID"
            :to="{name:'orderParty', params:{destination:service.destination,serviceID:service.serviceID}}"
            class="logo_icon d-flex justify-content-start align-items-center my-3">
                <span class="ms-5">Dịch vụ {{ service.serviceName }}</span> <!--O day co router-->
            </Link>
        </div>  
    </div>
    <div class="copyright bg-dark py-4 col-sm-12">
        <div class="d-flex justify-content-between align-items-center text-light col-sm-10 mx-auto px-2">
            <div>
                <span><i class="fa-regular fa-copyright fa-rotate-180 me-1 fs-3"></i>Copyleft by Ngo Hoai Thinh</span>
            </div>
            <span id="mssv">dh52003194@student.stu.edu.vn</span>
        </div>
</div>
   </div>

</template>
<style>
@media screen and (max-width:470px) {
    #mssv{
        display: none !important;
    }
    .copyright div{
        justify-content: center !important;
    }
}
#footer{
    width: 100%;
    margin-top: auto;
}
.circle{
    display: block;
    padding: 10px;
    width: 40px;
    height: 40px;
    background-color: brown;
    color: #b28b00;
    border-radius: 50%;
}
.logo_icon i:not(.circle)::before{
    width: 16px !important;
    height: 16px !important;
    display: block !important;
    color: brown;
}
h6.footer_title {
    font-size: 17px !important;
}
.devide__footer {
  background: #bc360a;
  fill: #bc360a;
  color: #bc360a;
  width: 50px;
  padding: 2px;
  border: none;
}
</style>

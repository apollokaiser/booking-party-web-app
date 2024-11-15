<script setup>
import Carousel from '@/components/Carousel.vue';
import Link from '@/components/Link.vue';
import {ref,onBeforeMount} from 'vue';
import instance from '@/config/axios';
const services = ref([]);
  onBeforeMount(()=>{
    instance.get("/get-services").then((respone)=>{
        services.value = respone.data.service;
    });
})
</script>
<template>
  <div>
    <Carousel>
    </Carousel>
    <div>
      <div class="order_area">
        <div class="container">
          <h2 class="order-brand">
            ĐẶC MÓN CỦA BẠN
          </h2>
          <hr class="devide">
          <div class="order_container my-5">
            <div v-for="service in services" :key="service.serviceID" class="order__item">
              <div class="order__content">
                <div id="order1" class="order__circle1">
                  <!-- order1 thay đổi để phù hợp thời gian, khi có dữ liệu sẽ thay đổi theo id -->
                  <div class="order__circle2">
                    <Link :to="{name:'orderParty',params:{destination:service.destination,serviceID:service.serviceID}}">
                      <i class="fa-solid fa-utensils"></i>
                      <p class="item1">Đặt tiệc</p>
                      <p class="item2">{{ service.serviceName }}</p>
                    </Link>
                  </div>
                </div>
                <Link class="details"
                :to="{
                  name:'orderParty',
                  params:{
                    destination:service.destination,
                    serviceID:service.serviceID
                    }
                }">Xem chi tiết</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="news_area">
        <div class="container">
          <h2 class="news-brand">
            TIỆC & SỰ KIỆN TRỌN GÓI
          </h2>
          <hr class="devide">
          <div class="news_container">
            <div class="news_item my-3">
              <div class="news_item_introduce">
                <img src="/images/news_item2.jpg" alt="NgoHoaiThinh_DH52003194">
                <div class="news_title">
                  <span>Tiệc tại nhà</span>
                  <a href="#">Xem thêm</a>
                </div>
              </div>
            </div>
            <div class="news_item my-3">
              <div class="news_item_introduce">
                <img src="/images/news_item2.jpg" alt="NgoHoaiThinh_DH52003194">
                <div class="news_title">
                  <span>Tiệc buscu</span>
                  <a href="#">Xem thêm</a>
                </div>
              </div>
            </div>
            <div class="news_item my-3">
              <div class="news_item_introduce">
                <img src="/images/news_item2.jpg" alt="NgoHoaiThinh_DH52003194">
                <div class="news_title">
                  <span>Tiệc đám giỗ</span>
                  <a href="#">Xem thêm</a>
                </div>
              </div>
            </div>
            <div class="news_item my-3">
              <div class="news_item_introduce">
                <img src="/images/news_item1.png" alt="NgoHoaiThinh_DH52003194">
                <div class="news_title">
                  <span>Tiệc đám ma</span>
                  <a href="#">Xem thêm</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment_area">
        <div class="container">
          <h2 class="comment_brand">
            Ý KIẾN KHÁCH HÀNG
          </h2>
          <hr class="devide">
          <div class="comment_container">
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>
            <div class="comment_item col-sm-7 mx-auto my-3 p-4 border border-warning border-3">
              <div class="service_name text-end me-4 text-primary"><a href="#">Dịch vụ tiệc cưới</a></div>
              <div class="username_comment text-danger fw-bold">Ngô Hoài Thịnh</div>
              <div class="comment_content ms-4">Lorem, ipsum dolor sit amet 
                consectetur adipisicing elit. Dolor sint quidem commodi 
                facere praesentium tenetur voluptates voluptatem saepe,
                debitis nisi vero iste unde sed. 
                Eveniet quibusdam iure quo sapiente optio!</div>
            </div>

          </div>
        </div>
      </div>
      <div class="services_introduce">
        <div class="container">
          <h2 class="news-brand">
            DỊCH VỤ ĐƯỢC ƯU CHUỘNG
          </h2>
          <hr class="devide">
          <div class="services_introduce_container">
            <div class="service_item my-3">
              <div class="service_image">
                <img src="/images/nau-tiec-cuoi.jpg" alt="NgoHoaiThinh_DH52003194">
              </div>
              <div class="service_content">
                  <a href="">Nấu tiệc đám giỗ</a>
                  <p>Đám giỗ là lễ hiếu của con cái cháu chắt trong gia đình,
                    là dịp để con cháu nhớ tới công ơn của cha mẹ ông bà
                    và cũng là dịp để mọi người trong gia đình xum họp sau những ngày bận rộn
                    với công việc với gia đình của riêng mình chính vì vậy đạt
                    tiệc đám giỗ nhằm tiết kiệm thời gian cũng như chi phí cho gia đình</p>
                </div>
              
            </div>
            <div class="service_item my-3">
              <div class="service_image">
                <img src="/images/nau-tiec-tan-gia.jpg" alt="NgoHoaiThinh_DH52003194">
              </div>
              <div class="service_content">
                  <a href="">Nấu tiệc đám giỗ</a>
                  <p>Đám giỗ là lễ hiếu của con cái cháu chắt trong gia đình,
                    là dịp để con cháu nhớ tới công ơn của cha mẹ ông bà
                    và cũng là dịp để mọi người trong gia đình xum họp sau những ngày bận rộn
                    với công việc với gia đình của riêng mình chính vì vậy đạt
                    tiệc đám giỗ nhằm tiết kiệm thời gian cũng như chi phí cho gia đình</p>
                </div>
              
            </div>
            <div class="service_item my-3">
              <div class="service_image">
                <img src="/images/nau-tiec-lien-hoan.jpg" alt="NgoHoaiThinh_DH52003194">
              </div>
              <div class="service_content">
                  <a href="">Nấu tiệc đám giỗ</a>
                  <p>Đám giỗ là lễ hiếu của con cái cháu chắt trong gia đình,
                    là dịp để con cháu nhớ tới công ơn của cha mẹ ông bà
                    và cũng là dịp để mọi người trong gia đình xum họp sau những ngày bận rộn
                    với công việc với gia đình của riêng mình chính vì vậy đạt
                    tiệc đám giỗ nhằm tiết kiệm thời gian cũng như chi phí cho gia đình</p>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
@media screen and (max-width: 575px) {
  .container{
    width: 100%;
  } 
}
@media screen and (max-width: 768px) {
  .order_container .order__item{
    /* flex-direction: column !important; */
    width: 30%;
  }
}
@media screen and (max-width:537px){
  .order_container .order__item{
    /* flex-direction: column !important; */
    width: 40%;
  }
}
@media screen and (max-width:554px){
  .news_item {
    width: 45% !important;
}
  .news_item_introduce .news_title span {
    padding:0 !important;
    width: 100px !important;
    text-align: center;
    font-size: 15px !important;
  }
}
@media screen and (max-width:405px){
  .order_container {
     flex-direction: column !important;
  }
}
@media screen and (max-width: 1200px) {
  .news_item_introduce .news_title span {
    padding: 5px 10px ;
}
}
@media screen and (max-width: 992px) {
  .news_item_introduce .news_title span {
    padding: 5px 10px ;
    width: 150px;
    text-align: center;
    font-size: 14px;
}
}
.order_area,
.news_area,
 .comment_area {
  width: 100%;
  height: 50%;
  background: url('/images/bg1.jpg');
}
.news_area,.comment_area{
  margin-top: 80px !important;
  background: none !important;
}

.order-brand,
.news-brand,
.comment_brand {
  text-align: center;
  color: #bc360a;
  font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif;
  font-size: 15;
  line-height: 1.5;
  margin: 40px 0 10px 0;
}

.devide {
  background: #bc360a;
  fill: #bc360a;
  color: #bc360a;
  width: 50px;
  padding: 2px;
  margin: 5px auto;
  border: none;
}

.order_container,
.news_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px;
}

.order__item {
  width: 25%;
  margin-top: 10px;
  margin-bottom: 15px;
}

.details {
  text-align: center;
  width: 150px;
  margin: auto;
  padding: 5px;
  margin-top: 20px;
  color: #B28B00;
  font-weight: 600;
  border: 1px solid #B28B00;
  border-radius: 4px;
  display: block;
  transition: all 0.4s;
}

.details:hover {
  background-color: #b28b00;
  color: #fff;
}

.order__circle1 {
  width: 150px;
  margin: auto;
  text-align: center;
  border: 1px solid #fff;
  border-radius: 50%;
  height: 150px;
  color: #fff;
  background-color: #B28B00;
  padding: 7px;
  position: relative;
  transition: all 0.19s linear;
  animation-name: bounce_soft;
  animation-iteration-count: infinite;
}

@keyframes bounce_soft {
  0% {
    top: 0;
  }

  50% {
    top: -10px;
  }

  100% {
    top: 0;
  }
}

#order1 {
  animation-duration: 0.7s;
}

#order2 {
  animation-duration: 0.8s;
}

#order3 {
  animation-duration: 0.9s;
}

#order4 {
  animation-duration: 1.0s;

}

.order__circle1:hover {
  color: #bc360a;
}

.order__circle1:hover .order__circle2 {
  border: 2px solid #bc360a;
}

.order__circle2 {
  border: 2px solid #fff;
  width: 100%;
  height: 100%;
  border-radius: 50%;

}

.item1 {
  text-transform: uppercase;
  margin-top: 2px;
  padding-bottom: 5px;
  margin-bottom: 5px;
  font-size: 13px;
}

.item2 {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 15px;
}

.news_item {
  width: 35%;
  padding: 3px;
  border: 1px solid #bc360a;
  border-radius: 5px;
}

.news_item .news_item_introduce {
  position: relative;
}

.news_item_introduce .news_title {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.news_item_introduce .news_title span {
  text-transform: uppercase;
  color: #fff;
  display: block;
  background-color: rgba(178, 139, 0, 0.9);
  padding: 5px 40px;
  margin-bottom: 4px;
  border-radius: 20px;
}

.news_item_introduce .news_title a {
  color: #fff;
  padding: 2px;
  font-size: 13px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
}
.comment_item{
  border-radius: 10px 0 10px 0;
}
.comment_container{
  height: 600px;
  width: 100%;
  overflow: scroll;
}
.services_introduce_container {
  color: #7d7d7d;
  display: flex;
  flex-wrap: wrap;
  font-size: 15px;
  justify-content: center;
  line-height: 22.5px;
  margin: 50px -15px 0px;
}

.service_item {
  color: #7d7d7d;
  flex-basis: 66.6667%;
  font-size: 15px;
  line-height: 22.5px;
  padding: 0px 15px;
  margin: 0 auto;
}
.service_item{
  margin: 0 20px;
}
.service_image{
  margin: 0 auto;
  width: 50%;
}

.service_content a{
  color: #b28b00;
  display: block;
  font-family: Roboto;
  font-size: 32px;
  font-weight: 700;
  margin-top: 10px;
  line-height: 40px;
  text-align: center;
}
</style>

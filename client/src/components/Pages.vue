<template>
    <div class="container d-flex flex-column justify-content-center align-items-center">
      <div class="wrapper col-sm-11">
        <div class="breadcrumb-overplay">
            <ul class="d-flex">
                <Link to="/">Home</Link>
                <Link class="ms-1 text-capitalize" to="/services">>{{route.name}}</Link>
            </ul>
        </div>
    </div>
    <div class="row mt-5 col-sm-11">
        <section class="col-sm-8">
            <slot></slot>
        </section>
        <section class="col-sm-4">
            <div id="hotline" class="p-3">
                <div id="hotline-content" class="d-flex flex-column justify-content-start align-items-center ">
                    <h4 id="hotline-title" class="text-light">
                        <i class="fa-solid fa-headset me-2"></i>Hotline (24/7)
                    </h4>
                    <div class="phone bg-light p-1 mt-2 col-sm-12 text-center fw-bold">0329.026.130</div>
                    <div class="phone bg-light p-1 mt-2 col-sm-12 text-center fw-bold">0329.026.130</div>
                </div>
            </div>
            <div class="news-info mt-5">
                <h4 class="news-titles fw-bold">Tin tức gần đây</h4>
                <newsItem v-for="item in newsList" :news="item">
                </newsItem>
            </div>
        </section>
    </div>
    </div>
</template>
<script setup>
import Link from '@/components/Link.vue';
import newsItem from './newsItem.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const prop = defineProps({
    newsList:{type:Object,required:true},
    },
    );
</script>
<style>
.wrapper{
    background: url("/images/bg3.jpg") no-repeat center center;
    height: 150px;
} 

.breadcrumb-overplay{
    list-style-type: none !important;
    padding: 0;
    position: relative;
    color: #d8a902;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6) ;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.breadcrumb-overplay ul{
    list-style-type: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 10;

}
#hotline{
    background-color:#d8a902;
    width: 100%;
    height: 150px;
}.phone{
    font-size: 18px;
    color: red;
}
.order_tilte{
    color: #d8a902;
}
</style>
<template>
    <div class="news-items d-flex mt-3">
        <div class="news-item-image">
            <img :src="getImagePath(news.image)" alt="">
        </div>
        <div class="news-content">
           <Link :to="{name:'newsInfo',params:{newsID:news.news_id,destination:convertToSlug(news.news_title)}}"><p class="text-uppercase ms-2">{{ news.news_title }}</p></Link> 
            <span><i class="fa-regular fa-calendar-days mx-2"></i>{{shortDate(news.CreateAt)}}</span>
        </div>
    </div>
</template>
<script setup>
import Link from '@/components/Link.vue';
import { onBeforeMount } from 'vue';
import {shortDate, convertToSlug} from "@/utils"; 
const prop = defineProps({
    news:{type:Object, require:true} 
})
const getDate = ()=>{
    return prop.news.CreateAt;
}

const getImagePath = (image)=>{
    return "/images/news/" + image;
}
</script>
<style>
.news-titles{
    font-size: 25px;
    color: rgba(0,0,0,0.6) ;
}
.news-item-image{
    width:40%;
    height: 80px;
}
.news-item-image img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
.news-content{
    width: 50%;
}
.news-content p {
    width: 100%;
    color: #d8a902;
    height: 50%;
}
.news-content {
    display: flex;
    flex-direction: column; 
}
.news-content span {
    color: #ccc;
}
</style>
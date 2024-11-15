<script setup>
import { ref,onBeforeMount,reactive } from 'vue';
import instance from '@/config/axios';
import { shortDate,shortContent,convertToSlug} from '@/utils';
import Link from './Link.vue';
const newsList = ref([]);
onBeforeMount(()=>{
    instance.get("/get-all-news")
    .then(respone =>{
        if(respone.data.status == 200){
            newsList.value = respone.data.newsList;
        } else {
            newsList.value = null;
        }
    })
});
const setImagePath = (image) =>{
    return `/images/news/${image}`;
}
</script>

<template>
    <div v-for="item in newsList" class="news-list-container d-flex justify-content-start align-items-start my-3">
        <div class="news-image">
            <img :src="setImagePath(item.image)" alt="">
        </div>
        <div class="news-info d-flex flex-column">
            <Link :to="{name:'newsInfo',params:{newsID:item.news_id, destination:convertToSlug(item.news_title)}}">
                 <h5 class="news-title">{{item.news_title}}</h5>
            </Link>
            <p class="news-content">{{shortContent(item.news_content)}}</p>
            <Link :to="{name:'newsInfo',params:{newsID:item.news_id, destination:convertToSlug(item.news_title)}}">
                <span>Xem chi tiết</span>
            </Link>
        </div>
    </div>
</template>

<style>
.news-list-container{
    width: 100%;
}
.news-list-container .news-image{
    width: 30%;
    height: 150px;
    padding: 5px;
    border-radius: 5px;
    margin-right: 5px;
    overflow: hidden;
}
.news-list-container .news-image img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
.news-list-container .news-info{
    width: 60%;
}
.news-list-container .news-info h5{
    color: #B28B00;
    font-weight: bold;
    font-size: 17px !important;
}
.news-list-container .news-info span{
    color: #B28B00;
    font-style: italic;
}
.news-list-container .news-info span:hover{
    color: #d8a902;
    text-decoration: underline;
}
.news-list-container .news-content{
    width: 100%;
    word-wrap: break-word;
    word-break: keep-all;
    color: #7d7d7d;
    margin-bottom: 0 !important;
}
</style>
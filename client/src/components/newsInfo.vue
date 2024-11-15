<script setup>
import { ref, onBeforeMount, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import instance from '@/config/axios';
import { shortDate } from '@/utils';
const route = useRoute();
const newsInfo = reactive({
    data: "",
});
onBeforeMount(() => {
    instance.get(`/get-news/${route.params.newsID}`)
        .then((respone) => {
            if (respone.data.status == 200) {
                newsInfo.data = respone.data.newsInfo;
                newsInfo.data.CreateAt = shortDate(respone.data.newsInfo.CreateAt);
                newsInfo.data.news_hastag = respone.data.newsInfo.news_hastag.split("#");
            }
        })
}
);

const getImagePath = image => {
    return "/images/news/" + image;
}
</script>
<template>
    <div class="news-container">
        <div class="news-title">
            <h2>{{ newsInfo.data.news_title }}</h2>
            <div class="news-owner-info">
                <div class="owner-name mb-2"><i class="fa-regular fa-user me-2"></i>Người đăng: <span class="fw-bold">Ngô
                        Hoài Thịnh</span></div>
                <div class="create-at mb-2"><i class="fa-regular fa-calendar-days me-2"></i>Ngày đăng: <span
                        class="fw-bold">{{ newsInfo.data.CreateAt }}</span></div>
                <div class="hashtag  mb-2"><i class="fa-solid fa-hashtag me-2"></i>Hashtag: <span class="text-primary">
                        <a v-for="item in newsInfo.data.news_hastag" href="">#{{ item }}</a>
                    </span></div>
            </div>
        </div>
        <div class="news-body mt-5">
            <div class="news-image">
                <img :src="getImagePath(newsInfo.data.image)" alt="">
            </div>
            <div class="news-content">
                <p>{{ newsInfo.data.news_content }}</p>
            </div>
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
    transform: translateX(-30%);
}

.news-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.news-title {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.news-title h2 {
    color: #d8a902;
    font-family: Arial, Helvetica, sans-serif;
    word-wrap: break-word;
    word-break: keep-all;
}

.news-title .news-owner-info {
    font-style: italic;
}

.news-title .news-owner-info i {
    color: #d8a902;
    font-size: 25px;
}

.news-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.news-body .news-image {
    width: 75%;
    margin: 0 auto;
}

.news-body .news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.news-body .news-content {
    width: 100%;
}

.news-body .news-content p {
    color: black;
    font-size: 16px;
}</style>
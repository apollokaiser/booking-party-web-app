<template>
    <div>
        <Pages :newsList="newsList" >
            <router-view></router-view>
        </Pages>
    </div>
</template>
<script setup>
import Pages from '@/components/Pages.vue';
import { useRoute } from 'vue-router';
import {ref,onBeforeMount} from 'vue';
import instance from '@/config/axios.js';
const route = useRoute();
let newsList = ref([])
onBeforeMount(() => {
    instance.get("/get-news").then(response=>{
        if(response.data.status ==200){
            newsList.value = response.data.newsList;
        }
    });
})
</script>
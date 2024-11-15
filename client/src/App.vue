<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router';
import {ref,onBeforeMount} from 'vue';
import TheNavigation from './components/TheNavigation.vue';
import slogan from './components/slogan.vue';
import Footer from './components/Footer.vue';
import instance from '@/config/axios';
const route = useRoute();
const services = ref([]);
  onBeforeMount(()=>{
    instance.get("/get-services").then((respone)=>{
        services.value = respone.data.service;
    });
})

</script>

<template>
  <div id="application">
    <header>
      <slogan/>
  <TheNavigation :services="services"/>
    </header>
  <main>
     <router-view v-slot="{Component}">
      <transition name="slide" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
     </router-view>
  </main>
  <Footer :services="services"></Footer>
</div>
</template>


<style lang="css">
.slide-enter-active,
    .slide-leave-active{
      transition: opacity 0.5s, transform 0.5s;
    }
    .slide-enter-from,
    .slide-leave-to{
      opacity:0;
      transform: translateX(-30%);
    }
#application{
  display: flex;
  width: 100%;
  flex-direction: column;
  min-height: 100vh;
}
</style>



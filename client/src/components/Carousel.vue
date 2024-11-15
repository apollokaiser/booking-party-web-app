<template>
    <div>
      <div class="carousel__container">
        <div class="carousel__item" :class="slide==1?'get__in':(slidePrev==1?'get__out':'')">
          <img src="/images/hinh1.jpg" alt="hinh1">
        </div>
      <div class="carousel__item" :class="slide==2?'get__in':(slidePrev==2?'get__out':'')">
        <img src="/images/hinh2.jpg" alt="hinh2">
        </div>
      <div class="carousel__item" :class="slide==3&&slidePrev!=0?'get__in':(slidePrev==3?'get__out':'')">
        <img src="/images/hinh3.jpg" alt="hinh3">
        </div>
        <div class="carousel__btn">
          <button id="pre">&lt;</button>
          <button id="next">></button>
        </div>
      </div>
      <div>
      </div>
    </div>
  </template>
  <script setup>
  import {ref,onMounted,onUpdated } from 'vue';
  const slide = ref(3);
  const slidePrev = ref(0);
  var setDelay = 0;

  function setRun(){
      setDelay = setInterval(()=>{
      slidePrev.value = slide.value;
      slide.value++;
      if(slide.value==4)
        slide.value = 1;
    },5000)
  }
  function clearRun(){
    clearInterval(setDelay);
  }
  const runCarousel = ()=>{
    setRun();
    document.querySelector("#pre").addEventListener("click", ()=>{
      clearRun();
      slidePrev.value = slide.value;
      slide.value--;
      if(slide.value==0)
        slide.value = 3;
      let carousel_item = document.querySelectorAll('.carousel__item')
      carousel_item[slide.value-1].style.animationName="getInFromLeft";
      carousel_item[slidePrev.value-1].style.animationName="getOutToRight";
      setRun()
    });
    document.querySelector("#next").addEventListener("click", ()=>{
      clearRun();
      slidePrev.value = slide.value;
      slide.value++;
      if(slide.value==4)
      slide.value = 1;
      setRun()
      let carousel_item = document.querySelectorAll('.carousel__item')
      carousel_item[slide.value-1].style.animationName="getIn";
      carousel_item[slidePrev.value-1].style.animationName="getOut";
    });
  }
  onMounted(()=>runCarousel())
  </script>
  <style>
  .carousel__container{
    height: 510px;
    position: relative;
    overflow: hidden;
    
  }
  .carousel__item{
    width: 100%;
    position: absolute;
    top:0;
    left: 0;
  }
  #pre{
    left: 2%;
  }
  #next{
    right: 2%;
  }
  #pre:hover,#next:hover{
    color: #d8a902;
  }
  .get__out {
    animation-name: getOut;
    animation-duration: 1.0s;
    z-index: 9;
    animation-fill-mode: forwards;
  }
  .get__out__to__right {
    animation-name: getOutToRight;
    animation-duration: 1.0s;
    z-index: 9;
    animation-fill-mode: forwards;
  }
  
  @keyframes getOut {
    from {
     transform: translateX(0%);
    }
    to {
     transform: translateX(-100%);
    }
  }
  @keyframes getOutToRight {
    from {
     transform: translateX(0%);
    }
    to {
     transform: translateX(100%);
    }
  }
  .get__in {
    animation-name: getIn;
    animation-duration: 1.0s;
    z-index: 10;
    animation-fill-mode: forwards;
  }
  .get__in_from_left {
    animation-name: getIn;
    animation-duration: 1.0s;
    z-index: 10;
    animation-fill-mode: forwards;
  }
  @keyframes getIn{
    from {
     transform: translateX(100%);
    }
    to {
     transform: translateX(0%);
    }
  }
  @keyframes getInFromLeft{
    from {
     transform: translateX(-100%);
    }
    to {
     transform: translateX(0%);
    }
  }
  @media screen and (max-width:999px) {
    #pre,#next{
    border: none !important;
    outline: none !important;
    font-size: 40px;
    color: antiquewhite;
    background-color: transparent !important;
    font-weight: bolder;
    position: absolute;
    top: 20% !important;
    z-index: 999;
  }
}
@media screen and (max-width: 650px) {
  #pre,#next{
    border: none !important;
    outline: none !important;
    font-size: 40px;
    color: antiquewhite;
    background-color: transparent !important;
    font-weight: bolder;
    position: absolute;
    top: 15% !important;
    z-index: 999;
  }
}
@media screen and (max-width: 540px) {
  #pre,#next{
    border: none !important;
    outline: none !important;
    font-size: 40px;
    color: antiquewhite;
    background-color: transparent !important;
    font-weight: bolder;
    position: absolute;
    top: 10% !important;
    z-index: 999;
  }
}
  @media screen and (min-width:1000px) {
    #pre,#next{
    border: none !important;
    outline: none !important;
    font-size: 50px;
    color: antiquewhite;
    background-color: transparent !important;
    font-weight: bolder;
    position: absolute;
    top: 35% !important;
    z-index: 999;
  }
  }
  </style>
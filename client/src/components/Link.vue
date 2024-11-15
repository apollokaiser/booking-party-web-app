<template>
    <a v-if="isExtenal" :href="to"><slot/></a>
    <router-link v-else v-bind="$props">
        <slot/>
        </router-link>
</template>
<script setup>
import {ref,reactive,computed} from 'vue'
import {RouterLink} from 'vue-router'
const props = defineProps({
    ...RouterLink.props
})
 const isExtenal = computed(()=>{
    return typeof props.to === 'string' && props.to.startsWith('http');
})
</script>
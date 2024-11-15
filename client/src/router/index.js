import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/pages', 
    name: 'pages',
    component: ()=>import('@/views/PageShow.vue'),
    children:[
      {
        path: ':serviceID/:destination',
        name: 'orderParty',
        component: ()=>import('@/components/orderParty.vue'),
        props: route => ({ ...route.params}),
      },
      {
        path: 'tin-tuc',
        name: 'news',
        component: ()=>import('@/components/News.vue'),
      },
      {
        path: 'tin-tuc/:newsID/:destination',
        name: 'newsInfo',
        component: ()=>import('@/components/newsInfo.vue'),
        props: route => ({ ...route.params}),
      },
    ]
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    props: route => ({ ...route.params}),
  },
  {
    path: '/check-party',
    name: 'check-party',
    component: () => import('@/views/PartyInfo.vue'),
    props: route => ({ ...route.params}),
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('@/views/Support.vue'),
    props: route => ({ ...route.params}),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: () => import('@/views/NotFound.vue'),
  }

]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'nav-active-link',
  scrollBehavior(to, from, savedPosition) {
    if (to.path=="/") return savedPosition;
    return {top:0,left:0};
    // else return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve({ left: 0, top: 0 })
    //     }, 500)
    // })
}
})

export default router

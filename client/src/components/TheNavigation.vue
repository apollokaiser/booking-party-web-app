<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container py-3">
                <Link class="navbar-brand ms-5 text-uppercase d-flex align-items-center fw-bold" to="/"><div id="logo" class="me-2"><img src="/images/pngtree-food-logo-png-image_8239850.png" alt=""></div>30sfood</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul id="nav" class="navbar-nav mx-4">
                        <li class="nav-item">
                            <Link class="nav-link" to="/" :services="services">Trang chủ</Link>
                        </li>
                        <li class="nav-item">
                            <div class="dropdown">
                                <div class="dropdown-toggle nav-link" type="button" id="service" data-bs-toggle="dropdown"
                                    aria-expanded="false">Dịch vụ</div>
                                <ul class="dropdown-menu" aria-labelledby="service">
                                    <li v-for="service in services" :key="service.serviceID">
                                        <Link class="dropdown-item nav-link" :to="{
                                            name: 'orderParty',
                                            params: {
                                                destination: service.destination,
                                                serviceID: service.serviceID
                                            }
                                        }">{{ service.serviceName }}</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/check-party">Tiệc của tôi</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/pages/ho-tro">Liên hệ</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/pages/tin-tuc">Tin tức</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>
<script setup>
import Link from './Link.vue';
import { ref, onBeforeMount } from 'vue';

const prop = defineProps({
    services: Object, require: true
})
const getPath = (id, destination) => {
    return `/page/${id}/${destination}`;
}
</script>
<style lang="css">
#nav .nav-active-link {
    border: 1px solid #d8a902;
    color: #d8a902;
    border-radius: 5%;
}

.nav-link {
    text-transform: uppercase;
    text-align: center !important;
}
#logo{
    width: 40px;
    height: 40px;
}
#logo img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>

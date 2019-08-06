import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
    ],
});

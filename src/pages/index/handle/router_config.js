import VueRouter from 'vue-router';
import Vue from 'vue';
import routeInterceptor from './interceptor/routeInterceptor'
import RestaurantList from './modules/restaurant/restaurant_list.vue';
import RestaurantInfo from './modules/restaurant/restaurant_info.vue';
import RestaurantSearch from './modules/restaurant/restaurant_search.vue';
import RestaurantMenu from './modules/menus/menus.vue';
import MenuTetail from './modules/menus/menu_detail.vue';
import Cart from './modules/cart/cart.vue'
import ConfirmOrder from './modules/order/confirm_order.vue'
import Pay from './modules/pay/pay.vue'
import OrderList from './modules/order/order_list.vue'
import Receipt from './modules/receipt/receipt.vue'
Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        component: RestaurantList
    },
    {
        path: '/restInfo/:restId',
        component: RestaurantInfo
    },
    {
        path: '/restSearch',
        component: RestaurantSearch,
    },
    {
        path: '/restMenu/:restId',
        component: RestaurantMenu,
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/menuDetail',
        component: MenuTetail,
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/cart',
        component: Cart,
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/confirmOrder',
        component: ConfirmOrder,
        name:'confirmOrder',
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/pay',
        component: Pay,
        name:'Pay',
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/orderList',
        component: OrderList,
        meta:{
            requireAuth: true
        }
    },
    {
        path: '/receipt',
        component: Receipt,
        meta:{
            requireAuth: true
        }
    }
];

let router= new VueRouter({
    mode: 'hash',
    routes: routes
});
routeInterceptor(router);//加入路由拦截
export default router
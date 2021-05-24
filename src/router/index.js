import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store/index"

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
        title: "淘不到宝"
    }
}, {
    path: '/category',
    name: 'Category',
    component: () => import('../views/Category.vue'),
    meta: {
        title: "商品分类"
    }
}, {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('../views/ShoppingCart.vue'),
    meta: {
        title: "购物车"
    }
}, {
    path: '/info',
    name: 'Info',
    component: () => import('../views/Info.vue'),
    meta: {
        title: "个人中心"
    }
}, {
    path: '/goodDetail/:id',
    name: 'GoodDetail',
    component: () => import('../views/GoodDetail.vue'),
    meta: {
        title: "商品详情"
    }
}, {
    path: '/collect',
    name: 'Collect',
    component: () => import('../views/Collect.vue'),
    meta: {
        title: "我的收藏"
    }
}, {
    path: '/orderList',
    name: 'OrderList',
    component: () => import('../views/OrderList.vue'),
    meta: {
        title: "我的订单"
    }
}, {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
        title: "用户登录"
    }
}, {
    path: '/manageInfo:mode',
    name: 'ManageInfo',
    component: () => import('../views/ManageInfo.vue'),
    meta: {
        title: "账号管理"
    }
}, {
    path: '/manageAddress',
    name: 'ManageAddress',
    component: () => import('../views/ManageAddress.vue'),
    meta: {
        title: "地址管理"
    }
}, {
    path: '/addAddress',
    name: 'AddAddress',
    component: () => import('../views/AddAddress.vue'),
    meta: {
        title: "新增地址"
    }
}, {
    path: '/searchGood:content',
    name: 'SearchGood',
    component: () => import('../views/SearchGood.vue'),
    meta: {
        title: "商品搜索"
    }
}, {
    path: '/orderPreview',
    name: 'OrderPreview',
    component: () => import('../views/OrderPreview.vue'),
    meta: {
        title: "订单预览"
    }
}, {
    path: '/pay:id',
    name: 'Pay',
    component: () => import('../views/Pay.vue'),
    meta: {
        title: "支付"
    }
}]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(to => {
    store.state.headerTitle = to.meta.title
})

export default router

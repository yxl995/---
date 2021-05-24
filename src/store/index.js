import {createStore} from 'vuex'
import {request} from "../network/request.js";
import {Toast} from "vant";
import router from "../router/index"

export default createStore({
    state: {
        showShare: false,
        options: [
            {name: '微信', icon: 'wechat'},
            {name: '朋友圈', icon: 'wechat-moments'},
            {name: '微博', icon: 'weibo'},
            {name: 'QQ', icon: 'qq'},
            {name: '复制链接', icon: 'link'},
            {name: '分享海报', icon: 'poster'},
            {name: '二维码', icon: 'qrcode'},
            {name: '小程序码', icon: 'weapp-qrcode'}
        ],
        headerTitle: "淘不到宝",
        bannerList: [],
        categoryList: [],
        recommendGoodList: [],
        saleGoodList: [],
        newGoodList: [],
        shoppingCartList: [],
        token: "",
        user: {},
        tempName: "",
        refreshTokenID: null,
        collectList: [],
        collectGoodIDList: [],
        isCollected: false,
        isFirstIn: true
    },
    mutations: {
        changeShowShare(state) {
            state.showShare = !state.showShare
        },
        fillIndexData(state, data) {
            state.bannerList = data.slides
            state.categoryList = data.categories
        },
        fillRecommendGoodList(state, data) {
            data.forEach(item => {
                state.recommendGoodList.push(item)
            })
        },
        fillSaleGoodList(state, data) {
            data.forEach(item => {
                state.saleGoodList.push(item)
            })
        },
        fillNewGoodList(state, data) {
            data.forEach(item => {
                state.newGoodList.push(item)
            })
        },
        fillShoppingCartData(state, data) {
            state.shoppingCartList = data
        },
        deleteShoppingCartGood(state, data) {
            state.shoppingCartList.splice(data, 1)
        },
        changeShoppingCartChecked(state, data) {
            if (data.index == -1) {
                if (data.allChecked)
                    state.shoppingCartList.forEach(item => {
                        item.is_checked = 0
                    })
                else
                    state.shoppingCartList.forEach(item => {
                        item.is_checked = 1
                    })
            } else
                state.shoppingCartList[data.index].is_checked = Math.abs(--state.shoppingCartList[data.index].is_checked)
        },
        fillCollect(state, data) {
            data.forEach(item => {
                state.collectList.push(item)
                state.collectGoodIDList.push(item.goods_id)
            })
        },
        judgeCollect(state, id) {
            state.isCollected = state.collectGoodIDList.indexOf(id) > -1
        }
    },
    actions: {
        getGoodData(context, data) {
            let params = {
                page: data.page,
                sales: 0,
                recommend: 0,
                new: 0
            }
            if (data.type == "sales") params.sales = 1
            else if (data.type == "recommend") params.recommend = 1
            else params.new = 1
            request({
                url: "/api/index",
                params
            }).then(res => {
                if (data.type == "sales") {
                    context.commit("fillSaleGoodList", res.data.goods.data)
                } else if (data.type == "new") {
                    context.commit("fillNewGoodList", res.data.goods.data)
                } else {
                    context.commit("fillRecommendGoodList", res.data.goods.data)
                }
            })
        },
        getIndexData(context) {
            request({
                url: "/api/index",
            }).then(res => {
                context.commit("fillIndexData", res.data)
            })
            this.dispatch("getGoodData", {page: 1, type: "sales"})
            this.dispatch("getGoodData", {page: 1, type: "recommend"})
            this.dispatch("getGoodData", {page: 1, type: "new"})
        },
        getShoppingCartData(context) {
            request({
                url: "/api/carts",
                params: {
                    include: "goods"
                },
                headers: {
                    'Authorization': 'Bearer ' + context.state.token
                }
            }).then(res => {
                context.commit("fillShoppingCartData", res.data.data)
            })
        },
        addShoppingCart(context, data) {
            request({
                url: "/api/carts",
                method: "post",
                data: {
                    goods_id: data
                },
                headers: {
                    'Authorization': 'Bearer ' + context.state.token
                }
            }).then(res => {
                if (res.status == 201) {
                    request({
                        url: "/api/carts",
                        params: {
                            include: "goods"
                        },
                        headers: {
                            'Authorization': 'Bearer ' + context.state.token
                        }
                    }).then(result => {
                        context.commit("fillShoppingCartData", result.data.data)
                        Toast.success("添加成功")
                    })
                } else if (res.status == 204) Toast.success("添加成功")
                else Toast.fail("添加失败")
            })
        },
        deleteShoppingCartGood(context, data) {
            request({
                url: `/api/carts/${context.state.shoppingCartList[data].id}`,
                method: "delete",
                headers: {
                    'Authorization': 'Bearer ' + context.state.token
                }
            }).then(res => {
                if (res.status == 204) {
                    context.commit("deleteShoppingCartGood", data)
                    Toast.success("移除成功")
                } else
                    Toast.fail("移除失败")
            })
        },
        changeCartNum(context, data) {
            request({
                url: `/api/carts/${data.id}`,
                method: "put",
                data: {
                    num: data.num
                },
                headers: {
                    'Authorization': "Bearer " + context.state.token
                }
            })
        },
        getInfo(context) {
            request({
                url: "/api/user",
                headers: {
                    'Authorization': 'Bearer ' + context.state.token
                }
            }).then(res => {
                context.state.user = res.data
                context.state.tempName = res.data.name
            })
        },
        logout(context) {
            request({
                url: "/api/auth/logout",
                method: "post",
                headers: {
                    "Authorization": "Bearer " + context.state.token
                }
            }).then(res => {
                if (res.status == 204) {
                    context.state.token = ""
                    context.state.user = {}
                    context.state.tempName = ""
                    window.clearInterval(context.state.refreshTokenID)
                    context.state.refreshTokenID = null
                    Toast.success("退出成功")
                    router.push("/login")
                } else Toast.fail("退出失败")
            })
        },
        login(context, info) {
            request({
                url: "/api/auth/login",
                method: "post",
                data: {
                    email: info.email,
                    password: info.password
                }
            }).then(res => {
                context.state.token = res.data.access_token
                router.push("/")
                context.state.refreshTokenID = setInterval(() => {
                    context.dispatch("refreshToken")
                }, 360000)
            }).catch(() => {
                Toast.fail("账号或密码有误")
            })
        },
        refreshToken(context) {
            request({
                url: "/api/auth/refresh",
                method: "post",
                headers: {
                    'Authorization': "Bearer " + context.state.token
                }
            }).then(res => {
                context.state.token = res.data.access_token
            })
        },
        changeShoppingCartChecked(context, data) {
            request({
                url: "/api/carts/checked",
                method: "patch",
                headers: {
                    'Authorization': "Bearer " + context.state.token
                },
                data: {
                    cart_ids: data
                }
            })
        },
        changeCollect(context, data) {
            request({
                url: `/api/collects/goods/${data.id}`,
                method: "post",
                headers: {
                    'Authorization': "Bearer " + context.state.token
                }
            }).then(res => {
                if (res.status == 201) {
                    Toast.success("收藏成功")
                    context.state.collectList = []
                    context.state.collectGoodIDList = []
                    context.dispatch("getCollect", {page: 1, id: data.id})
                } else if (res.status == 204) {
                    Toast.success("取消成功")
                    if (data.index != undefined) {
                        context.state.collectList.splice(data.index, 1)
                        context.state.collectGoodIDList.splice(data.index, 1)
                    } else {
                        context.state.collectList = []
                        context.state.collectGoodIDList = []
                        context.dispatch("getCollect", {page: 1, id: data.id})
                    }
                } else Toast.fail("操作失败")
            })
        },
        getCollect(context, data) {
            request({
                url: "/api/collects",
                params: {
                    page: data.page
                },
                headers: {
                    'Authorization': "Bearer " + context.state.token
                }
            }).then(res => {
                context.commit("fillCollect", res.data.data)
                if (data.id != undefined)
                    context.commit("judgeCollect", data.id)
            })
        }
    }
})

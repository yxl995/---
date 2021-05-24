<template>
  <Header>
    <template
        v-if="$router.currentRoute.value.fullPath=='/'||$router.currentRoute.value.fullPath=='/category'||$router.currentRoute.value.fullPath=='/shoppingCart'||$router.currentRoute.value.fullPath=='/info'||$router.currentRoute.value.fullPath=='/login'"
        v-slot:left>
      <div></div>
    </template>
  </Header>
  <router-view style="margin: 50px 0"/>
  <van-tabbar
      v-if="$router.currentRoute.value.fullPath=='/'||$router.currentRoute.value.fullPath=='/category'||$router.currentRoute.value.fullPath=='/shoppingCart'||$router.currentRoute.value.fullPath=='/info'"
      v-model="pageNum" route active-color="#713948" inactive-color="#E1BB87" @change="pageChange">
    <van-tabbar-item style="background-color: #FCE0E5" to="/" icon="wap-home-o" replace>主页</van-tabbar-item>
    <van-tabbar-item style="background-color: #FCE0E5" to="/category" icon="apps-o" replace>分类</van-tabbar-item>
    <van-tabbar-item style="background-color: #FCE0E5" to="/shoppingCart" replace>
      <span>购物车</span>
      <template #icon>
        <van-badge v-if="$store.state.shoppingCartList.length!=0" :content="$store.state.shoppingCartList.length">
          <van-icon name="shopping-cart-o"></van-icon>
        </van-badge>
        <van-icon v-else name="shopping-cart-o"></van-icon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item style="background-color: #FCE0E5" to="/info" icon="user-o" replace>个人中心</van-tabbar-item>
  </van-tabbar>
  <van-share-sheet v-model:show="$store.state.showShare" title="分享给好友吧~" :options="$store.state.options"
                   @select="selectShare"/>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  components: {
    Header
  },
  data() {
    return {
      pageNum: 0,
      title: "淘不到宝"
    }
  },
  methods: {
    pageChange(pageNum) {
      if (pageNum == 0) this.title = "淘不到宝"
      else if (pageNum == 1) this.title = "分类"
      else if (pageNum == 2) this.title = "购物车"
      else this.title = "个人中心"
    },
    selectShare(option) {
      this.$toast(option.name)
      this.$store.commit("changeShowShare")
    }
  }
}
</script>

<style lang="scss">
@import "./assets/css/base.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
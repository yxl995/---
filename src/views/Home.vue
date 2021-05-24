<template>
  <div>
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in $store.state.bannerList" :key="item.id">
        <img style="width:100%" :src="item.img_url">
      </van-swipe-item>
    </van-swipe>
    <van-search v-model="searchContent" placeholder="请输入书目名称" shape="round" background="#F9EAE0" @search="search"/>
    <van-tabs v-model:active="tabNum" color="#713948" background="#F9EAE0"
              title-active-color="#713948" title-inactive-color="#DF6C7E" sticky offset-top="50px"
              :before-change="changeTab">
      <van-tab title="推荐商品">
        <van-list v-model:loading="loading" :finished="finished"
                  finished-text="——————没有更多了哦——————"
                  class="list" @load="getGood" :immediate-check="false" :offset="0">
          <GoodCard v-for="item in $store.state.recommendGoodList" :key="item.id" :obj="item"></GoodCard>
        </van-list>
      </van-tab>
      <van-tab title="热卖商品">
        <van-list v-model:loading="loading" :finished="finished"
                  finished-text="——————没有更多了哦——————"
                  class="list" @load="getGood" :immediate-check="false" :offset="0">
          <GoodCard v-for="item in $store.state.saleGoodList" :key="item.id" :obj="item"></GoodCard>
        </van-list>
      </van-tab>
      <van-tab title="最新商品">
        <van-list v-model:loading="loading" :finished="finished"
                  finished-text="——————没有更多了哦——————"
                  class="list" @load="getGood" :immediate-check="false" :offset="0">
          <GoodCard v-for="item in $store.state.newGoodList" :key="item.id" :obj="item"></GoodCard>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import GoodCard from "../components/GoodCard.vue";

export default {
  name: 'Home',
  components: {
    GoodCard
  },
  data() {
    return {
      tabNum: 0,
      recommendPageCount: 1,
      salePageCount: 1,
      newPageCount: 1,
      loading: false,
      finished: false,
      searchContent: ""
    }
  },
  mounted() {
    this.$store.dispatch("getIndexData")
    if (this.$store.state.token != '' && this.$store.state.isFirstIn) {
      this.$store.dispatch("getShoppingCartData")
      this.$store.dispatch("getCollect", {page: 1})
      this.$store.state.isFirstIn = false
    }
  },
  methods: {
    getGood() {
      if (this.tabNum == 1) {
        this.salePageCount++
        this.$store.dispatch("getGoodData", {page: this.salePageCount, type: "sales"})
      } else if (this.tabNum == 2) {
        this.newPageCount++
        this.$store.dispatch("getGoodData", {page: this.newPageCount, type: "new"})
      } else {
        this.recommendPageCount++
        this.$store.dispatch("getGoodData", {page: this.recommendPageCount, type: "recommend"})
      }
      setTimeout(() => {
        this.loading = false
        if (this.$store.state.recommendGoodList.length < this.recommendPageCount * 10 || this.$store.state.saleGoodList.length < this.salePageCount * 10 || this.$store.state.newGoodList.length < this.newPageCount * 10) this.finished = true
      }, 2000)
    },
    changeTab() {
      this.loading = false
      this.finished = false
      return true
    },
    search() {
      if (this.searchContent.length == 0) this.$toast.fail("输入不能为空")
      else {
        this.$router.push({name: "SearchGood", params: {content: this.searchContent}})
      }
    }
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

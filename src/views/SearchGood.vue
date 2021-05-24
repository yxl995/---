<template>
  <div style="width: 100%">
    <van-sticky :offset-top="50">
      <van-search v-model="content" placeholder="请输入书目名称" shape="round" background="#F9EAE0"
                  @search="searchGood(true)"/>
    </van-sticky>
    <van-empty v-if="goodList.length==0" image="search" description="搜索不到相关商品哦~"/>
    <van-list v-else v-model:loading="loading" :finished="finished" finished-text="——————没有更多了哦——————"
              style="display: flex;flex-wrap: wrap;justify-content: center" @load="searchGood"
              :immediate-check="false" :offset="0">
      <GoodCard v-for="(item,index) in goodList" :key="index" :obj="item"></GoodCard>
    </van-list>
  </div>
</template>

<script>
import GoodCard from "../components/GoodCard";
import {request} from "../network/request";

export default {
  name: "searchGood",
  components: {GoodCard},
  data() {
    return {
      content: "",
      loading: false,
      finished: false,
      goodList: [],
      page: 1
    }
  },
  mounted() {
    this.content = this.$route.params.content
    request({
      url: "/api/goods",
      params: {
        title: this.content
      }
    }).then(res => {
      this.goodList = res.data.goods.data
      this.page++
    })
  },
  methods: {
    searchGood(reset) {
      if (reset) {
        this.page = 1
        this.goodList = []
        this.finished = false
      }
      request({
        url: "/api/goods",
        params: {
          page: this.page,
          title: this.content
        }
      }).then(res => {
        this.loading = false
        if (res.data.goods.data.length == 0) this.finished = true
        else {
          res.data.goods.data.forEach(item => {
            this.goodList.push(item)
          })
          this.page++
        }
      })
    }
  }
}
</script>
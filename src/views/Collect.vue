<template>
  <div>
    <van-empty v-if="$store.state.collectList.length==0"
               image="https://img.yzcdn.cn/vant/custom-empty-image.png"
               description="您还没有收藏东西哦，快去商城逛逛吧~"/>
    <van-list v-else v-model:loading="loading" :finished="finished" :offset="0" @load="getCollect"
              finished-text="没有更多了哦" :immediate-check="false">
      <van-swipe-cell v-for="(item,index) in $store.state.collectList" :key="index">
        <van-card :price="item.goods.price+'.00'" :desc="item.goods.description" :thumb="item.goods.cover_url"
                  style="margin: 10px;border-radius: 10px;text-align: initial">
          <template #tags>
            <van-tag v-if="Math.random()*2<1" style="margin-right: 5px" color="red">热卖</van-tag>
            <van-tag v-if="Math.random()*2<1" color="#be99ff">推荐</van-tag>
          </template>
          <template #title>
            <h3 style="color: #DF6C7E">{{ item.goods.title }}</h3>
            <van-icon style="position:absolute;top: 0;right: 0"
                      size="20" color="#DF6C7E" name="like" @click="cancelCollect(index)"/>
          </template>
        </van-card>
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<script>
import {request} from "../network/request";

export default {
  name: "Collect",
  data() {
    return {
      loading: false,
      finished: false,
      page: 1
    }
  },
  methods: {
    cancelCollect(index) {
      this.$dialog.confirm({
        title: '提示',
        message: '您确认要取消收藏吗',
        confirmButtonColor: "#DF6C7E",
        closeOnClickOverlay: true
      }).then(() => {
        this.$store.dispatch("changeCollect", {id: this.$store.state.collectList[index].goods_id, index})
      }).catch(() => {
      })
    },
    getCollect() {
      this.page++
      request({
        url: "/api/collects",
        params: {
          page: this.page
        },
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(res => {
        setTimeout(() => {
          this.loading = false
          if (res.data.data.length == 0)
            this.finished = true
        }, 300)
      })
    }
  }
}
</script>
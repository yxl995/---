<template>
  <div>
    <img :src="goodDetail.cover_url" style="width: 100%" @click="previewImg">
    <div class="content">
      <div class="left">
        <h2>{{ goodDetail.title }}</h2>
        <div style="color: #8785a2;font-size: 14px;margin: 20px 0">{{ goodDetail.description }}</div>
        <div>
          <van-tag v-if="goodDetail.is_on==1" style="margin-right: 5px" color="red">热卖</van-tag>
          <van-tag v-if="goodDetail.is_recommend==1" color="#fc5185">推荐</van-tag>
        </div>
      </div>

      <div class="right">
        <div class="price">
          <div style="font-size: 30px">￥</div>
          <div style="font-size: 25px">{{ goodDetail.price }}</div>
        </div>
        <div style="font-size: 14px;color: #e84545">
          {{ goodDetail.collects_count }}人收藏&emsp;销量{{ goodDetail.sales }}件
        </div>
        <div style="font-size: 14px;color: #8785a2">上架时间：{{ createTime }}</div>
      </div>
    </div>

    <van-tabs v-model:active="tabNum" color="#713948" background="#F9EAE0"
              title-active-color="#713948" title-inactive-color="#DF6C7E" sticky offset-top="50px">
      <van-tab title="概述">
        <div style="width: 100vw;overflow: hidden" v-html="goodDetail.details"></div>
      </van-tab>
      <van-tab title="相关图书">
        <van-list class="list">
          <GoodCard v-for="item in likeGoods" :key="item.id" :obj="item"></GoodCard>
        </van-list>
      </van-tab>
    </van-tabs>

    <van-action-bar v-if="$store.state.token!=''">
      <van-action-bar-icon @click="toPage('/shoppingCart')" text="购物车" color="#f38181">
        <template #icon>
          <van-badge v-if="$store.state.shoppingCartList.length!=0" :content="$store.state.shoppingCartList.length">
            <van-icon name="shopping-cart-o"></van-icon>
          </van-badge>
          <van-icon v-else name="shopping-cart-o"></van-icon>
        </template>
      </van-action-bar-icon>
      <van-action-bar-icon v-if="$store.state.isCollected" icon="star" text="已收藏"
                           color="#f38181" @click="changeCollect"/>
      <van-action-bar-icon v-else icon="star-o" text="收藏" color="#f38181" @click="changeCollect"/>
      <van-action-bar-button @click="addShoppingCart" color="#ffb6b9" text="加入购物车"/>
      <van-action-bar-button @click="buy" color="#f38181" text="立即购买"/>
    </van-action-bar>
    <van-action-bar v-else>
      <van-action-bar-button @click="toPage('/info')" color="#f38181" text="请先登录"/>
    </van-action-bar>
    <van-overlay style="display: flex;justify-content: center;align-items: center" :show="loading">
      <van-loading v-show="loading" size="24px" color="#DF6C7E" vertical>跳转中</van-loading>
    </van-overlay>
  </div>
</template>

<script>
import {request} from "../network/request";
import {ImagePreview} from "vant";
import GoodCard from "../components/GoodCard.vue";

export default {
  name: "GoodDetail",
  components: {
    GoodCard
  },
  data() {
    return {
      goodDetail: {},
      createTime: "",
      tabNum: 0,
      likeGoods: [],
      loading: false
    }
  },
  mounted() {
    request({
      url: `/api/goods/${this.$route.params.id}`
    }).then(res => {
      this.goodDetail = res.data.goods
      this.createTime = this.changeTimeStyle(this.goodDetail.created_at)
      this.likeGoods = res.data.like_goods
      this.$store.commit("judgeCollect", this.goodDetail.id)
    })
  },
  watch: {
    $route(to) {
      if (to.fullPath.slice(0, 11) == "/goodDetail") {
        request({
          url: `/api/goods/${to.params.id}`
        }).then(res => {
          this.goodDetail = res.data.goods
          this.createTime = this.changeTimeStyle(this.goodDetail.created_at)
          this.likeGoods = res.data.like_goods
          this.$store.commit("judgeCollect", this.goodDetail.id)
          document.documentElement.scrollTop = 0
        })
      }
    }
  },
  methods: {
    changeCollect() {
      this.$store.dispatch("changeCollect", {id: this.goodDetail.id})
    },
    changeTimeStyle(time) {
      let temp = time.split('T')
      return temp[0] + " " + temp[1].split('.')[0]
    },
    previewImg() {
      let array = []
      array.push(this.goodDetail.cover_url)
      ImagePreview(array)
    },
    toPage(path) {
      this.$router.push(path)
    },
    addShoppingCart() {
      this.$store.dispatch("addShoppingCart", this.goodDetail.id)
    },
    buy() {
      this.addShoppingCart()
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.toPage('/shoppingCart')
      }, 2000)
    }
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.price {
  display: flex;
  align-items: flex-end;
  color: red;
  font-weight: bold;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  top: 20px;
  bottom: 20px;
  right: 20px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
<template>
  <div>
    <van-tabs v-model:active="tabNum" color="#713948" background="#F9EAE0" sticky @change="changeTabs"
              title-active-color="#713948" title-inactive-color="#DF6C7E" offset-top="50px">
      <van-tab v-for="item in orderList" :key="item.status">
        <template #title>
          <div style="width: 75px;height: 44px;display: flex;justify-content:center;align-items: center"
               v-if="item.status==1&&item.list.length!=0">
            <van-badge :content="item.list.length">
              <div>{{ item.title }}</div>
            </van-badge>
          </div>
          <div style="width: 75px;height: 44px;display: flex;justify-content:center;align-items: center"
               v-else-if="item.status==2&&item.list.length!=0">
            <van-badge :content="item.list.length" color="#be99ff">
              <div>{{ item.title }}</div>
            </van-badge>
          </div>
          <div style="width: 75px;height: 44px;display: flex;justify-content:center;align-items: center"
               v-else-if="item.status==3&&item.list.length!=0">
            <van-badge :content="item.list.length" color="#DF6C7E">
              <div>{{ item.title }}</div>
            </van-badge>
          </div>
          <div v-else>{{ item.title }}</div>
        </template>
        <van-empty v-if="item.list.length==0"
                   image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                   description="暂无订单哦，快去商城逛逛吧~"/>
        <van-list v-else v-model:loading="item.loading" :finished="item.finished"
                  finished-text="没有更多了哦" @load="loadOrder(item)"
                  :immediate-check="false" :offset="0">
          <van-notice-bar v-if="item.status==2||item.status==3" left-icon="volume-o" :text="noticeText"/>
          <OrderCard v-for="order in item.list" :key="order.id" :order="order" @missPay="missPay"
                     @finishOrder="finishOrder" @commentOrder="commentOrder" @pay="pay"></OrderCard>
        </van-list>
      </van-tab>
    </van-tabs>
    <van-popup style="display: flex;flex-direction: column;align-items: center"
               v-model:show="commentShow" position="bottom" closeable @close="resetComment">
      <van-rate style="margin-top: 20px" v-model="commentRate" icon="like" void-icon="like-o" color="#DF6C7E"/>
      <van-field v-model="commentContent" autosize label="评论内容" type="textarea"
                 maxlength="100" placeholder="请输入评论" show-word-limit
                 style="margin-top: 10px" label-width="60"/>
      <van-button color="linear-gradient(to right, #DF6C7E, #E1B6D3)"
                  style="width: 50%;border-radius: 5px;margin: 10px" @click="submitComment">提交评论
      </van-button>
    </van-popup>
  </div>
</template>

<script>
import {request} from "../network/request";
import OrderCard from "../components/OrderCard.vue";

export default {
  name: "OrderList",
  components: {OrderCard},
  mounted() {
    let params = {
      include: "goods,orderDetails"
    }
    this.getOrderList(params)
  },
  data() {
    return {
      commentOrderID: null,
      commentGoodID: null,
      commentShow: false,
      commentContent: "",
      commentRate: 0,
      noticeText: "",
      tabNum: 0,
      loading: false,
      finished: false,
      orderList: [{
        page: 1,
        status: 1,
        title: "待支付",
        loading: false,
        finished: false,
        list: []
      }, {
        page: 1,
        status: 2,
        title: "待发货",
        loading: false,
        finished: false,
        list: []
      }, {
        page: 1,
        status: 3,
        title: "配送中",
        loading: false,
        finished: false,
        list: []
      }, {
        page: 1,
        status: 4,
        title: "已签收",
        loading: false,
        finished: false,
        list: []
      }, {
        page: 1,
        status: 5,
        title: "已失效",
        loading: false,
        finished: false,
        list: []
      }]
    }
  },
  methods: {
    changeTabs(number) {
      if (this.orderList[number].status == 2) this.noticeText = "商家正在火速接单中，请耐心等候哦~"
      if (this.orderList[number].status == 3) this.noticeText = "快递小哥正在火速配送中，请耐心等候哦~"
      return true
    },
    getOrderList(params) {
      request({
        url: "/api/orders",
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        },
        params
      }).then(res => {
        return this.dispatchOrder(res.data.data)
      })
    },
    dispatchOrder(data) {
      data.forEach(item => {
        if (item.status == 1) this.orderList[0].list.push(item)
        else if (item.status == 2) this.orderList[1].list.push(item)
        else if (item.status == 3) this.orderList[2].list.push(item)
        else if (item.status == 4) this.orderList[3].list.push(item)
        else this.orderList[4].list.push(item)
      })
      if (data.length == 0) return false
      else return true
    },
    missPay(data) {
      this.orderList[0].list.forEach((item, index) => {
        if (item.id == data) {
          item.status = 5
          this.orderList[4].list.push(item)
          this.orderList[0].list.splice(index, 1)
          this.$toast("您有订单未按时支付，已取消")
        }
      })
    },
    finishOrder(data) {
      request({
        url: `/api/orders/${data}/confirm`,
        method: "patch",
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(() => {
        this.orderList[2].list.forEach((item, index) => {
          if (item.id == data) {
            item.status = 4
            this.orderList[3].list.push(item)
            this.orderList[2].list.splice(index, 1)
            this.$toast.success("签收成功")
          }
        })
      }).catch(() => {
        this.$toast.fail("订单状态异常")
      })
    },
    commentOrder(data) {
      this.commentShow = true
      this.commentOrderID = data.orderID
      this.commentGoodID = data.goodID
    },
    submitComment() {
      if (this.commentContent == "") this.$toast.fail("请填写评论")
      else {
        request({
          url: `/api/orders/${this.commentOrderID}/comment`,
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            goods_id: this.commentGoodID,
            content: this.commentContent,
            star: this.commentRate
          }
        }).then(() => {
          this.$toast.success("评论成功")
        }).catch(err => {
          this.$toast.fail(err.response.data.message);
        }).finally(() => {
          this.commentShow = false
          this.resetComment()
        })
      }
    },
    resetComment() {
      this.commentRate = 0
      this.commentContent = ""
      this.commentOrderID = null
      this.commentGoodID = null
    },
    loadOrder(item) {
      item.page++
      let params = {
        page: item.page,
        include: "goods,orderDetails",
        status: item.status
      }
      let result = this.getOrderList(params)
      setTimeout(() => {
        this.orderList[item.status - 1].loading = false
        if (!result) this.orderList[item.status - 1].finished = true
      }, 2000)
    },
    pay(id) {
      this.$router.push({name: "Pay", params: {id}})
    }
  }
}
</script>
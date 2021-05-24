<template>
  <div class="container">
    <div style="font-size: 14px;color: gray;margin: 5px">订单编号：{{ order.order_no }}</div>
    <van-card v-for="(item,index) in order.goods.data" :key="index" :price="item.price+'.00'"
              :desc="item.description" :thumb="item.cover_url" :num="order.orderDetails.data[index].num"
              style="margin: 5px;border-radius: 10px;text-align: initial;background-color:white;box-shadow: 0 3px 3px lightgray;">
      <template #tags>
        <van-tag v-if="item.is_on==1" style="margin-right: 5px" color="red">热卖</van-tag>
        <van-tag v-if="item.is_recommend==1" color="#be99ff">推荐</van-tag>
      </template>
      <template #title>
        <div style="display: flex;justify-content: space-between;align-items: center">
          <h3 style="color: #DF6C7E">{{ item.title }}</h3>
          <van-button v-if="order.status==4" style="width: 20%;border-radius: 5px;" @click="commentOrder(item.id)"
                      color="linear-gradient(to right, #DF6C7E, #E1B6D3)" size="mini">评价
          </van-button>
        </div>
      </template>
    </van-card>
    <div
        style="font-size: 14px;color: gray;margin: 5px;display: flex;justify-content: space-between;align-items: flex-end">
      <span>总价:
        <span style="color: orangered">
          ￥<span style="font-size: 20px">{{ order.amount }}</span>.00
        </span>
      </span>
      <span v-if="order.status!=1&&order.status!=5">下单时间：{{ order.created_at }}</span>
      <div v-else-if="order.status==1"
           style="display: flex;font-size: 14px;align-items: center;color:black">请于
        <van-count-down style="color: red" format="mm:ss" time="3600000" @finish="missPay(order.id)"/>
        内尽快支付
      </div>
    </div>
    <div v-if="order.status==3||order.status==4" style="font-size: 14px;color: gray;margin: 5px">
      快递单号：{{ order.express_no }}
    </div>
    <div v-if="order.status==1" style="display: flex;margin: 5px;justify-content: flex-end">
      <van-button style="width: 35%;border-radius: 10px" color="linear-gradient(to right, #DF6C7E, #E1B6D3)"
                  @click="pay">立即支付
      </van-button>
    </div>
    <div v-else-if="order.status==2" style="display: flex;justify-content: flex-end;margin: 5px">
      <van-button style="width: 35%;border-radius: 10px" @click="remindOrder(order.id)">催单</van-button>
    </div>
    <div v-else-if="order.status==3" style="display: flex;justify-content: space-between;margin: 5px">
      <van-button style="width: 35%;border-radius: 10px" @click="remindOrder(order.id)">催单</van-button>
      <van-button style="width: 35%;border-radius: 10px" @click="finishOrder(order.id)"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)">确认收货
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderCard",
  props: {order: Object},
  methods: {
    missPay(id) {
      this.$emit("missPay", id)
    },
    remindOrder(id) {
      this.$toast("已向商家催单" + id + "，请耐心等候哦~")
    },
    finishOrder(id) {
      this.$emit("finishOrder", id)
    },
    commentOrder(id) {
      this.$emit("commentOrder", {orderID: this.order.id, goodID: id})
    },
    pay() {
      this.$emit("pay", this.order.id)
    }
  }
}
</script>
<style scoped>
.container {
  width: 90%;
  padding: 10px;
  margin: 20px auto;
  background-color: #eeeeee;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: initial;
  box-shadow: 0 5px 5px lightgray;
}
</style>
<template>
  <div style="width: 100%;display: flex;flex-direction: column;align-items: center">
    <AddressChoice :address="chosenAddress" @changeAddress="changeOrAdd"></AddressChoice>
    <div class="divider">
      <div class="dividerChild" v-for="item in 20" :key="item"></div>
    </div>
    <van-card v-for="(item,index) in cartList" :key="index" :num="item.num" :price="item.goods.price"
              :thumb="item.goods.cover_url"
              style="text-align: initial;width: 90%;border-radius: 10px">
      <template #title>
        <h2 style="margin-top: 5px;color: #DF6C7E">{{ item.goods.title }}</h2>
      </template>
    </van-card>
    <van-submit-bar :price="totalPrice*100" button-text="提交订单" @submit="submitOrder" button-color="#DF6C7E"/>
    <van-popup v-model:show="changeAddressShow" position="bottom" round
               style="display: flex;flex-direction: column;align-items: center;background-color: #F9EAE0;padding-top: 10px">
      <AddressCard v-for="(item,index) in addressList" :key="index" :address="item">
        <template #right>
          <div></div>
        </template>
        <template #close>
          <div></div>
        </template>
        <template #left="address">
          <div style="display: flex;align-items: center;justify-content: center;flex: 1;">
            <van-icon v-if="address.address.id==chosenAddress.id" name="checked"></van-icon>
            <van-icon v-else name="circle" @click="changeAddress(address.address.id)"></van-icon>
          </div>
        </template>
      </AddressCard>
      <AddressChoice :address="null" @changeAddress="changeOrAdd('add')"></AddressChoice>
    </van-popup>
    <van-popup v-model:show="payShow" position="bottom" round
               style="display: flex;flex-direction: column;align-items: center;background-color: #F9EAE0;padding: 5px 0">
      <van-button round type="primary" icon="alipay" style="width: 80%;font-size: 16px;margin: 5px 0"
                  text="支付宝付款" @click="payByAlipay"/>
      <van-button round style="width: 80%;font-size: 16px;margin: 5px 0" text="等会儿再说" @click="toOrderList"/>
    </van-popup>
  </div>
</template>

<script>
import {request} from "../network/request";
import AddressChoice from "../components/AddressChoice";
import AddressCard from "../components/AddressCard";

export default {
  name: "OrderPreview",
  components: {
    AddressChoice,
    AddressCard
  },
  mounted() {
    request({
      url: "/api/orders/preview",
      headers: {
        'Authorization': "Bearer " + this.$store.state.token
      }
    }).then(res => {
      this.addressList = res.data.address
      this.cartList = res.data.carts
      if (this.addressList.length != 0) {
        this.addressList.forEach(item => {
          if (item.is_default == 1) this.chosenAddress = item
        })
        if (this.chosenAddress == null) this.chosenAddress = this.addressList[0]
      }
    })
  },
  data() {
    return {
      addressList: [],
      cartList: [],
      chosenAddress: null,
      changeAddressShow: false,
      payShow: false,
      orderID: ""
    }
  },
  methods: {
    changeAddress(id) {
      this.addressList.forEach(item => {
        if (item.id == id) this.chosenAddress = item
      })
      this.changeAddressShow = false
    },
    changeOrAdd(mode) {
      if (this.addressList.length != 0)
        this.changeAddressShow = true
      if (this.addressList.length == 0 || mode == "add") {
        let item = {
          name: "",
          address: "",
          phone: "",
          province: "",
          city: "",
          county: "",
          is_default: false
        }
        this.$router.push({name: "AddAddress", params: {mode: "add", item: JSON.stringify(item)}})
      }
    },
    submitOrder() {
      if (this.chosenAddress != null && this.orderID == "")
        request({
          url: "/api/orders",
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            address_id: this.chosenAddress.id
          }
        }).then((res) => {
          this.payShow = true
          this.orderID = res.data.id
          this.$toast.success("创建订单成功")
          this.$store.dispatch("getShoppingCartData")
        }).catch(err => {
          if (err.response.status == 400) this.$toast.fail("商品库存不足")
        })
      else if (this.chosenAddress == null) this.$toast.fail("收货地址不能为空")
      else this.$toast.fail("不可重复创建订单")
    },
    toOrderList() {
      this.$router.push("/orderList")
    },
    payByAlipay() {
      this.$router.push({name: "Pay", params: {id: this.orderID}})
    }
  },
  computed: {
    totalPrice: {
      get() {
        let total = 0
        this.cartList.forEach(item => {
          total += item.num * item.goods.price
        })
        return total
      }
    }
  }
}
</script>
<style scoped>
.divider {
  width: 100%;
  height: 5px;
  display: flex;
}

.dividerChild {
  width: 5%;
  height: 5px;
}

.dividerChild:nth-child(odd) {
  background-color: #DF6C7E;
}

.dividerChild:nth-child(even) {
  background-color: #E1B6D3;
}
</style>
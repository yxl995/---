<template>
  <div style="padding-top: 5px;padding-bottom:55px;min-height: calc(100vh - 150px)">
    <van-empty v-if="$store.state.token==''"
               description="请先登录"/>
    <van-empty v-else-if="$store.state.shoppingCartList.length==0"
               image="https://img.yzcdn.cn/vant/custom-empty-image.png"
               description="购物车空空如也，快去商城逛逛吧~"/>
    <van-card v-else v-for="(item,index) in $store.state.shoppingCartList" :key="item.id"
              :price="item.goods.price+'.00'"
              :desc="item.goods.description" :thumb="item.goods.cover_url"
              style="margin: 10px;border-radius: 10px;text-align: initial">
      <template #num>
        <van-stepper @change="changeCartNum(index)" v-model="item.num" integer min="1"/>
      </template>
      <template #tags>
        <van-tag v-if="item.goods.is_on==1" style="margin-right: 5px" color="red">热卖</van-tag>
        <van-tag v-if="item.goods.is_recommend==1" color="#be99ff">推荐</van-tag>
      </template>
      <template #title>
        <h3 style="color: #DF6C7E">{{ item.goods.title }}</h3>
        <van-icon @click="deleteGood(index)" style="position:absolute;top: 0;right: 25px"
                  size="20" color="red" name="close"/>
        <van-icon v-if="item.is_checked==1" @click="changeChecked(index)" style="position:absolute;top: 0;right: 0"
                  size="20" color="#DF6C7E" name="checked"/>
        <van-icon v-else @click="changeChecked(index)" style="position:absolute;top: 0;right: 0"
                  size="20" color="lightgrey" name="circle"/>
      </template>
    </van-card>
    <van-submit-bar v-if="$store.state.token!=''" button-color="#DF6C7E" style="bottom: 50px" :price="totalPrice*100"
                    button-text="结算" @submit="submitOrder">
      <van-icon v-if="allChecked" @click="changeChecked(-1)"
                size="20" color="#DF6C7E" name="checked"/>
      <van-icon v-else @click="changeChecked(-1)"
                size="20" color="lightgrey" name="circle"/>
      <div style="margin-left: 5px;height: 20px;line-height: 20px;font-size: 16px">全选</div>
    </van-submit-bar>
  </div>
</template>

<script>

export default {
  name: "ShoppingCart",
  methods: {
    submitOrder() {
      if (this.checkedList.length != 0) this.$router.push("/orderPreview")
      else this.$toast.fail("未选择商品")
    },
    deleteGood(index) {
      this.$store.dispatch("deleteShoppingCartGood", index)
    },
    changeChecked(index) {
      this.$store.commit("changeShoppingCartChecked", {index, allChecked: this.allChecked})
      this.$store.dispatch("changeShoppingCartChecked", this.checkedList)
    },
    changeCartNum(index) {
      this.$store.dispatch("changeCartNum", {
        id: this.$store.state.shoppingCartList[index].id,
        num: this.$store.state.shoppingCartList[index].num
      })
    }
  },
  computed: {
    totalPrice: {
      get() {
        let total = 0
        this.$store.state.shoppingCartList.forEach(item => {
          if (item.is_checked == 1) total += item.num * item.goods.price
        })
        return total
      }
    },
    allChecked: {
      get() {
        let result = true
        for (let i = 0; i < this.$store.state.shoppingCartList.length; i++) {
          if (this.$store.state.shoppingCartList[i].is_checked == 0) {
            result = false
            break
          }
        }
        return result
      }
    },
    checkedList: {
      get() {
        let list = []
        this.$store.state.shoppingCartList.forEach(item => {
          if (item.is_checked == 1) list.push(item.id)
        })
        return list
      }
    }
  }
}
</script>
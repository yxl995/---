<template>
  <div @click="changeAddress" class="box">
    <div class="left">
      <van-icon v-if="address!=null" name="user-o" size="30"></van-icon>
      <van-icon v-else name="plus" size="20"></van-icon>
    </div>
    <div class="middle">
      <div v-if="address!=null">
        <div style="margin-bottom: 5px">收件人：{{ address.name }}</div>
        <div style="margin-bottom: 5px">手机号：{{ address.phone }}</div>
        <div v-if="address.province!=address.city">
          收件地址：{{ address.province + address.city + address.county + address.address }}
        </div>
        <div v-else>
          收件地址：{{ address.city + address.county + address.address }}
        </div>
      </div>
      <div v-else style="font-size: 18px;margin: 10px 0">新增收货地址</div>
    </div>
    <div class="right">
      <van-icon name="arrow"></van-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddressChoice",
  props: {
    address: Object
  },
  methods: {
    changeAddress() {
      this.$emit("changeAddress")
    }
  }
}
</script>
<style scoped>
.box {
  width: 90%;
  display: flex;
  background-color: #8785a2;
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
}

.left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.middle {
  flex: 8;
  text-align: initial;
  display: flex;
  flex-direction: column;
  word-break: break-all;
  padding: 0 10px;
  color: white;
  font-size: 14px;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
</style>
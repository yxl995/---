<template>
  <div class="container">
    <van-empty v-if="addressList.length==0" image="https://img.yzcdn.cn/vant/custom-empty-image.png"
               description="赶紧添加一个收货地址吧~"/>
    <AddressCard v-for="(item,index) in addressList" :key="index" :address="item" @setDefault="setDefault"
                 @editAddress="editAddress" @deleteAddress="deleteAddress"></AddressCard>
    <div class="bottom">
      <van-button style="width: 70%;height: 40px;font-size: 16px;" round @click="addAddress"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)">新增地址
      </van-button>
    </div>
  </div>
</template>

<script>
import {request} from "../network/request";
import AddressCard from "../components/AddressCard.vue";

export default {
  name: "ManageAddress",
  components: {AddressCard},
  mounted() {
    request({
      url: "/api/address",
      headers: {
        'Authorization': "Bearer " + this.$store.state.token
      }
    }).then(res => {
      this.addressList = res.data.data
      let newItem = null
      this.addressList.forEach((item, index) => {
        if (item.is_default == 1) {
          newItem = item
          this.addressList.splice(index, 1)
        }
      })
      if (newItem != null)
        this.addressList.unshift(newItem)
    })
  },
  data() {
    return {
      addressList: []
    }
  },
  methods: {
    addAddress() {
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
    },
    editAddress(item) {
      item.is_default = item.is_default == 1 ? true : false
      this.$router.push({name: "AddAddress", params: {mode: "update", item: JSON.stringify(item)}})
    },
    deleteAddress(id) {
      request({
        url: `/api/address/${id}`,
        method: "delete",
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(() => {
        this.$toast.success("删除成功")
        this.addressList.forEach((item, index) => {
          if (item.id == id) this.addressList.splice(index, 1)
        })
      })
    },
    setDefault(id) {
      request({
        url: `/api/address/${id}/default`,
        method: "patch",
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(() => {
        let newItem
        this.addressList.forEach((item, index) => {
          if (item.is_default == 1) item.is_default = 0
          if (item.id == id) {
            item.is_default = 1
            newItem = item
            this.addressList.splice(index, 1)
          }
        })
        this.addressList.unshift(newItem)
        this.$toast.success("修改成功")
      })
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom {
  width: 100%;
  min-height: 50px;
  position: fixed;
  bottom: 0;
  background-color: #FCE0E5;
  display: flex;
  /*flex-direction: column;*/
  justify-content: space-evenly;
  align-items: center;
}
</style>
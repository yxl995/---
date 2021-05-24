<template>
  <div class="container">
    <div class="box">
      <van-field v-model="address.name" label="姓名" placeholder="收货人姓名" label-width="56"
                 style="border-radius: 5px;margin: 10px 0"/>
      <van-field v-model="address.phone" type="tel" label="手机" placeholder="收货人联系方式" label-width="56"
                 style="border-radius: 5px;margin: 10px 0"/>
      <van-field v-model="fullAddress" is-link label="地区" placeholder="省/市/区" label-width="56"
                 style="border-radius: 5px;margin: 10px 0" readonly @click="areaShow = true"/>
      <van-field v-model="address.address" label="详细地址" placeholder="街道门牌、楼层房号等信息" label-width="56"
                 style="border-radius: 5px;margin: 10px 0"/>
      <van-cell center title="设为默认收货地址" style="border-radius: 5px">
        <template #right-icon>
          <van-switch v-model="address.is_default" size="24" active-color="#DF6C7E"/>
        </template>
      </van-cell>
      <van-button v-if="mode=='add'" style="border-radius: 5px;width: 100%;margin: 10px 0;font-size: 18px"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)" @click="addAddress">添加地址
      </van-button>
      <van-button v-if="mode=='update'" style="border-radius: 5px;width: 100%;margin: 10px 0;font-size: 18px"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)" @click="updateAddress">更新地址
      </van-button>
    </div>
    <van-popup v-model:show="areaShow" round position="bottom">
      <van-area :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']"
                @cancel="cancelArea" @confirm="confirmArea"/>
    </van-popup>
  </div>
</template>

<script>
import {china} from "../assets/js/china";
import {request} from "../network/request";

export default {
  name: "AddAddress",
  data() {
    return {
      mode: "",
      address: {},
      areaShow: false,
      fullAddress: "",
      areaList: china
    }
  },
  mounted() {
    this.mode = this.$route.params.mode
    this.address = JSON.parse(this.$route.params.item)
    if (this.mode == "update") {
      this.$store.state.headerTitle = "修改地址"
      if (this.address.province == this.address.city) this.fullAddress = this.address.province + "/" + this.address.county
      else this.fullAddress = this.address.province + "/" + this.address.city + "/" + this.address.county
    }
  },
  methods: {
    cancelArea() {
      this.areaShow = false
    },
    confirmArea(array) {
      if (array[1] != undefined && array[2] != undefined && array[0].name != "" && array[1].name != "" && array[2].name != "") {
        if (array[0].name == array[1].name) this.fullAddress = array[1].name + "/" + array[2].name
        else this.fullAddress = array[0].name + "/" + array[1].name + "/" + array[2].name
        this.areaShow = false
        this.address.province = array[0].name
        this.address.city = array[1].name
        this.address.county = array[2].name
      } else this.$toast.fail("未选择完整")
    },
    addAddress() {
      if (this.address.name != "" && this.address.phone != "" && this.fullAddress != "" && this.address.address != "")
        request({
          url: "/api/address",
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            name: this.address.name,
            address: this.address.address,
            phone: this.address.phone,
            province: this.address.province,
            city: this.address.city,
            county: this.address.county,
            is_default: this.address.is_default ? 1 : 0
          }
        }).then(() => {
          this.$toast.success("添加成功")
          this.$router.replace("/manageAddress")
        }).catch(() => {
          this.$toast.fail("手机格式不正确")
        })
      else this.$toast.fail("请完善信息")
    },
    updateAddress() {
      if (this.address.name != "" && this.address.phone != "" && this.fullAddress != "" && this.address.address != "")
        request({
          url: `/api/address/${this.address.id}`,
          method: "put",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            name: this.address.name,
            address: this.address.address,
            phone: this.address.phone,
            province: this.address.province,
            city: this.address.city,
            county: this.address.county,
            is_default: this.address.is_default ? 1 : 0
          }
        }).then(() => {
          this.$toast.success("更新成功")
          this.$router.replace("/manageAddress")
        }).catch(() => {
          this.$toast.fail("手机格式不正确")
        })
      else this.$toast.fail("请完善信息")
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box {
  width: 90%;
  margin: auto;
  text-align: initial;
}
</style>
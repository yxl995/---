<template>
  <div class="container">
    <div class="img">
      <img :src="qrCode" style="width: 200px;height: 200px">
    </div>
  </div>
</template>

<script>
import {request} from "../network/request";
import axios from "axios";

export default {
  name: "Pay",
  data() {
    return {
      qrCode: "",
      id: null
    }
  },
  unmounted() {
    window.clearInterval(this.id)
  },
  mounted() {
    request({
      url: `/api/orders/${this.$route.params.id}/pay`,
      headers: {
        'Authorization': "Bearer " + this.$store.state.token
      },
      params: {
        type: "aliyun"
      }
    }).then(res => {
      axios.get("/api", {
        params: {
          key: "27d73ac006de0571f79d598968ce92ee",
          text: res.data.qr_code
        }
      }).then(result => {
        this.qrCode = "data:image/png;base64," + result.data.result.base64_image
      }).catch(() => {
        window.clearInterval(this.id)
      })
    }).catch(() => {
      this.$toast.fail("获取二维码失败")
    })
    this.id = setInterval(() => {
      request({
        url: `/api/orders/${this.$route.params.id}/status`,
        headers: {
          'Authorization': "Bearer " + this.$store.state.token
        }
      }).then(res => {
        if (res.data == 2) {
          window.clearInterval(this.id)
          this.$toast.success("支付成功")
          this.$router.push("/shoppingCart")
        }
      }).catch(() => {
        window.clearInterval(this.id)
      })
    }, 1000)
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  display: flex;
  background-image: url('https://img.zcool.cn/community/019ea15bd41ceba801213dea1ffecb.gif');
  background-size: 100%;
  position: absolute;
  top: 50px;
  bottom: 0;
  margin: 0 !important;
}

.img {
  width: 200px;
  height: 200px;
  background-color: black;
  position: absolute;
  top: 300px;
  left: 87px;
  background-color: rgb(255, 249, 239);
}
</style>
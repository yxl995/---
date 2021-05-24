<template>
  <div class="container">
    <div v-if="$route.params.mode=='password'" class="box">
      <van-field type="password" style="margin: 20px 0;border-radius: 5px" v-model="oldPassword" label="原密码"
                 placeholder="请输入原密码"/>
      <van-field type="password" style="margin: 20px 0;border-radius: 5px" v-model="newPassword" label="新密码"
                 placeholder="请输入新密码"/>
      <van-field type="password" style="margin: 20px 0;border-radius: 5px" v-model="checkPassword" label="确认密码"
                 placeholder="请再次确认密码"/>
      <van-button style="width: 100%;border-radius: 5px;font-size: 18px" @click="updatePassword"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)">修改密码
      </van-button>
    </div>
    <div v-else-if="$route.params.mode=='phone'" class="box">
      <van-field label-width="45" style="margin: 20px 0;border-radius: 5px" v-model="phone"
                 label="手机号" placeholder="请输入新手机号"/>
      <div style="margin: 20px 0;display: flex;justify-content: space-between">
        <van-field label-width="45" style="border-radius: 5px;width: 63%" v-model="code"
                   label="验证码" placeholder="请输入验证码"/>
        <van-button style="border-radius: 5px;width: 34%" @click="sendPhoneCode"
                    color="#DF6C7E" :text="codeBtnText" :disabled="codeIsSend"></van-button>
      </div>
      <van-button style="width: 100%;border-radius: 5px;font-size: 18px" @click="updatePhone"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)">绑定手机
      </van-button>
    </div>
    <div v-else class="box">
      <van-field label-width="45" style="margin: 20px 0;border-radius: 5px" v-model="email"
                 label="邮箱" placeholder="请输入新邮箱"/>
      <div style="margin: 20px 0;display: flex;justify-content: space-between">
        <van-field label-width="45" style="border-radius: 5px;width: 63%" v-model="code"
                   label="验证码" placeholder="请输入验证码"/>
        <van-button style="border-radius: 5px;width: 34%" @click="sendEmailCode"
                    color="#DF6C7E" :text="codeBtnText" :disabled="codeIsSend"></van-button>
      </div>
      <van-button style="width: 100%;border-radius: 5px;font-size: 18px" @click="updateEmail"
                  color="linear-gradient(to right, #DF6C7E, #E1B6D3)">绑定邮箱
      </van-button>
    </div>
  </div>
</template>

<script>
import {request} from "../network/request";

export default {
  name: "ManageInfo",
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      checkPassword: "",
      phone: "",
      code: "",
      codeBtnText: "获取验证码",
      codeIsSend: false,
      timerID: null,
      email: ""
    }
  },
  mounted() {
    if (this.$route.params.mode == "password")
      this.$store.state.headerTitle = "修改密码"
    else if (this.$route.params.mode == "phone")
      this.$store.state.headerTitle = "换绑手机"
    else this.$store.state.headerTitle = "修改邮箱"
  },
  methods: {
    updatePassword() {
      if (this.oldPassword != "" && this.newPassword != "" && this.checkPassword != "") {
        request({
          url: "/api/auth/password/update",
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            old_password: this.oldPassword,
            password: this.newPassword,
            password_confirmation: this.checkPassword
          }
        }).then(() => {
          this.$toast.success("修改成功")
          this.$router.replace("/info")
        }).catch(err => {
          if (err.response.data.message == "The given data was invalid.") this.$toast.fail("密码格式错误或两次密码不一致")
          else this.$toast.fail(err.response.data.message)
        })
      } else {
        this.$toast.fail("请完善信息")
      }
    },
    updatePhone() {
      if (this.phone != "" && this.code != "") {
        request({
          url: "/api/auth/phone/update",
          method: "patch",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            code: this.code,
            phone: this.phone
          }
        }).then(() => {
          this.$toast.success("绑定成功")
          this.$router.replace("/info")
        }).catch(() => {
          this.$toast.fail("验证码错误")
        })
      } else {
        this.$toast.fail("请完善信息")
      }
    },
    sendPhoneCode() {
      if (this.phone != "" && this.phone != this.$store.state.user.phone) {
        request({
          url: "/api/auth/phone/code",
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            phone: this.phone
          }
        }).then(() => {
          this.changeBtnText(300)
        }).catch(err => {
          if (err.response.data.status_code == 422) this.$toast.fail("请填写正确的手机号")
          else this.$toast.fail("发送失败，请重试")
        })
      } else if (this.phone == this.$store.state.user.phone) this.$toast.fail("不能输入原手机号")
      else this.$toast.fail("请填写手机号")
    },
    changeBtnText(time) {
      this.$toast.success("发送成功")
      this.codeIsSend = true
      this.timerID = setInterval(() => {
        time--
        if (time == 0) {
          this.codeBtnText = "获取验证码"
          this.codeIsSend = false
          window.clearInterval(this.timerID)
          this.timerID = null
        } else this.codeBtnText = time + "s"
      }, 1000)
    },
    sendEmailCode() {
      if (this.email != "" && this.email != this.$store.state.user.email) {
        request({
          url: "/api/auth/email/code",
          method: "post",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            email: this.email
          }
        }).then(() => {
          this.changeBtnText(900)
        }).catch(err => {
          console.log(err.response);
          if (err.response.data.status_code == 422) this.$toast.fail("请填写合法邮箱")
          else this.$toast.fail("发送失败，请重试")
        })
      } else if (this.email == this.$store.state.user.email) this.$toast.fail("不能输入原邮箱")
      else this.$toast.fail("请填写邮箱")
    },
    updateEmail() {
      if (this.email != "" && this.code != "") {
        request({
          url: "/api/auth/email/update",
          method: "patch",
          headers: {
            'Authorization': "Bearer " + this.$store.state.token
          },
          data: {
            code: this.code,
            email: this.email
          }
        }).then(() => {
          this.$toast.success("修改成功")
          this.$router.replace("/info")
        }).catch(() => {
          this.$toast.fail("验证码错误")
        })
      } else {
        this.$toast.fail("请完善信息")
      }
    }
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
}

.box {
  width: 80%;
  margin: auto;
  overflow: hidden;
}
</style>